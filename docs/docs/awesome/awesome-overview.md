---
id: awesome-overview
title: 生态项目进展概述
sidebar_label: 生态项目
---

## `跨链` Bitcoin-SPV

[Github](https://github.com/summa-tx/bitcoin-spv/tree/master/c)

#### 简介

[Summa](https://summa.one/) 团队将扩展其 Bitcoin SPV（一组用于处理比特币与其他链之间进行通信的开源库），以支持 Nervos CKB。应用于 CKB 的 Bitcoin SPV 将支持比特币与 CKB 之间的交换、中继和桥接等跨链通信，从而扩大 Nervos 的功能组件，并在标准化的跨链市场中获得新的流动性。


#### 文章

* [Testing Summa’s bitcoin-spv on Nervos](https://medium.com/summa-technology/connecting-bitcoin-and-nervos-529a501d3ad7)
* [专访 James Pretwich —— Nervos Grants 计划首位资助者](https://mp.weixin.qq.com/s/1hivIoTp7sLcmBIkLad30w)

---

## `IDE` CKB Studio

[Github](https://github.com/ObsidianLabs/CKB-Studio-Releases)

#### 简介

[Obsidian Labs](https://www.obsidians.io/) 团队将在 Nervos 网络中为开发者社区构建简单易用的图形化 IDE，以加快 DApp 的开发进程。它将涵盖编码、编译、部署和调试等一些列功能。

#### 文章
* [Installing CKB Studio for Mac](https://medium.com/nervos-ckb-israel/installing-ckb-studio-for-mac-138cc7e76914)
* [CKB Studio 初体验：简单 + 易用](https://mp.weixin.qq.com/s/TjaKOQZdtDnueCW1E5y8cQ)
* [专访黑曜石实验室：关于 Nervos IDE 你想知道的这里都有](https://mp.weixin.qq.com/s/u4Qie1_pQddqSpcqti0ZTg)

---

## `SDK` CKB.PW

[Github](https://github.com/lay2dev/ckb.pw)

#### 简介

[Lay2](https://lay2.dev/) 团队在设计的项目产品 pw-sdk。不同于普通 sdks，通过 pw-sdk 开发的 dApp（简称 pw-dapps）可以直接在比特币，以太坊，EOS，Tron 等钱包中运行。在钱包层面无需进行特定开发即可支持 pw-dapps。实际上，它们甚至不需要支持 Nervos CKB 底层公链，例如 MetaMask 现在就可以运行 pw-dapps。本质上看，任何区块链地址已经是有效的 CKB 地址，并且在使用 pw-dapps 之前无需创建 CKB 钱包。pw-dapps 在用户体验和资产安全性上，和区块链上的本机 dApps 是一样的。

#### 文章

* [p-wallet 是一款怎样的产品？](https://mp.weixin.qq.com/s/AD_AWzX5wDqntOo0rLiUSQ)
* [ckb.pw：让 CKB 随处可用](https://mp.weixin.qq.com/s/CEiNmHFpMEHlZu3Nj3dC4g)

---

## `SDK` One Chain CKB

[Github](https://github.com/BlockABC/one_chain_ckb)|[docs](https://blockabc.github.io/one_chain_ckb/zh-CN/)

#### 简介

One Chain CKB 是一款由 [BlockABC](http://www.abcwallet.com/) 开发的基于 ckb-sdk-js 的新 SDK，它将提供一系列对开发者友好的接口，包括灵活的交易编辑，HD 钱包体系结构的自动派生以及一系列对 CKB 至关重要的工具，使开发者可以更轻松地构建 CKB 交易。