---
id: swappable-sign
sidebar_label: blog
title: "可交换的签名验证协议标准"
author: Xuejie Xiao
author_title: Nervos Core Team
author_url: https://github.com/xxuejie
author_image_url: https://avatars3.githubusercontent.com/u/340446?s=400&v=4
tags: [signature verification, xuejie, protocol spec]
---

过去，在 CKB 的锁脚本中，签名验证算法与其他交易验证逻辑是紧密耦合的，比如，[anyone-can-pay](https://github.com/nervosnetwork/ckb-anyone-can-pay) 锁脚本。这样做的一个原因是为了简化 CKB 脚本的任务。在早期，您肯定希望限制您正在处理的范围，以确保构建出的脚本足够安全。

但是慢慢地，我们越来越了解如何构建 CKB 脚本。与此同时，将签名算法和锁脚本逻辑的捆绑带来的问题也逐渐得到关注：假设我们有 N 个签名验证算法，M 个特定的锁脚本逻辑，我们就需要构建 N*M 个锁脚本才能完成所有的组合。这将带来巨大的维护负担，也将会造成链上资源的浪费。关于这个问题，有什么解决办法吗？

<!--truncate-->

本 RFC 试图解决这个问题：通过定义签名算法的公共接口，我们将能够从一个典型的锁脚本中解耦签名验证库。在执行时，锁脚本可以先通过[动态链接](https://www.geeksforgeeks.org/static-and-dynamic-linking-in-operating-systems/)加载签名验证库，然后调用验证库提供的函数来执行实际的签名验证路径。

注意，已经有人尝试解决这个问题，[这里](https://github.com/ashchan/gringotts/tree/6ca0374ec4ac7f5534b2395e648c9bf5353b5a9f/server/contracts)有一个示例，其中实际的锁脚本与 secp256k1 验证库是分开的。

## 规范

这里的规范包括两个部分：一个由所有签名验证库共享的公共库 API；以及一个利用外部签名验证库由所有锁脚本共享的统一工作流程。

### 通用的 API

我们建议将每个遵循规范的签名验证库编译成一个[动态链接的 ELF 库](https://www.intezer.com/blog/elf/executable-linkable-format-101-part-4-dynamic-linking/)，其中包含以下两个公开的函数（在 C ABI 中）：

```c
int load_prefilled_data(void *data, size_t *len);
int validate_signature(void *prefilled_data, const uint8_t *signature_buffer,
    size_t signature_size, const uint8_t *message_buffer, size_t message_size,
    uint8_t *output, size_t *output_len);
```

这里有两种功能，有不同的用途：

#### load_prefilled_data

当代码库需要初始化某些常量数据时，会使用 `load_prefilled_data`，比如用于加速的乘法表。在 CKB 脚本的整个生命周期中，只需要调用该函数一次来初始化数据。所有后面的调用都可以共享相同的预填充数据。

该函数需要支持两种调用模式：

* 当 `data` 为 `NULL`，同时 `len` 是一个地址，是一个值为 0 的变量，函数将预填充数据所需的长度填充到 `len` 表示的地址中。调用者可以使用它来为代码库分配足够的预填充数据。
* 当 `data` 为非 `NULL`，`len` 表示的变量包含足够的长度时，函数将预填充数据填充在从 `data` 字段开始的内存缓冲区。

在任何一种模式下，返回值为 0 表示成功，返回其他值表示失败，并且应该立即触发脚本失败。

#### validate_signature

这是一个执行实际签名验证工作的函数。它将之前生成的预填充数据、可变长度的签名缓冲区和可变长度的消息缓冲区作为输入。然后运行签名验证逻辑，并在需要时，生成数据到输出缓冲区中。这个接口是精心设计的，满足多种情况：

* 对于可恢复的签名算法，签名缓冲区应包含可恢复的签名。公钥或者公钥哈希根据需求，将被生成并填入到输出缓冲区中。锁脚本只需要验证生成的公钥是否与指定的公钥匹配，就像 script 中的 args。
* 对于不可恢复的签名算法，可以将实际签名和公钥放入签名缓冲区中进行验证。在这种情况下，不会生成输出。

在任何一种情况下，返回值为 0 表示成功，返回其他值表示失败，并且应该立即触发脚本失败。

### 锁脚本工作流程

对于一个与本规范相冲突的锁脚本，它需要在某处保留两条信息，最有可能在脚本的 args 部分：

* 一个指定所需使用的签名验证库的哈希
* 附加到签名数据中的一段信息。例如，不可恢复的签名算法可以利用这个位置来嵌入公钥
* 一段与签名验证输出相匹配的信息。根据不同的算法，这可能是任意的长度，甚至是缺失的：比如将 secp256k1 作为可恢复的签名算法的情况下，这将需要 65 字节的长度；而在不可恢复的情况下，这将是缺失的。

执行锁脚本时，需要执行以下步骤：

* 它需要加载上面提到的哈希对应的正确的签名验证库
* 它会调用 `load_prefilled_data` 函数来生成签名验证库所需的数据
* 它会从 witness 中提取签名数据。正如上面提到的，尽管这被命名为签名，但它实际上可能会包含比签名更多的信息，比如不可恢复的签名算法的公钥。
* 用于追加签名数据的信息将被添加，如果存在的话
* 它会根据自己的特定逻辑，计算签名消息
* 它将使用签名和信息从签名验证库中调用 `validate_signature` 函数。如果函数失败，脚本也会失败
* 现在，它将尝试将 `validate_signature` 生成的输出与预期的输出进行匹配。如果是相同的（意味着，如果一个丢失了，另一个也必须是丢失的），脚本将成功，否则，脚本将失败。

## 示例

下面是一个遵循上述规范的签名验证库[示例](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/2224719a754b205a7b19fb4ab6cbd6e3d8d22c81/c/secp256k1_blake2b_sighash_all_dual.c)。

[原文链接](https://talk.nervos.org/t/rfc-swappable-signature-verification-protocol-spec/4802)