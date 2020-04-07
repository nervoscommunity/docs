---
id: script-udt-instruction
title: UDT 合约介绍
sidebar_label: UDT 合约介绍
---

## 概述

UDT 全称是 User Defined Token，用户定义代币，可以理解为 Ethereum 网络中的 [ERC 20](https://eips.ethereum.org/EIPS/eip-20) 代币。CKB 的典型用途之一是在其上发行用户定义代币（UDT）。这意味着任何人都可以设计和创建代表不同类型资产的代币，而不需要从头开始建立一个新的公共区块链。

就像原生代币 CKB 一样，UDT 也存储在 cells 中。这意味着你可以像转移 CKB 代币一样转移 UDTs，UDTs 是 CKB 网络中的一等公民（First Class Assets）。这与 Ethereum 不同，Ethereum 上的 UDT（如 ERC 20 或 [ERC 721](https://eips.ethereum.org/EIPS/eip-721)）是由智能合约账户发行和存储的，因此用户只能通过合约来控制他们的 UDT 资产，而不是由用户自己直接控制。

### 数据结构

Simple UDT 的 Cell 结构如下所示:

```js
data:
    amount: uint128
type:
    code_hash: simple_udt type script
    args: owner lock script hash (...)
lock:
    <user_defined>
```
它遵循如下规范：

1. 一个 sUDT cell 必须将 sUDT 金额存储在 cell `Data` 段的前 16 个字节中，金额应以小数，`uint128` 格式存储。在复合 script 的情况下，sUDT 金额仍然必须位于与组成的 sUDT script 相对应的 `Data` 段中的最开始的 16 个字节。
2. sUDT cell 的 `type script` 的 `args` 的前 32 个字节必须存储所有者的特定 Hash，以保证安全性。
3. 每个 sUDT 必须有唯一的 `type script`，换句话说，两个使用相同 `type script` 的 sUDT cell 被认为是同一个 sUDT。


### 转账数据结构

Simple UDT 的转账结构如下所示:

```js
// Transfer
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

4. 在一个转账交易中，所有输入 cell 的所有 sUDT 代币之和必须大于或等于所有输出 cell 的所有 sUDT 代币之和。如果允许输入 sUDT 比输出 sUDT 多，就可以销毁 Token.

### 发行新 UDT 结构

```js
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

> 下一小节，我们将要带你来发行一个新的UDT！

### 参考资料

[RFC：Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)
