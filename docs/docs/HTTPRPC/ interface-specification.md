---
id: interface-specification
title: 概述
sidebar_label: 概述
---

Nervos 节点的 `RPC` 接口 遵循着一套公开的接口规范。

RPC 接口会返回节点的版本信息，该信息在 `local_node_info` 中返回。
RPC 接口在升级的版本之间是完全可兼容的，例如，对于 0.25.0 的客户端，可以使用 0.25.x 以上的版本。

## 使用公开节点

通常情况下，开发者自己运行节点是极为不便的。因此，Nervos 提供了测试网 `Aggron` 节点以及主网 `Lina` 节点供开发者使用，它们均支持 `RPC` 调用。

* 主网 `Lina` 节点

> 主网 - Node RPC
* https://mainnet.ckb.dev/
* https://mainnet.ckb.dev/rpc

> 主网 - Indexer RPC
* https://mainnet.ckb.dev/indexer_rpc


* 测试网 `Aggron` 节点

> 测试网 - Node RPC
* https://testnet.ckb.dev/
* https://testnet.ckb.dev/rpc

> 测试网 - Indexer RPC
* https://testnet.ckb.dev/indexer_rpc

其中 CKB 主网和测试网代码参见：[CKB](https://github.com/nervosnetwork/ckb)，Indexer PRC 参见：[ckb-indexer](https://github.com/nervosnetwork/ckb-indexer)

请注意接口限制:
* rate: 20 req / s
* burst: 20 req / s
* 超出限制会收到 500 错。

如果你希望基于 `Aggron` 测试网进行开发，你可以在[水龙头](https://faucet.nervos.org/)申请测试所需的 `CKB`。

## 部署个人节点

根据开发者需要，我们也提供了搭建节点的方法，请参见 [CKB 客户端](../client/client-overview)一节。