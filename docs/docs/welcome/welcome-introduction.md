---
id: welcome-introduction
title: 介绍
sidebar_label: 介绍
---

## 初识 Nervos

### 简单介绍

Nervos 是一个旨在满足去中心化经济需求的**分层网络**。

在 Nervos Network 中，Layer 1 协议 CKB（Common Knowledge Base 共同知识库）是整个网络的价值存储层。它从哲学上受到了比特币的启发，是一个开放的、公有的、基于工作量证明的区块链，旨在最大程度地保证安全性和抗审查性，并充当去中心化价值和加密资产的托管者。

Layer 2 协议在 Layer 1 区块链的安全性之上，提供了无限的可扩展性和最低的交易费用，并允许在信任模型、隐私性和最终性方面针对特定应用做权衡。

所以：
```
Nervos 网络 = 坚持安全和去中心化的 CKB + 百花齐放的 Layer2
```

### 与其他公链的区别

Nervos CKB（Common Knowledge Base 共同知识库）是一个无需许可的公有区块链，在区块链中，这里提到的共同知识库通常指的是经过全球节点共同验证并确认的状态。

和比特币类似，Nervos CKB 是一个状态验证系统。相较于比特币作为一个单一的可编程资产，在 Nervos CKB 上，所有的用户自定义代币（UDT）都可以和原生代币（CKB）都可以通过图灵完备的脚本进行编程，Nervos CKB 是一个多资产可编程的底层智能合约平台。

相比于以太坊定位为世界计算机，提供可编程的托管账户。CKB 并没有采用账户模型，而是采用了和比特币一样的 UTXO 模型，并基于 UTXO 设计了一套新的编程模型 —— cell 模型。还有一点与以太坊不同，以太坊采用的是链上计算，链上验证的模式，而 CKB 采用的是链下计算，链上验证的设计思路。

---

## CKB 特性

### NC Max

比特币的中本聪共识（Nakamoto Consensus，这里简称 NC） 因其简单性和低通信开销的特点而广受好评。然而，NC 有两大缺陷：第一，其交易吞吐量远远无法满足现实需求；第二，NC 容易遭受自私挖矿攻击，在这一类攻击中，攻击者能够采用非协议规定的行为获得更多的出块奖励。

CKB 的共识协议是 NC 的变体，命名为 NC Max，在保留 NC 优点的同时，提升了其性能极限和抵抗自私挖矿攻击的能力。通过研究发现消除 NC 区块广播延时的瓶颈，我们的协议能够在不牺牲安全性的情况下，支持非常短的出块间隔。缩短的出块间隔不仅提高了吞吐量，也降低了交易确认时长。通过在难度调节时考虑所有有效区块，在我们的协议中自私挖矿将不再有利可图。

了解更多关于 NC Max，请参阅：[RFC-0020 CKB 共识协议](../../rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.zh)

### Cell 模型

Nervos CKB 采用的是一种称为 cell 模型的通用的 UTXO 模型，通过 cell 模型来进行原生代币（CKB）和用户自定义代币（UDT）的描述和编程。

了解更多关于 cell 模型，请参阅：
* [理解 CKB 的 cell 模型](https://talk.nervos.org/t/ckb-cell/1562)
* [CKB 编程模型介绍](../welcome/welcome-programming-model)
* [RFC-0002 Nervos CKB 加密经济共同知识库](../../rfcs/0002-ckb/0002-ckb.zh)

### RISC-V VM

CKB VM 是为 CKB 设计的基于开源 RISC-V 指令集的虚拟机。通过 CKB VM，任意一种可以编译成 RISC-V 二进制代码的语言都可以用来当作 CKB 的编程语言，比如 C/C++，比如 JavaScript/Ruby/Rust 等等。

此外，CKB VM 没有硬编码任何密码学原语，允许用户使用任何类型的签名算法或哈希算法。开发者可以为特定资产/代币选择合适的验证功能，而不会受到任何预定义的密码原语的限制。

了解更多关于 CKB VM，请参阅：[RFC-0003 CKB 虚拟机](../../rfcs/0003-ckb-vm/0003-ckb-vm.zh)

### 经济模型

在 Nervos CKB 中，CKB 不仅仅是底层网络的原生代币，还代表了状态存储的权限，你持有 1 个 CKB 就拥有了 1 Byte 在 CKB 底层网络上的存储空间。

了解更多关于经济模型的设计，请参阅：[RFC-0015 Nervos CKB 经济模型](../../rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh)
