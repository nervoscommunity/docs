---
id: 0026-anyone-can-pay.zh
title: Anyone-Can-Pay 锁脚本
sidebar_label: 26：Anyone-Can-Pay 锁脚本
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0026 | Standards Track | Proposal | Xuejie Xiao |Nervos Foundation|2020-09-03|

# Anyone-Can-Pay 锁脚本

本 RFC 描述了一种新的 CKB 锁脚本，它可以用来接收任意数量的[最简 UDT](../0025-simple-udt/0025-simple-udt.md) 或者 CKB。以前，当使用默认锁脚本时，一个用户至少向另一个用户转账 61 个 CKBytes，当使用其他锁脚本或类型脚本时可能会更多。当 UDT 方案在 CKB 中落地后，这将成为一个更大的问题：一个原生的 UDT 转账操作，不仅需要 UDTs，还需要一定数量的 CKBytes 来将 UDT 保存在一个 cell 中。

在这里，我们试图通过引入一个新的任何人都可以支付的锁脚本来解决这一问题，它不仅可以通过验证签名来解锁，还可以通过接收任意金额的转账来进行解锁。这样一来，用户就可以使用 anyone-can-pay 锁来向一个 cell 发送任意数量的 CKBytes 或 UDTs，而不是总是创建一个新的 cell。因此，anyone-can pay 锁脚本为上述两个问题提供了一个解决方案。

## 脚本结构

Anyone-can-pay 锁脚本是在默认的 secp256k1-blake2b-sighash-all 锁脚本的基础上，在脚本 args 部分增加了一些内容。新的 Anyone-can-pay 锁脚本可以接受以下任意一种脚本 args 结构：

```
<20 byte blake160 public key hash>
<20 byte blake160 public key hash> <1 byte CKByte minimum>
<20 byte blake160 public key hash> <1 byte CKByte minimum> <1 byte UDT minimum>
```

新增的 CKByte 和 UDT 最小值强制规定了一个人可以转账到 anyone-can-pay 锁脚本的最小数量。这就提供了一个 cell 层面的对 DDoS 攻击的缓解措施：如果一个 cell 使用的是 anyone-can-pay 的锁脚本，那么攻击者就可以不断地创建只向这个 cell 传输 1 个 shannon 或者 1 个 UDT 的交易，从而使得 cell 的所有者很难使用存放在 cell 中的代币。通过设置最小的转账金额，用户可以提高攻击成本，从而保护自己的 cell 免受 DDoS 攻击。当然，这种机制并不能防止所有类型的 DDoS，但它可以作为一种快速的解决方案来缓解更廉价的 DDoS。

CKByte & UDT 的最小值中存储的值，解释如下：如果字段中存储了 `x`，则最小转账额为 `10^x`，例如：

* 如果在 CKByte 的最小值中存储的是 3，则意味着该 cell 可接受的最小量是 1000 shannon。
* 如果在 UDT 的最小值中存储的是 4，则意味着该 cell 可接受的最小金额为 10000 UDT 基本单位。

请注意，最小值字段是完全可选的，如果没有提供最小值，我们将把最小值视为 0，这就意味着没有最小值。如果没有提供最小值，我们将把最小值视为 0，这意味着在转账操作中没有执行最小值。值得一提的是，不同的最小值也会导致单元格使用不同的锁脚本。

## UDT 释义

Anyone-can-pay 锁脚本假定被锁定的 cell 遵循[最简 UDT 规范](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)，因此该 cell 1）有一个类型脚本，2）cell 的 data 部分至少有 16 个字节。用户要确保只使用最简 UDT 规范的类型脚本的 anyone-can-pay 锁脚本。

## 解锁逻辑

Anyone-can-pay 锁脚本将遵循以下规则：

1. 如果提供了签名，它的工作原理和默认的 secp256k1-blake2b-sighash-all 锁脚本完全一样，如果在 witness 中提供了签名，并且可以验证，则锁脚本将返回成功状态。

    1.a. 如果提供的签名没有通过验证，锁脚本将返回错误状态

2. 如果没有提供签名，锁脚本将按照如下方式执行 anyone-can-pay 的逻辑：

    2.a. 循环浏览所有输入中使用 anyone-can-pay 锁脚本的 cells（注意，这里所说的锁脚本指的是公钥哈希，也就是说如果一笔交易中包含两个都使用 anyone-can-pay 锁代码，但是公钥哈希不同，它们将被视为不同的锁脚本，并且每个 cell 都将独立地检查其脚本解锁规则），如果两个输入的 cells 使用相同的类型脚本，或者都缺少类型脚本，锁脚本将会返回错误状态。

    2.b. 循环浏览所有输出中使用 anyone-can-pay 锁脚本的 cells，如果 2 个输出 cells 使用了相同的类型脚本，或者都缺少类型脚本，则锁脚本将会返回错误状态。

    2.c. 循环浏览所有输入和输出中使用 anyone-can-pay 锁脚本的 cells，如果有一个 cell 缺少类型脚本，但是它设置了 data，则返回错误状态。

    2.d. 循环浏览所有输入和输出中使用 anyone-can-pay 锁脚本的 cells，如果有一个 cell 有类型脚本，但是它的 data 部分少于 16 个字节，则返回错误状态。

    2.e. 然后对输入 cells 和输出 cells 进行类型脚本的匹配（没有类型脚本的输入 cell 将与没有类型脚本的输出 cell 进行匹配）。如果有一个输入 cell 没有匹配到输出 cell，或者有一个输出 cell 没有匹配到输入 cell，则将返回错误状态。

    2.f. 循环浏览所有输入和输出 cells 对，如果有一对 cells 中输入 cell 的 CKBytes 比输出 cell 多；或者一对都有类型脚本和 data 部分的 cells，但是输入 cell 的 UDT 比输出 cell 的多，则将返回错误状态。

    2.g. 如果设置了 CKByte minimum 或 UDT minimum，则循环历遍所有的输入和输出 cells。如果不能找到一对输入和输出 cells，其中输出量大于或等于输入量加上设定的最小值，则将返回错误状态。注意，如果同时设置了 CKByte minimum 和 UDT minimum，则只需要匹配一个最小值。

限制每个锁/类型脚本组合中一个输入 cell 和一个输出 cell 的原因是，锁脚本应该防止攻击者合并或者拆分 cells：

* 允许合并 anyone-can-pay cells 会导致可用 cells 减少，从而导致可用性问题。例如，一个交易所可能会创建数百个 anyone-can-pay cells 来进行并行处理，这样存款交易就不太可能会相互冲突。

* 允许拆分 anyone-can-pay cells 会带来 2 个问题：1）它增加了链上 CKByte 的使用量，给矿工带来了不必要的压力；2）当矿工以后想要在 anyone-can-pay 的 cells 中认领代币时，可能会导致费用的增加，因为比预期更多的输入 cells 会导致交易大小的增加和验证 cycle 的增加。

考虑到这些因素，anyone-can-pay 锁脚本在这里禁止非所有者合并或拆分  anyone-can-pay cells，因为在每个锁/类型组合中允许有一个以上的输入/输出 anyone-can-pay cells，只会使得验证规则变得更麻烦，而不会有其他显著收益。

## 例子

这里我们描述一个常用的包含 anyone-can-pay 锁脚本的交易示例。

### 创建一个 Anyone-can-pay Cell

```
Inputs:
    Normal Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash A>
Outputs:
    Anyone-can-pay Cell:
        Capacity: 999.99 CKBytes
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash B> <CKByte minimum: 9> <UDT minimum: 5>
        Data:
            Amount: 0 UDT
Witnesses:
    <valid signature for public key hash A>
```

注意，这里我们假设 0.01 CKByte 作为交易手续费，在生产过程中应该根据交易大小、运行 cycles 以及网络状态等因素来计算费用。为了简单起见，在所有的例子中都将使用 0.01 CKByte 作为交易手续费。这笔交易中创建的 anyone-can-pay cell 分别设定 10^9 shannons（10 CKBytes）和 10^5 UDT 基本单位作为最小转账值。

### 通过签名进行解锁

```
Inputs:
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 2>
Outputs:
    Normal Cell:
        Capacity: 999.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
Witnesses:
    <valid signature for public key hash A>
```

当提供签名时，cell 可以按照所有者的意愿以任何方式解锁，这里的 anyone-can-pay lock 只是作为一个正常的 cell。在这个例子中，这个 anyone-can-pay cell 会被转换回普通 cell。

### 没有类型脚本的 cells 通过 CKB 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 2>
Outputs:
    Deposit Change Cell:
        Capacity: 479.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
    Anyone-can-pay Cell:
        Capacity: 1020 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
Witnesses:
    <valid signature for public key hash B>
```

这里的交易不包含 anyone-can-pay cell 的签名，但当 anyone-can-pay lock 检测到有人向自己存入 20 CKBytes 时，它就成功地通过了验证。请注意，这个用例根本不涉及到 UDT，这里的 anyone-can-pay lock 是用来克服普通转账需要至少 61 CKBytes 这一要求的。

### 通过 UDT 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Outputs:
    Deposit Change Cell:
        Capacity: 499.99 CKB
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 199999 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3001 UDT
Witnesses:
    <valid signature for public key hash B>
```

在这里，我们将存入 1 个 UDT 到 anyone-can-pay cell 中。因为除了公钥哈希之外，anyone-can-apy 的锁脚本中没有额外参数，所以该 cell 没有强制执行最小 CKByte 或 UDT 可转限额，这里将接受 1 UDT 的转账。

### 有最小可转限额的情况下，通过 CKB 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 9> <UDT minimum: 5>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Outputs:
    Deposit Change Cell:
        Capacity: 489.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1010 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Witnesses:
    <valid signature for public key hash B>
```

这里的 CKByte 最小可转数额设置为 9，也就是说在每次交易中，至少要向 anyone-can-pay cell 转账 `10^9` shannons，也就是 10 CKBytes。需要注意的是，即使 UDT 最小可转数额设置为 5，意味着至少要向 anyone-can-pay cell 转账 100000 个 UDT 基本单位，但仅满足 CKByte 最小转账金额就已经满足验证规则了，所以允许 CKB 接受交易。同样，不同的交易可能向 anyone-can-pay cell 发送100000 个 UDT 基本单位，而不发送任何 CKByte，这样也能满足这里的 anyone-can-pay cell 的验证规则。

## 注意

上述的 anyone-can-pay lock 规范的实现已经部署到了 CKB 主网 Lina 上，在[这里](https://explorer.nervos.org/transaction/0xd032647ee7b5e7e28e73688d80ffc5fba306ee216ca43be4a762ec7e989a3daa)。在[这里](https://explorer.nervos.org/transaction/0xa05f28c9b867f8c5682039c10d8e864cf661685252aa74a008d255c33813bb81)，还部署了一个 dep 组格式的 cell，其中包含了 anyone-can-pay lock 和所需的 secp256k1 数据 cell。

支持可重复使用的构建方式来验证部署脚本。要编译上面部署的 anyone-can-pay 锁脚本，可以通过以下步骤：

```bash
$ git clone https://github.com/nervosnetwork/ckb-anyone-can-pay
$ cd ckb-anyone-can-pay
$ git checkout deac6801a95596d74e2da8f2f1a6727309d36100
$ git submodule update --init
$ make all-via-docker
```

现在你可以比较一下在 `spec/cells/anyone_can_pay` 生成的 anyone-can-pay 脚本和部署在 CKB 上的脚本，它们应该是相同的。

这个规范的草案已经在[这里](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438) Nervos 社区中发布、审查和讨论了一段时间。