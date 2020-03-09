---
id: about-muta
title: Muta 是什么
sidebar_label: Muta 是什么
---

先简单介绍一下 Muta 的定位，Muta 项目本身是一个高性能的区块链框架，同时适用于用 Muta 搭建公有链或者联盟链。Muta 对标的项目是 Cosmos 的 SDK 或者 Polkadot 的 Substrate，Cosmos SDK 和 Substrate 都是用来做应用链，区别是用 Substrate 或者 Cosmos SDK 都是为了他们的中心节点，比如 Cosmos hub 挥着 Polkadot 优化过的，必须要接回去，特性才能发挥。而 Muta 的定位更通用一些，你不经可以用 Muta 搭建基于 CKB 上的 Layer 2 侧链，也可以用 Muta 独立开发公链，比如火币金融公链，底层就是基于 Muta 开发的。

Muta 目前还在不断完善，CKB 的 Layer 2 协议也在设计阶段，可以非常明确的说，基于 Muta 实现的测链或者公链项目可以跨到 CKB 上，是 Muta 项目的重要目标，是确定会实现的。其他公链并不需要借助 Muta，会有其他 CKB 之上的应用组件或者第三方库可以方便的实现从 Bitcoin 或者 Ethereum 跨链到 CKB。

Muta 跨到 CKB 上，Muta 所在的层次相对于 CKB 是 Layer 2 层，由于分层架构带来的好处，在 Layer 2 层面的任何情况，都不会影响底层 CKB 的共识，也自然不需要 ckb 做任何形式的分叉操作。底层 CKB 的分叉，不管是因为要解决问题，还是要升级协议，本质上都是先有社区共识，才会有实际的分叉被执行。

