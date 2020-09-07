---
id: 0024-ckb-system-script-list.zh
title: CKB 系统脚本列表
sidebar_label: 24：CKB 系统脚本列表
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0024 | Informational | Draft | Dylan Duan |Nervos Foundation|2020-05-21|

# CKB 系统脚本列表

## 摘要

系统脚本是由 CKB 核心团队构建和部署的智能合约。系统脚本以一种灵活的方式补充了 CKB 的功能。系统脚本提供了很多核心功能（比如 [SECP256k1/blake160](#secp256k1blake160) 和 [Nervos DAO](#nervos-dao))），共享的标准实现（比如 [Simple UDT](#simple-udt)）以及其他辅助的基础设施组件。本文档介绍了所有 Nervos CKB 中的系统脚本的信息，包括了一段简要的介绍，在 CKB 主网 Lina 和测试网 Aggron 上的 _code_hash_，_hash_type_，_out_point_(_tx_hash_ and _index_)，_dep_type_。

## 动机

在 dapps、钱包和其他应用开发中，系统脚本会被频繁地使用。希望本文整理的系统脚本列表可以为开发者们提供一些便利。

## 系统脚本列表

- [Locks](#locks)
  - [SECP256K1/blake160](#secp256k1blake160)
  - [SECP256K1/multisig](#secp256k1multisig)
  - [anyone_can_pay](#anyone_can_pay)

- [Types](#typels)
  - [Nervos DAO](#nervos-dao)

- [Standards](#standards)
  - [Simple UDT](#simple-udt)

要使用系统脚本构建交易，需要在主网 Lina 和测试网 Aggron 中获取系统脚本的 _code_hash_, _hash_type_, _out_point_ 和 _dep_type_。

## Locks

### SECP256K1/blake160

[SECP256K1/blake160](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction#p2ph) ([Source Code](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c)) 是默认的锁脚本，用于验证 CKB 交易签名。

SECP256K1/blake160 脚本是 **lock script**:

- Lina

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c` |
| `index`     | `0x0`                                                                |
| `dep_type`  | `dep_group`                                                          |

- Aggron

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37` |
| `index`     | `0x0`                                                                |
| `dep_type`  | `dep_group`                                                          |

### SECP256K1/multisig

[SECP256K1/multisig](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction#multisig) ([Source Code](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c)) 是一个允许一组用户签署一笔交易的脚本。

SECP256K1/multisig 脚本是 **lock script**:

- Lina

| parameter   | value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `code_hash` | `0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8`  |
| `hash_type` | `type`                                                                |
| `tx_hash`   | `0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c` |
| `index`     | `0x1`                                                                 |
| `dep_type`  | `dep_group`                                                           |

- Aggron

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37` |
| `index`     | `0x1`                                                                |
| `dep_type`  | `dep_group`                                                          |

### anyone_can_pay

[anyone_can_pay](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438) ([Source Code](https://github.com/nervosnetwork/ckb-anyone-can-pay)) 允许接收方在资产转移过程中提供 cell 空间。

anyone_can_pay 脚本是 **lock script**:

- Aggron

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c` |
| `index`     | `0x0`                                                                |
| `dep_type`  | `dep_group`                                                          |

## Types

### Nervos DAO

[Nervos DAO](../0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.zh) ([Source Code](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/dao.c)) 是 Nervos DAO 的脚本实现。

Nervos DAO 脚本是 **type script**:

- Lina

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c` |
| `index`     | `0x2`                                                                |
| `dep_type`  | `code`                                                               |

- Aggron

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e` |
| `hash_type` | `type`                                                               |
| `tx_hash`   | `0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f` |
| `index`     | `0x2`                                                                |
| `dep_type`  | `code`                                                               |

## 标准

### Simple UDT

[Simple UDT](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) ([Source Code](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c)) 实现了 Nervos CKB 上用户自定义代币的最小标准。

Simple UDT 脚本是 **type script**:

- Aggron

| parameter   | value                                                                |
| ----------- | -------------------------------------------------------------------- |
| `code_hash` | `0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212` |
| `hash_type` | `data`                                                               |
| `tx_hash`   | `0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958` |
| `index`     | `0x0`                                                                |
| `dep_type`  | `code`                                                               |
