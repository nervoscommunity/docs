---
id: welcome-materials
title: 必备资料
sidebar_label: 必备资料
---

## CKB 基础结构

|内容|链接|
|---|---|
|CKB 数据结构|[RFC 版](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)，[中译版](../../rfcs/0019-data-structures/0019-data-structures.zh)|
|CKB 交易结构|[RFC 版](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)，[中译版](../../rfcs/0022-transaction-structure/0022-transaction-structure.zh)|
|CKB 地址格式|[RFC 版](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md)，[中译版](../../rfcs/0021-ckb-address-format/0021-ckb-address-format.zh)|
|Nervos DAO 使用规则|[RFC 版](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)，[中译版](../../rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.zh)|

---

## 智能合约和工具

### CKB 脚本编程系列

本系列是由 xuejie 创作的关于 CKB 脚本编程的系列教程，包含了 CKB 脚本编写的入门，编写，debug，还包含了 UDT，Type ID 等内容，以及关于 WASM，Duktape 等进阶教程。

* [CKB 脚本编程简介[1]: 验证模型](../../../blog/ckbscript-01)
* [CKB 脚本编程简介[2]: 脚本基础](../../../blog/ckbscript-02)
* [CKB 脚本编程简介[3]: 自定义代币](../../../blog/ckbscript-03)
* [CKB 脚本编程简介[4]: CKB 上实现 WebAssembly](../../../blog/ckbscript-04)
* [CKB 脚本编程简介[5]: 调试](../../../blog/ckbscript-05)
* [CKB 脚本编程简介[6]: Type ID](../../../blog/ckbscript-06)
* [CKB 脚本编程简介[7]: Duktape 高级编程](../../../blog/ckbscript-07)
* [CKB 脚本编程简介[8]: 高性能 WASM](../../../blog/ckbscript-08)
* [CKB 脚本编程简介[9]: 减少 Duktape 脚本的执行周期](../../../blog/ckbscript-09)


### Rust 编写 CKB 脚本合约系列

### Animagus

 Animagus 为 UTXO 模型中遇到的大多数编程难度问题提供解决方案。我们希望 Animagus 能够填补 UTXO 编程模型的空白，真正发挥出 CKB 的全部优势。

* [Animagus 系列文章[1]: 开篇介绍](http://localhost:3000/blog/animagus-01)
* [Animagus 系列文章[2]: 实际运行](http://localhost:3000/blog/animagus-02)

### Keyper

Keyper 是 Nervos 基金会提出的钱包管理 `lock script` 的规范，由于 CKB 主链灵活的架构设计，等主链生态繁荣起来之后会有种类繁多额 `lock script` 来为用户管理 CKB 的归属权，但是各种钱包要支持这些丰富多彩的 `lock script` 将会是一项比较有挑战的工作，基于上述问题，基金会提出了 Keyper 规范，为钱包和 `lock script` 之间提出了规范定义，统一钱包和 `lock script` 的交互模式，便于钱包快速的支持各种有趣的 `lock script`。

* [基于 Keyper Scatter 的 dApp 开发](../../../blog/kyper-scatter)

### Open Transaction

本系列是 Cipher 创作的关于在 CKB 上实现 Open Transaction 的系列文章。Open Transaction（OTX）是故意构造的部分的交易（不是一笔完整的交易），它们可以组合在一起从而形成一笔有效的完整的交易。注意，它不是有效交易的简化版。OTX 对于链下多方协作非常重要。OTX 是基于 UTXO 模型的区块链（如比特币和 Nervos CKB）的关键性基础设施。

* [Open Tx 协议头脑风暴[1]: OTX 概述](../../../blog/otx-01)
* [Open Tx 协议头脑风暴[2]: 在 CKB 上设计一个实用的协议](../../../blog/otx-02)
* [Open Tx 协议头脑风暴[3]: CKB 上的场景分析](../../../blog/otx-03)
* [Open Tx 协议头脑风暴[4]: 一个实现提案](../../../blog/otx-04)

### Live Cell Cache 库

目前正是 CKB 主链 dApp 开发的起始阶段，很多应用都需要灵活的查询 live cells，例如 LockHash、TypeHash、CodeHash 等等查询 Cells，基于这个场景，开发了 [ckb-cache-js](https://github.com/ququzone/ckb-cache-js)。考虑到很多 dApp 的开发技术栈是 JavaScript 或者 TypeScript，因此这个 cache 库是基于 TypeScript 语言开发的。

* [Live Cell Cache 库](../../../blog/cache-js)

---

## 常用链上脚本

### CKB 主网

### CKB 测试网

* `lock`：Secp256k1_blake160_sighash_all

```js
Lock {
  Code_hash: 0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8,
  Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

OutPoint.TxHash:0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e
OutPoint.Index:0
DepType:dep_group
```

* `lock`：Secp256k1_blake160_multisig_all


* `type`：sUDT

```js
Type {
  Code_hash: 0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212
  Hash_type: data
}

//////////////////////////////////////////////////////////////////////////////////

OutPoint.TxHash:0xa18868d6dc6bd7b1a40a515dd801709baec6f64fdf9455e3f9f4c6393b9e8477
OutPoint.Index:0
DepType:code
```

* `lock`：anyone-can-pay

```js
Lock {
  Code_hash:0x6a3982f9d018be7e7228f9e0b765f28ceff6d36e634490856d2b186acf78e79b
  Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps {
OutPoint.TxHash:0x9af66408df4703763acb10871365e4a21f2c3d3bdc06b0ae634a3ad9f18a6525
OutPoint.Index:0
DepType:dep_group
}
```

* `lock`：pw-lock

```js
Lock {
   Code_hash: 0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08,
Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
OutPoint.TxHash:0x25635bf587adacf95c9ad302113648f89ecddc2acfe1ea358ea99f715219c4c5
OutPoint.Index:0
DepType:code
}
```

