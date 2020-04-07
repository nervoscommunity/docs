---
id: explorer-overview
title: 概述
sidebar_label: 概述
---

[Github](https://github.com/nervosnetwork/ckb-explorer) | [Lina 主网](https://explorer.nervos.org/) | [Aggron 测试网](https://explorer.nervos.org/aggron/)| [API](https://nervosnetwork.github.io/ckb-explorer/public/api_doc.html#introduction)

CKB Explorer 允许您浏览地址，代币，区块，哈希率，Nervos DAO 的信息以及在 Nervos CKB 上进行的所有其他活动。

**请注意，CKB Explorer 不是钱包服务提供商，我们不会存储您的私钥，也无法控制 CKB 网络上发生的交易。**

本节我们将对 CKB Explorer 进行整体介绍:

## 导航栏

CKB Explorer 同时支持 Lina Mainnet 和 Aggron Testnet。您可以通过区块/交易/地址/ `Lock Hash` 来进行搜索。
您也可以点击 "图表 "和 "Nervos DAO" 了解更多详情。

![](/img/docs/explorer/navigation.png)

到目前为止，"图表" 包括 "难度与哈希率"、"难度与叔块率"、"交易数"、"地址数"、"Cell 数"、"Nervos DAO 存款总额 "和 "余额排名"。

我们将继续优化相关功能，深入数据来进行分析。

![](/img/docs/explorer/charts.png)

`Nervos DAO` 显示关于 Nervos DAO 的详细信息，如存款总额、存款地址数和交易数。您可以通过 "交易/地址" 搜索来查找 Nervos DAO 中锁定的 CKBytes 数量。

特别是，我们为前 100 名储户提供了一个排名榜单，以感谢大家对 Nervos 生态圈的贡献。

![](/img/docs/explorer/nervosdao1.png)
![](/img/docs/explorer/nervosdao2.png)

## 主界面

主界面显示区块链状态和区块列表。可以方便地浏览 Lina Mainnet 或 Aggron Testnet 的信息。

您还可以点击绿色的链接来查看区块的详细信息和这些区块中的地址相关交易。

`Reward（CKB）` 显示主要奖励（不是整个区块奖励）。根据 [CKB共识协议](../../rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.zh)，区块奖励有四个部分：基础奖励、二级奖励、提交奖励和确认奖励。

区块奖励是在该区块传播 11 个区块后发放的，如果你想查看整个区块的奖励，可以在区块的 "概览" 中查看 "区块奖励"。

![](/img/docs/explorer/block1.png)
![](/img/docs/explorer/block2.png)
