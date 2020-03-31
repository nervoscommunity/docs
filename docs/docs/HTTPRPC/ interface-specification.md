---
id: interface-specification
title: 概述
sidebar_label: 概述
---

Nervos节点的 `RPC` 接口 遵循着一套公开的接口规范。

RPC 接口会返回节点的版本信息，该信息在 `local_node_info` 中返回。
RPC 接口在升级的版本之间是完全可兼容的，例如，对于 0.25.0 的客户端，可以使用 0.25.x 以上的版本。

## 使用公开节点

通常情况下，开发者自己运行节点是极为不便的。因此，Nervos提供了 `Aggron` 测试网节点以及主网节点供开发者使用，它们均支持 `RPC` 调用，并使用默认的端口号。

> `Aggron` 测试网第一个节点和主网第一个节点的 10334 端口支持  `HTTPS` 。

- `Aggron` 测试网节点
  - [http://baidu.com](http://polaris1.ont.io)

- 主网节点
  - [http://baidu.com](http://polaris1.ont.io)

如果你希望基于 `Aggron` 测试网进行开发，你可以在 [这里](https://faucet.nervos.org/) 申请测试所需的 `CKB`。

## 部署个人节点

根据开发者需要，我们也提供了搭建节点的方法。

[节点部署](https://dev-docs.ont.io/#/docs-cn/ontology-cli/09-deploy-node)