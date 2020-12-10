---
id: introduction.zh
title: Nervos Network RFCs
sidebar_label: Nervos Network RFCs 简介
---

# Nervos Network RFCs

[![Telegram Group](https://cdn.rawgit.com/Patrolavia/telegram-badge/8fe3382b/chat.svg)](https://t.me/nervos_rfcs)

资源库 [nervosnetwork/rfcs](https://github.com/nervosnetwork/rfcs) 包含了与 Nervos Network 相关的提案、标准和文档。

RFC（请求评论）流程旨在为新协议、优化建议和最佳实践提供一个开放的、由社区驱动的渠道，以便所有相关人员都能对 Nervos network 的发展方向充满信心。

发布在这里的 RFCs 只有其状态更新为标准（Standard）时，才意味着其成为正式的标准。

## 类别

不是所有的 RFCs 都是标准，主要会分成两类：

* 标准类（Standards Track）：这部分 RFC 是 Nervos network 中的协议、客户端和应用程序需要遵循的标准。
* 信息类（Informational）：任何和 Nervos network 相关的内容。

## RFCs

|  编号  |  题目  | 作者   | 类别   | 状态   |
|--------|-------|--------|----------|--------|
| [1](rfcs/0001-positioning) | [The Nervos Network Positioning Paper](rfcs/0001-positioning/0001-positioning.md) | The Nervos Team | Informational | Draft |
| [2](rfcs/0002-ckb) | [Nervos CKB: A Common Knowledge Base for Crypto-Economy](rfcs/0002-ckb/0002-ckb.md) | Jan Xie | Informational | Draft |
| [3](rfcs/0003-ckb-vm) | [CKB-VM](rfcs/0003-ckb-vm/0003-ckb-vm.md) | Xuejie Xiao | Informational | Draft |
| [4](rfcs/0004-ckb-block-sync) | [CKB Block Synchronization Protocol](rfcs/0004-ckb-block-sync/0004-ckb-block-sync.md) | Ian Yang | Standards Track | Proposal |
| [5](rfcs/0005-priviledged-mode) | [Privileged architecture support for CKB VM](rfcs/0005-priviledged-mode/0005-priviledged-mode.md) | Xuejie Xiao | Informational | Draft |
| [6](rfcs/0006-merkle-tree) | [Merkle Tree for Static Data](rfcs/0006-merkle-tree/0006-merkle-tree.md) | Ke Wang | Standards Track | Proposal |
| [7](rfcs/0007-scoring-system-and-network-security) | [P2P Scoring System And Network Security](rfcs/0007-scoring-system-and-network-security/0007-scoring-system-and-network-security.md) | Jinyang Jiang | Standards Track | Proposal |
| [8](rfcs/0008-serialization) | [Serialization](rfcs/0008-serialization/0008-serialization.md) | Boyu Yang | Standards Track | Proposal |
| [9](rfcs/0009-vm-syscalls) | [VM Syscalls](rfcs/0009-vm-syscalls/0009-vm-syscalls.md) | Xuejie Xiao | Standards Track | Proposal |
| [10](rfcs/0010-eaglesong) | [Eaglesong (Proof-of-Work Function for Nervos CKB)](rfcs/0010-eaglesong/0010-eaglesong.md) | Alan Szepieniec | Standards Track | Proposal |
| [11](rfcs/0011-serialization) | [Transaction Filter](rfcs/0011-transaction-filter-protocol/0011-transaction-filter-protocol.md) | Quake Wang | Standards Track | Proposal |
| [12](rfcs/00012-node-discovery) | [Node Discovery](rfcs/0012-node-discovery/0012-node-discovery.md) | Linfeng Qian, Jinyang Jiang | Standards Track | Proposal |
| [13](rfcs/0013-get-block-template) | [Block Template](rfcs/0013-get-block-template/0013-get-block-template.md) | Dingwei Zhang | Standards Track | Proposal |
| [14](rfcs/0014-vm-cycle-limits) | [VM Cycle Limits](rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.md) | Xuejie Xiao | Standards Track | Proposal |
| [15](rfcs/0015-ckb-cryptoeconomics) | [Crypto-Economics of the Nervos Common Knowledge Base](rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md) | Kevin Wang, Jan Xie, Jiasun Li, David Zou | Informational | Draft |
| [17](rfcs/0017-tx-valid-since) | [Transaction valid since](rfcs/0017-tx-valid-since/0017-tx-valid-since.md) | Jinyang Jiang | Standards Track | Proposal
| [19](rfcs/0019-data-structures) | [Data Structures](rfcs/0019-data-structures/0019-data-structures.md) | Xuejie Xiao | Informational | Draft
| [20](rfcs/0020-ckb-consensus-protocol) | [CKB Consensus Protocol](rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md) | Ren Zhang | Informational | Draft
| [21](rfcs/0021-ckb-address-format) | [CKB Address Format](rfcs/0021-ckb-address-format/0021-ckb-address-format.md) | Cipher Wang | Standards Track | Proposal
| [22](rfcs/0022-transaction-structure) | [CKB Transaction Structure](rfcs/0022-transaction-structure/0022-transaction-structure.md) | Ian Yang | Informational | Draft
| [23](rfcs/0023-dao-deposit-withdraw) | [Deposit and Withdraw in Nervos DAO](rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md) | Jan Xie, Xuejie Xiao, Ian Yang | Standards Track | Proposal
| [24](rfcs/0024-ckb-system-script-list) | [CKB System Script List](rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md) | Dylan Duan | Informational | Draft
| [25](rfcs/0025-simple-udt) | [Simple UDT](rfcs/0025-simple-udt/0025-simple-udt.md) | Xuejie Xiao | Standards Track | Proposal
| [26](rfcs/0026-anyone-can-pay) | [Anyone-Can-Pay Lock](rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md) | Xuejie Xiao | Standards Track | Proposal

## 流程

RFC 流程会尽可能保持开始步骤的简单，同时与网络进展同步更新。

### 1. 和社区讨论你的想法

在正式向 [nervosnetwork/rfcs](https://github.com/nervosnetwork/rfcs) 提交一个 RFC pull request 前，你应该在 [Nervos RFCs Chatroom](https://t.me/nervos_rfcs) or [Nervos RFCs Mailing List](https://groups.google.com/a/nervos.org/d/forum/rfcs) 提出你的想法，与社区展开讨论。

### 2. 提交你的 RFC

经过一番讨论后，请正式向 [nervosnetwork/rfcs](https://github.com/nervosnetwork/rfcs) 提交一个 RFC pull request:

> 复制 `0000-template` 文件并移动至 `rfcs` 目录下，重命名文件为 `0000-feature-name`, 其中 `feature-name` 为 RFC 的简单功能描述。`0000` 暂时保持不变，不需要修改。

Nervos RFCs 应该用英语编写，除了英文版外，也可以提供其他语言的版本以辅助各个社区理解。英文版为公认版，若版本间存在偏差，以英文版为准。


Nervos RFCs 遵循 [RFC 2119](https://tools.ietf.org/html/rfc2119), [RFC 6919](https://tools.ietf.org/html/rfc6919) 中的关键字约定。

### 3. 审查 / 接受

RFCs 的维护人员以及社区会对 PR 进行审查，你也可以根据 PR 上的 comments 对 RFC 进行更新。当 RFC 已经足够完善并且取得足够支持时，它将会采纳并且合并到 [nervosnetwork/rfcs](https://github.com/nervosnetwork/rfcs) 这个代码库中。


信息类（Informational）的 RFC 将合并发布后其状态会处于草稿（Draft）阶段，在任何时候，原作者可以将其状态更新为完结（Final）。若在一年内其没有任何更新的话，RFC 维护人员也可以将其更新为完结。

### 4. (Standards Track) 提交你的标准

一个标准类（Standards Track）的 RFC 总共有三种状态：

1. 提案（默认）
2. 标准
3. 过时

标准类的 RFC 刚开始会处于 **提案** 状态，在这个阶段你都可以通过 PR 对该 RFC 进行更新优化。当在完成充分的讨论后，你觉得该 RFC 已经足够严谨成熟了，你可以提交一个 PR 将其状态修改为 **标准**。


RFCs 的维护人员会审查这份 RFC 提案，确认社区对该 RFC 没有任何异议以及进一步讨论优化的意愿后，PR 将会被采纳。

## 许可

 [nervosnetwork/rfcs](https://github.com/nervosnetwork/rfcs) 是符合 [MIT 许可条款](LICENSE)。