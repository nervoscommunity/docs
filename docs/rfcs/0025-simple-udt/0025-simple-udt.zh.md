---
id: 0025-simple-udt.zh
title: 最简 UDT
sidebar_label: 25：最简 UDT
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0025 | Standards Track | Proposal | Xuejie Xiao |Nervos Foundation|2020-09-03|

# 最简 UDT（Simple UDT）

本 RFC 定义了一个简单的用户自定义代币（最简 UDT 或 SUDT）规范。最简 UDT 为 dapp 开发者提供了一种在 Nervos CKB 上发行自定义代币的方法。最简 UDT 为什么叫做最简，这是因为我们定义了一个最小的标准，仅包含了不可缺少的内容，更多复杂的操作则留给灵活的 CKB 去实现。

## 数据结构

### SUDT Cell

在最简 UDT 规范下，一个 SUDT cell 的格式如下：

```
data:
    amount: uint128
type:
    code_hash: simple_udt type script
    args: owner lock script hash (...)
lock:
    <user_defined>
```

SUDT cell 应满足以下规则：

* **最简 UDT 规则 1**：SUDT cell 必须在 cell data 字段的前 16 个字节中存储 SUDT 的数额，数额应该以小字节序（little endian），128 位无符号整数格式进行存储。如果是可合成的脚本，data 字段对应于合成 SUDT 的脚本，而 SUDT 对应的数量仍然必须位于 data 字段的前 16 个字节。
* **最简 UDT 规则 2**：SUDT cell 的 type script 的 args 的前 32 个字节必须存储 *所有者的 lock* 的 lock script 的哈希，*所有者的 lock* 将会在下面进行解释。
* **最简 UDT 规则 3**：每个 SUDT 必须有唯一的 type script，换句话说，两个使用相同 type script 的 SUDT cell 会被认为是同一个 SUDT。

### 所有者的 lock script

所有者的 lock 会被用于治理，比如发行、增发、销毁以及其他操作。SUDT 的规则并没有对所有者的 lock script 的行为制定特定的规则。当然，所有者 lock script 至少应该提供足够的安全性，以确保只有代币所有者可以执行治理操作。

## 操作

这一节描述了在最简 UDT 中实现必须支持的操作。

### 转账

转账操作是指将一个或多个 SUDT 持有者的 SUDT 转账给其他 SUDT 持有者。

```
// 转账
Inputs:
    <vec> SUDT_Cell
        Data:
            amount: uint128
        Type:
            code_hash: simple_udt type script
            args: owner lock script hash (...)
        Lock:
            <user defined>
    <...>
Outputs:
    <vec> SUDT_Cell
        Data:
            amount: uint128
        Type:
            code_hash: simple_udt type script
            args: owner lock script hash (...)
        Lock:
            <user defined>
    <...>
```

转账操作必须满足以下规则：

* **最简 UDT 规则 4**：在转账交易中，所有 input cells 的所有 SUDT 代币之和必须大于或等于所有 output cells 的所有 SUDT 代币之和。允许输入的 SUDT 多于输出的 SUDT，允许销毁代币。

## 治理操作

本节描述了最简 UDT 规范应支持的治理操作。所有治理操作必须满足以下规则：

* **最简 UDT 规则 5**：在治理操作中，交易中至少有一个 input cell 需使用 SUDT 指定的所有者 lock 作为其 cell 的 lock。

### 发行/增发 SUDT

本操作允许发行新 SUDTs。

```
// 发行新 SUDT
Inputs:
    <... one of the input cell must have owner lock script as lock>
Outputs:
    SUDT_Cell:
        Data:
            amount: uint128
        Type:
            code_hash: simple_udt type script
            args: owner lock script hash (...)
        Lock:
            <user defined>
```

## Notes

上述最简 UDT 规范的实现已经部署到了 CKB 主网 Lina 上[这里](https://explorer.nervos.org/transaction/0xc7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d5)。

CKB 支持可重复使用的构建来验证部署的脚本。要编译上述部署的最简 UDT 脚本，可以使用以下步骤：

```bash
$ git clone https://github.com/nervosnetwork/ckb-miscellaneous-scripts
$ cd ckb-miscellaneous-scripts
$ git checkout 175b8b0933340f9a7b41d34106869473d575b17a
$ git submodule update --init
$ make all-via-docker
```

现在你可以比较以下在 `build/simple_udt` 生成的最简 UDT 脚本和已经部署到 CKB 主网的最简 UDT 脚本，它们应该是相同的。

这个最简 UDT 规范的草案已经在[这里](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) Nervos 社区中发布、审查和讨论了一段时间。
