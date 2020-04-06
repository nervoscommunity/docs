---
id: client-overview
title: 概述
sidebar_label: 概述
---

Nervos CKB 提供了基于 CKB-VM 和 cell 模型的图灵完备的编程模型，具有广阔的潜力，可以作为许多新型应用程序的平台。

我们欢迎开发人员提供热情，创新和多样化的想法来共同改善 Nervos。

如果您不熟悉使用 Nervos CKB 进行开发，那么您来对地方了。

本单元将向您介绍 Nervos CKB 客户端，该工具可能与您熟悉的其他应用程序开发有所不同。

Nervos 提供了`ckb-cli`，`CKB 全节点`，`Neuron 钱包`等一系列工具，帮助您连接 CKB 网络，发送交易。

### 网络介绍

目前 CKB 有 3 种运行环境：

 - mainnet 主网，就是 ckb 正在运行的主网络，区块浏览器：https://explorer.nervos.org/。

 - testnet 测试网，用于公开测试，需要从[水龙头](https://faucet.nervos.org/)获取测试币才能部署脚本，区块浏览器：https://explorer.nervos.org/aggron/。

 - dev 是本地的开发网络，用于本地测试，不需要对外公开，在本地运行节点，开启挖矿程序，就可以持续地获得测试币。