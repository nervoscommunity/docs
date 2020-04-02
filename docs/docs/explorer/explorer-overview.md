---
id: explorer-overview
title: 概述
sidebar_label: 概述
---

[Github](https://github.com/nervosnetwork/ckb-explorer) | [Lina 主网](https://explorer.nervos.org/) | [Aggron 测试网](https://explorer.nervos.org/aggron/)| [API](https://nervosnetwork.github.io/ckb-explorer/public/api_doc.html#introduction)

CKB Explorer允许您浏览地址，代币，区块，哈希率，Nervos DAO的信息以及在Nervos CKB上进行的所有其他活动。

**请注意，CKB Explorer不是钱包服务提供商，我们不会存储您的私钥，也无法控制CKB网络上发生的交易。**

In this section we will give an overall introduction to CKB-Explorer:

### Navigation bar 

CKB-Explorer supports both Lina Mainnet and Aggron Testnet. You can search by block/Transaction/Address/Lock Hash.
Also you can click `Charts` and `Nervos DAO` for more details.

![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/navigation.png)

So far,  `Charts` includes 「Difficulty & Hash Rate」,「Difficulty & Uncle Rate」,「Transaction Count」,「Address Count」,「Cell Count」,「Total Nervos DAO deposit 」, and「 Balance Ranking」

We will continue to optimize the related features to allow “deep dives” on data and analytics. 

![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/charts.png)

`Nervos DAO` displays detailed information about Nervos DAO, such as total deposit, deposit addresses count and transactions. You can search to find your CKBytes locked in the Nervos DAO by `Transaction/Address`

In particular, we provide a ranking list for the top 100 depositors to thank people for their contributions to the Nervos ecosystem.

![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/nervosdao1.png)
![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/nervosdao2.png)

### The main interface

The main interface displays blockchain status and blocks’ list. It’s convenient for skimming through Lina Mainnet or Aggron Testnet’s info.

You can also click the green colored links to view block details and the address related transactions in those blocks. 

 `Reward（CKB）`displays the primary reward (which isn’t the whole block reward). According to [CKB Consensus Protocol](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md), there are four parts of the block reward: primary reward, secondary reward, commit reward and proposal reward. 

The secondary reward, commit reward and proposal reward are calculated after block propagation, if you want to view the whole block reward, you can check the `Block Reward` in Block’s  `Overview`.

![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/block1.png)
![](https://raw.githubusercontent.com/nervosnetwork/docs/master/docs/assets/ckb-explorer/block2.png)
