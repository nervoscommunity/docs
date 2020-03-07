---
id: welcome
title: 欢迎来到 Nervos 的世界
sidebar_label: 欢迎
---


## 基础名词

### Nervos Network

> Nervos Network 是一个分层架构的公链。我们将其称为 Layer1 和 Layer2，Nervos 认为 Layer1 应该坚持安全和去中心化，在 Layer2 层通过各种扩容方案去解决效率问题。
>
> Nervos 的 Layer1（又叫做底层）是 CKB 网络，是一条采用 PoW 共识的链式结构的区块链。
>
> Nervos 的 Layer2（又叫做上层）包含了一系列的扩容方案，包括但不限于：状态通道、侧链、零知识证明等等。

### CKB

> CKB 是 Nervos Network 的 Layer1 层的原生 Token 的名称。对于 CKB 这个缩写，包含有两层含义：
>
> 第一，CKB 是（Common Knowledge Base 共同知识库）的缩写，“共同知识” 是指一群人共同认同并接受的数据，CKB 上的每一笔交易都是经过全球共识的，我们认为 CKB 网络是所有人存储共同知识的地方。
>
> 第二，CKB 是（Common Knowledge Byte 共同知识字节）的缩写，CKB 不仅仅是 CKB 网络原生代币的简称，它还被赋予了实际的物理意义，在 CKB 网络中，1 CKB = 1 Byte （Byte 字节：是计算机内用于计量存储容量的一种计量单位），CK Byte 就是所有人用来存储共同知识的实际的物理空间。

### CK Byte
> CKB 的一种表示形式，此时强调 CKB 作为 Byte 的存储属性。

### Cell 模型
> CKB 网络上采用的数据结构叫做 Cell 模型，是比特币 UTXO 模型的通用化版本。
>
> Cell 基本结构由四个字段组成：capacity, type script, lock script, data。

### Eaglesong
> CKB 采用的是 PoW 共识，Eaglesong 是 CKB 网络所采用的挖矿算法名称。

### Nervos DAO
> Nervos DAO 是 CKB 网络中的一个智能合约，用户将 CKB 存入 Nervos DAO 后可以获得一定的收益。
>
> CKB 长期持有者可以将 CKB 存入 Nervos DAO，从而使得这部分 CKB 获得抗二级发行稀释的属性。

### Neuron
> Neuron 是 Nervos 团队开发的默认的 CKB 桌面钱包，它的主要功能将是 Token 转账和 Nervos DAO 的操作，而其它功能和应用将由社区和 Nervos 开发团队共同实现。

### CKB-VM
> CKB-VM 是 Nervos 基于 RISC-V 开源指令集自主研发的虚拟机。

### Muta
> Muta 是一个高度可定制的高性能区块链框架，同时适用于公有链和联盟链。开发者可以基于 Muta 定制开发 PoA、PoS 或者 DPoS 链，并且可以使用不同的经济模型和治理模型进行部署，是 Nervos Network 为 Layer2 层提供的一个开源且易于使用的侧链方案。
>
> Muta 和 CKB 之间的互操作性，可以让任何采用 Muta 框架的区块链都能和 CKB 进行跨链交互，同时享受到基于 PoW 的 CKB 底层所提供的高安全性和最终性。

### Axon
> Axon 是采用 Muta 框架构建的一条完整的并且能够立即使用的侧链，同时也将提供一个实用的安全和代币经济模。Axon 将使用 CKB 来对其资产进行安全性托管，并使用基于代币的治理机制来管理侧链验证者。


### Epoch
> Epoch 即周期，CKB 上挖矿难度调节的时间单位，1 个 epoch ≈ 4 小时。

