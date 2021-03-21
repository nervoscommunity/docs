---
id: multiHop-payment
sidebar_label: blog
title: "关于『支付通道网络中多跳支付的锁定时间』的讨论"
author: zhichunlu
author_title: Nervos Community Dev
author_url: https://talk.nervos.org/u/zhichunlu/
author_image_url: https://avatars3.githubusercontent.com/u/5958?s=400&u=3474d3bdc92cbdf44aebd8fd7feb62002ebbb57c&v=4
tags: [payment channel, zhichunlu, multi-hop, HTLC]
---

<!--truncate-->

## 介绍

HTLC（Hash Time Lock Contract，哈希时间锁合约） 是涉及双方（例如：Alice和Bob）之间的一份合约，合约逻辑可以简单抽象为：

> Alice拿出 100 CKB并且告诉Bob：“如果你能在区块高度 100 之前，告诉我哈希值 **H** 的原像（preimage，Hash(R)=H，则 R 为 H 的原像），那么你就可以拿走这 100 CKB；没有的话，钱就会退回。”

HTLC 已经应用在许多 DApp 中，本文我将着重聊聊其在多跳支付中的角色。进一步了解 HTLC 请查阅[此文](https://github.com/tianmingyun/MasterBitcoin2CN/blob/master/ch12.md#1255-%E5%93%88%E5%B8%8C%E6%97%B6%E9%97%B4%E9%94%81%E5%90%88%E7%BA%A6htlc)。

## 问题陈述

我估计此时你脑海中对 HTLC 的运行流程是这样演绎的：

> Bob能在 HTLC 到期前，使用正确的原像（preimage）拿走资金；或者，Alice失败了，资金退回给了Alice。

不过，在比特币网络中，故事的剧本走向就完全不同了。

首先，我们先来想想如何实现这个合约（脚本）？

假设 HTLC 的到期时间为 **E**，哈希值为 **H**，原像为 **P**，那么这笔资金所在的 Cell 的解锁条件应该为：

1. 在 **E** 到期前，Bob证明了 **P**。
2. 在 **E** 过期后，Alice取回了资金。

因此，在合约中，我们需要以下三个功能：

1. 检查 **P** 的正确性。
2. 防止Alice在 **E** 到期前取回资金。
3. 防止Bob在 **E** 到期后仍然提交 **P** 。

第一个功能可以通过任何脚本语言的if逻辑和哈希函数来实现。

第二个功能可以通过 CKB 中的 `since` 参数或者比特币协议中的 `nounce` 参数来实现。

第三个功能可以叫作一种 `until` 机制。据我所知，比特币协议中没有这种机制，也就是说，即使 **E** 到期后，Bob仍然可以解锁资金。

我们先就此打住，先来聊聊在闪电网络中，多跳支付的工作原理。

我们假设Alice通过Bob向Carol付款，对应的 HTLC 到期区块高度分别为 **EAB** 和 **EBC**。

我们也假设一笔交易从开始广播到上链完成确认需要经历  **Δ** 个区块时间，我们假设 HTLCBC 的截止日期也到，Bob 和 Carol 都打算解锁 **HTLCBC**；由于在当前的设置中，还不具备 `until` 机制，所以 Carol 在到期后依旧可以提交原像（preimage）解锁 **HTLCBC**。

- 区块高度为 **EBC** 时
- 操作：Bob 提交取回资金的交易  **TxrefundBC** 
- 操作：Carol 出示 **P** 并且在交易 **TxpaymentBC** 中试图拿走资金

可是，Carol 交易更早地提交了交易。不过还好 Bob 现在也知道了原像（preimage），所以他也可以使用原像解锁 **HTLCAB** 。

- 区块高度为 **EBC+Δ** 时
- 结果：由于 Carol 的交易更早提交，所以其交易 **TxpaymentBC** 优先执行
- 操作：Bob 从链上知道 **P** ，并在交易 **TxpaymentAB** 中试图拿走资金。 

**TxpaymentAB** 为脸上交易。

- 区块高度为  **EBC+2Δ** 时
- 结果：**TxpaymentAB** 交易成功执行。

现在，我们知道，在最坏的情况下，在区块高度为 **EBC+2Δ** 之前，Bob 都能拿走资金。因此，我们可以得到以下不等式：

**EAB≥EBC+2Δ**

简而言之，我们在Bob用原像拿走资金之前，阻止Alice发起退款。而且这种情况可以发生在每一跳，每一跳的到期区块高度随着跳数反向递增（第一跳的到期时间最晚）。如果我们考虑将最后一跳的锁定时间定为  **2Δ** ，那么在闪电网络中，长度为 **N** 的多跳支付的锁定时间总和为：

**Lsum=2Δ+4Δ+...+2NΔ**

为了使问题更容易理解，在上面的描述中我省略了一些细节。

归根结底，我想说的是，在闪电网络的多跳支付中，**Lsum** 的复杂度是 **O(N2)**。

在接下来的篇幅中，我们将讨论如何在CKB 上将其该复杂度降低到 **O(N)**。

幸运地是，由于 CKB 强大的可编程性，我们能够在 CKB 上实现 `until` 机制。总的来说，用户可以先将原像添加到自己的 cell 中，然后在 HTLC 解锁交易中作为 `cell_deps` 来使用。同时，用户应该在 `header_deps` 中添加生成 cell 的区块哈希值。然后，我们要求脚本读取区块头，并验证区块高度是否在截止日期之前。这样，我么就可以让操作只在某个区块高度之前有效。

好了，现在我们有了 `until` 机制，可是问题解决了吗？显然还没有。继续上述的例子，不过现在我们有了 `until` 机制，并且在路径上多了一跳（即现在是 Alice 支付给 Dave，A -> B -> C -> D）.

这里我们假设每一跳的到期时间 **E** 都是一样的，那么对于 Dave 来说，如果他想得到这笔资金，他需要在区块高度为 **N−Δ** 之前提交原像，以确保在 **E** 之前上链。Bob 也一样，因为他们的到期时间是一样的。但是 Bob 在区块高度为 **N−Δ** 时对原像一无所知。这个问题有两种解决方案：

1. 使 Dave 提交原像的操作能够影响路径中的每一跳。
2. 让路径上的所有节点监听公共域（如链上，内存池）

[Sprites](https://arxiv.org/pdf/1702.05812.pdf) 采用第一种解决方案，下面章节我们来讨论一下它的工作原理。

## Sprites

Sprites 是一个基于以太坊的多跳支付解决方案，由两份合约 **contracthtlc** 和**contractpm** （preimage manager）组成。前者是一份 HTLC 合约，但不同的是，它由 **contractpm** 来决定结果。后者是一个原像管理器，提供两个接口：

1. **function submitPreimage(bytes32 x)**
2. **function revealedBefore(bytes32 h, uint T) returns(bool)**

**submitPreimage** 可以让用户提交一个原像 **P** 并且保存为字典 { **H** : **T** }, 其中 **H** 是 **P** 的哈希值， **T** 是交易所在区块高度。`until` 的逻辑隐藏于此：

如果用户在到期时间后提交了一个原像，会与已记录的区块高度不匹配。**revealedBefore** 是一个访问 **contracthtlc** 的接口，如果 **H** 的原像是在区块高度 **T** 之前提交的，则返回 true；反之返回 false。

现在，我们回到支付场景。同样地，Dave 在区块高度  **E−Δ** 之前向 **contractpm** 提交了原像，交易在区块高度 **E** 之前已上链。现在，Bob 在不知道原像的情况下，可以在**contractABhtlc** 中发起争议，因为 Dave 的行为会通过全局共享的 **contractpm** 影响到所有具有原像 **P** 的HTLC。

现在，你可能认为全局共享是实现固定锁定时间的关键，但我想举一个例子来说明 `unti` 的重要性。我们假设 Sprite 没有 `until` 机制（很简单，我们只需要在提交原像时去掉区块高度即可）。换句话说，**revealedBefore** 只判断原像是否正确，而不关心它是什么时候提交的。

我们仍然假设 Alice 支付给 Carol 的场景，现在已经到了到期时间 **E**。Alice 和 Bob 都发起了争议交易 **TxAB**  和 **TxBC**，Carol 提交了原像交易 **Txpreimage**。此时，这三笔交易都可以被网络接受，可能的顺序如下：

1. **TxAB**
2. **Txpreimage**
3. **TxBC**

由于 **TxAB** 交易确认时，**Txpreimage** 交易尚未提交，所以 **TxAB** 能够拿回资金。然而，因为提供了原像，所以 **TxBC** 交易也能成功（即 Carol 也能够拿到资金）。这时候，Bob 就吃了哑巴亏。因此，一对共谋的节点可以利用这个来骗钱。一个好的协议不应该有理性节点赔钱的可能。因此，`until` 机制是必不可少的。

## CKB 版实现

[Sprites](https://arxiv.org/pdf/1702.05812.pdf) 依赖于全局共享的合约，在 CKB 中我们可以等价为 **cellpm**，不过存在状态共享问题。首先，当两个用户想要用同一个 **cellpm** 作为输入提交原像时，就会发生冲突；其次，当我想要使用 **cellpm** 作为 `cell_dep` 解锁 HTLC 时，别人可能会修改 **cellpm** 。

所以我另辟蹊径，通过让路径上节点来搜索链上的 [proof cell](https://talk.nervos.org/t/htlc-in-ckb/5062) ，并利用它来解锁自己的 HTLC。具体来说，就是如果 Dave 在区块高度 **E−Δ** 之前提交了一个 proof cell，然后所有节点都可以在区块高度 **E** 后看到它，那么 Bob 和 Carol 都可以利用它来解锁相应的 HTLC。

不过，这个解决方案有两个问题。首先，`cell_deps` 中的 cell 必须是可用 cell，可是当 Bob 和 Carol 想要使用 proof cell 时，我们如何确保它是可用 cell 呢？第二，HTLC 到期后，一方可以通过 proof cell 取回资金，但是另一方也可以发起退款。如何解决这个冲突？

对于第一个问题，我们使用时间锁来解决，proof cell 的锁脚本（lock script）如下：

```
lock.args:

<owner's pubkey> <htlc_expire_date> <grace_period>

Witnesses

<Signature>
```

首先，我们要求 HTLC cell 中的到期时间必须与 proof cell 中的字段 `htlc_expire_date` 一致。其次，我们会要求 proof cell 在 `htlc_expire_date`+`grace_period` 之前不能解锁，其中 `grace_period` 是用来让同一路经上的其他节点解锁资金的。此时，我们要保证每个节点有足够的时间来使用 proof cell 来解锁他们的资金。

对于第二个问题，我更愿意把它叫作 **“不在场证明（proof of absence）”**。就是说，我们如何在区块链上证明某件事情没有发生？一个天真的解决方案是，我们先让一方出示 **“在场证明（proof of attendance）”** 。如果在这段时间内没有提供，那么就证明**不在场**。在 HTLC 中，我们可以让 Bob 在区块高度 **E** 之后通过提供 `cell_deps` 中的 proof cell 来解锁 **HTLCAB**；然后，我们可以让 Alice 在区块高度 **E+grace_period** 后无条件解锁  **HTLCAB** 。



## 讨论一番

总的来说，本文讨论的是多跳支付的锁定时间。

具体来说，我先是进行了问题陈述，然后介绍了基于以太坊的 Sprites 和 CKB 上的 proof cell。

接下来，我想讨论一下这两种解决方案的优缺点。

### 原子性

跟许多 Layer 2 设计一样，我在 proof cell 的 HTLC 最终结算时引入了宽限期（挑战期）。因此，当网络拥堵时，多跳支付的原子性可能会被打破。但我最近看到了一些关于弹性挑战期的[讨论](https://ethresear.ch/t/extending-proof-deadlines-during-chain-congestion/84)。简而言之，就是当网络拥堵时，挑战期会被延长，这有效地降低了因网络拥堵而导致资金损失的风险。

毫无疑问，Sprites在原子性方面表现出色。任何一方都不需要担心对方作弊，因为争端的结果仅取决于 **contractpm**  。同时，合约具有不可逆转性，HTLC的结果是确定的，过了期限就不能修改。

如果你想要提高 proof cell 的原子性，我强烈建议你思考以下两个问题：

1. 如何有效证明 proof cell 不存在？
2. 在 CKB 上如何实现弹性挑战期？

### 容量成本

As I discussed above, Sprites must have irreversibility. Then when we want to port Sprites to CKB, the capacity required by **cellpm** will keep growing. You may ask, “Well, can we clean the **cellpm** regularly?” From my perspective, the answer is no.

正如上文提及的，Sprites必须具有不可逆转性。那么当我们要把Sprites移植到CKB时，**cellpm** 所需要的容量（capacity ）就会不断增加。

你可能会问：“那么我们可以定期清理 **cellpm** 吗？”

从我的角度来看，是不可以的。

如果你选择定期清理，其实就是增加了一个挑战期。

你是在告诉用户：“在我清理之前，请先来引用这份合约，否则你将找不到你需要的争议记录。”

你可能会这么想：“能不能等所有需要这个原像的 HTLC 争议处理完毕后再清理？”

遗憾地是，并不是所有用户都愿意在链上解决争议，因为这意味着他们需要关闭他们之间的通道。所以你很可能无法收集到完整的争议记录。相反，proof cell 的成本是相对经济的，所有的 proof cell 只需要在宽限期内锁定，之后用户就可以正常消费这个 cell 了。

因此，如果你想在 CKB 中实现 Sprites，那么我建议你思考以下两个问题：

1. 如何解决状态共享问题？
2. 如何解决 Sprites 带来的持续增长的空间占用？

如果你对上述难题有什么想法，不要犹豫，请私信联系我。另外，欢迎大家提出任何意见。

 