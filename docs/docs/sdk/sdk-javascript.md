---
id: sdk-javascript
title: JavaScript SDK
sidebar_label: JavaScript SDK
---

## SDK 介绍

`@nervosnetwork/ckb-sdk-core` 是用于与 [Nervos CKB](https://github.com/nervosnetwork/ckb) 交互的 JavaScript SDK，目前支持：

本地钱包管理、数字身份管理、数字资产管理、智能合约部署和调用以及资产转账等等。未来还将支持更丰富的功能和应用。

## 主要功能
* 钱包文件规范
* 数字身份及可信声明
* 数字资产
* 智能合约的部署和调用
* 错误码

## 安装

```
$ yarn add @nervosnetwork/ckb-sdk-core # install the SDK into your project
```

## Modules

JS SDK 包含以下几个模块:

### RPC

RPC 模块用于与 Nervos RPC 进行交互，完整 RPC 列表可在 [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs) 找到。

接口在该模块 `DefaultRPC` 类中。

### Utils

Utils 模块提供了 SDK 的常用功能

### Types

Types 模块用于根据 [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs) 项目提供 CKB 组件的类型定义.

CKB Project compiles to the snake case convetion, which listed in the types/CKB_RPC in the RPC module.

TypeScript compiles to the PascalCase convention, which listed in this module.

## 与节点进行长链接

请添加 `httpAgent` 或 `httpsAgent` 来开启长连接。

如果 SDK 是运行在 `NodeJS` 环境中，请参考如下示例:

```javascript
// HTTP Agent
const http = require('http')
const httpAgent = new http.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpAgent })

// HTTPS Agent
const https = require('https')
const httpsAgent = new https.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpsAgent })
```

## 示例

1. [发送交易](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendSimpleTransaction.js)
2. [发送所有余额](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendAllBalance.js)
3. [使用多个私钥发送交易](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransactionWithMultiplePrivateKey.js)
4. [存取 Nervos Dao](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/nervosDAO.js)
