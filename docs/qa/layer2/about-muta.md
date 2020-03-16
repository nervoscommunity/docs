---
id: about-muta
title: Muta 是什么
sidebar_label: 链协议：Muta 是什么
---

Github：https://github.com/nervosnetwork/muta
Muta 文档：https://nervosnetwork.github.io/muta-docs/#/

## 什么是 Muta？

Nervos Layer2 的分为**基于链的协议**和**基于 Channel （通道）的协议**，两个方向。

Muta 是基于链的协议，是一个高度可定制的高性能的区块链框架。

它内置了具有高吞吐量和低延迟特性的类 BFT 共识算法「Overlord」，并且可以支持不同的虚拟机，包括 CKB-VM、EVM 和 WASM。Muta 具有跨 VM 的互操作性，不同的虚拟机可以同时在一条基于 Muta 搭建的区块链中使用。Muta 由 Nervos 团队开发，旨在让世界上任何一个人都可以搭建属于他们自己的区块链，同时享受 Nervos CKB 所带来的安全性和最终性。

开发者可以基于 Muta 定制开发 PoA、PoS 或者 DPoS 链，并且可以使用不同的经济模型和治理模型进行部署。开发者也可以基于 Muta 来开发不同的应用链（例如 DEX 链），以实现某种特定的业务逻辑。

Muta 的核心理念是使一个区块链状态转换的开发尽可能的灵活和简便，也就是说在降低开发者搭建高性能区块链障碍的同时，仍然最大限度地保证其灵活性以方便开发者可以自由定制他们的协议。因此，作为一个高度可定制的高性能区块链框架，Muta 提供了一个区块链系统需要有的基础核心组件，开发者可以自由定制链的功能部分。

## Muta 的定位

Muta 本身是一个高性能的区块链框架，同时适用于搭建公有链或者联盟链。Muta 对标的项目是 Cosmos 的 SDK 或者 Polkadot 的 Substrate，Cosmos SDK 和 Substrate 都是用来做应用链，区别是用 Substrate 或者 Cosmos SDK 都是为了他们的中心节点，比如 Cosmos hub 挥着 Polkadot 优化过的，必须要接回去，特性才能发挥。而 Muta 的定位更通用一些，你不经可以用 Muta 搭建基于 CKB 上的 Layer 2 侧链，也可以用 Muta 独立开发公链，比如火币金融公链，底层就是基于 Muta 开发的。

Muta 目前还在不断完善，CKB 的 Layer 2 协议也在设计阶段，可以非常明确的说，基于 Muta 实现的测链或者公链项目可以跨到 CKB 上，是 Muta 项目的重要目标，是确定会实现的。其他公链并不需要借助 Muta，会有其他 CKB 之上的应用组件或者第三方库可以方便的实现从 Bitcoin 或者 Ethereum 跨链到 CKB。

Muta 跨到 CKB 上，Muta 所在的层次相对于 CKB 是 Layer 2 层，由于分层架构带来的好处，在 Layer 2 层面的任何情况，都不会影响底层 CKB 的共识，也自然不需要 ckb 做任何形式的分叉操作。底层 CKB 的分叉，不管是因为要解决问题，还是要升级协议，本质上都是先有社区共识，才会有实际的分叉被执行。

## Muta 提供哪些基础核心组件？

Muta 框架提供了搭建一个分布式区块链网络所需的全部核心组件：

* [交易池](https://nervosnetwork.github.io/muta-docs/#/transaction_pool)
* [P2P 网络](https://nervosnetwork.github.io/muta-docs/#/network)
* [共识](https://nervosnetwork.github.io/muta-docs/#/overlord)
* [存储](https://nervosnetwork.github.io/muta-docs/#/storage)

## 开发者需要自己实现哪些部分？

开发者可以通过开发 Service 来定制链的功能部分。

Muta 框架将用户自定义部分抽象成一个 Service，同时提供 ServiceSDK 让 Service 开发变得简单和高效。每个 Service 完成一个相对独立的功能，单独维护自己的存储和操作接口，类似一个运行在沙盒里的小型状态机。开发者可以使用 Service 开发链的治理模块、业务逻辑，甚至是将虚拟机接入区块链。除了开发自己的 Service，你也可以复用他人已经开发好的 Service，未来 Muta 框架会提供许多常见功能的 Service，如 Asset、Risc-V 虚拟机、DPoS、多签治理等等。Service 之间可以互相调用，这些 Service 共同组成了链的状态机部分，通过框架接口将状态机接入区块链底层组件，一条专属你的全新链就开发完成啦。

换句话说，使用 Muta 框架开发你自己的区块链只需 3 步：

1. 思考自己链的专属需求，确定需要哪些 Service
2. 如果需要的 Service 有现成的，可以直接复用；如果没有，可以自己开发
3. 将这些 Service 接入框架，编译运行！

* [Service 开发指南](https://nervosnetwork.github.io/muta-docs/#/service_dev)
* [Service 示例](https://nervosnetwork.github.io/muta-docs/#/service_eg)