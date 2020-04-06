---
id: script-udt-instruction
title: UDT合约介绍
sidebar_label: UDT合约介绍
---

### 概述

UDT全称是User Defined Token，用户定义代币，可以理解为Ethereum网络中的Erc20代币。CKB的典型用途之一是在其上发行用户定义代币（UDT）。这意味着任何人都可以设计和创建代表不同类型资产的代币，而不需要从头开始建立一个新的公共区块链。

就像原生代币CKB一样，UDT也存储在Cells中。这意味着你可以像转移CKB代币一样转移UDTs。这与Ethereum不同的是，Ethereum上的UDT（如ERC20或ERC721）是由智能合约账户发行和存储的，因此用户只能通过合约来控制他们的UDT资产，而不是由用户自己直接控制。

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

1. 一个SUDT Cell 必须将SUDT金额存储在Cell `Data`段的前16个字节中，金额应以小数，`uint128`格式存储。在复合Script的情况下，SUDT金额仍然必须位于与组成的SUDT Script相对应的`Data`段中的最开始的16个字节。
2. SUDT Cell的Type Script 的args的前32个字节必须存储所有者的特定Hash, 以保证安全性。
3. 每个SUDT必须有唯一的Type Script，换句话说，两个使用相同Type Script的SUDT Cell 被认为是同一个SUDT。


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

1. 在一个转账交易中，所有输入 Cell 的所有SUDT代币之和必须大于或等于所有输出 Cell 的所有SUDT代币之和。如果允许输入SUDT比输出SUDT多，就可以销毁Token.

### 发行新UDT结构

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

### 参考

[RFC: Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)
