---
id: explorer-overview
title: 概述
sidebar_label: 概述
---

[Github](https://github.com/nervosnetwork/ckb-explorer) | [Lina 主网](https://explorer.nervos.org/) | [Aggron 测试网](https://explorer.nervos.org/aggron/)| [API](https://nervosnetwork.github.io/ckb-explorer/public/api_doc.html#introduction)

CKB Explorer允许您浏览地址，代币，区块，哈希率，Nervos DAO的信息以及在Nervos CKB上进行的所有其他活动。

**请注意，CKB Explorer不是钱包服务提供商，我们不会存储您的私钥，也无法控制CKB网络上发生的交易。**

本节我们将对CKB-Explorer进行整体介绍:

### 导航栏

CKB-Explorer同时支持Lina Mainnet和Aggron Testnet。您可以通过区块/交易/地址/`Lock Hash` 来进行搜索。
您也可以点击 "图表 "和 "Nervos DAO "了解更多详情。

![](/img/explorer/navigation.png)

到目前为止，"图表 "包括 "难度与哈希率"、"难度与叔块率"、"交易数"、"地址数"、"Cell数"、"Nervos DAO存款总额 "和 "余额排名"。

我们将继续优化相关功能，深入数据来进行分析。


![](/img/explorer/charts.png)

`Nervos DAO`显示关于Nervos DAO的详细信息，如存款总额、存款地址数和交易数。您可以通过 "交易/地址 "搜索来查找Nervos DAO中锁定的CKBytes。

特别是，我们为前100名储户提供了一个排名榜单，以感谢大家对Nervos生态圈的贡献。

![](/img/explorer/nervosdao1.png)
![](/img/explorer/nervosdao2.png)

### 主界面

主界面显示区块链状态和区块列表。可以方便地浏览Lina Mainnet或Aggron Testnet的信息。

您还可以点击绿色的链接来查看区块的详细信息和这些区块中的地址相关交易。

  `Reward（CKB）`显示主要奖励（不是整个区块奖励）。根据[CKB共识协议](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md)，区块奖励有四个部分：主奖励、次奖励、提交奖励和提议奖励。

二次奖励、提交奖励和提议奖励是在区块传播后计算的，如果你想查看整个区块的奖励，可以在区块的 "概览 "中查看 "区块奖励"。

![](/img/explorer/block1.png)
![](/img/explorer/block2.png)
