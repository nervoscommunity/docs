---
id: rule-of-dao
title: Nervos DAO 的存取规则是什么
sidebar_label: Nervos DAO 的存取规则
---


## Nervos DAO 的存取规则

## 小白版

Nervos DAO 是存在一个最低锁定周期的，为 180 个 epoch，一个 epoch 约为 4 小时，因此 180 个 epoch 约合 30 天。

### 我存进去了什么时候可以取出来？

这是大家最关心的问题，简单地讲，其实从将 CKB 存入 Nervos DAO 开始计算，您操作得当的话，可以在 180 个 epoch 的整数倍之后，取出之前存入的 CKB 的啦。

### 如何简明地理解 Nervos DAO 的存取过程？

首先，Nervos DAO 完整的存取一共有三个步骤，包括 1 次存入，2 次取出。

1 次存入很好理解，和将钱存入银行一样，用户可以直接将 CKB 存入 Nervos DAO。

2 次取出可以这样理解，第 1 次取出，就好比您和银行提出了一份申请，表明您需要将存入的金额取出来。

经过银行核对，在您的取出条件满足规定后（在 Nervos DAO 这边就是，从存入的区块高度开始计算，180 个 epoch 的整数倍后您可以取出），您就可以发起第 2 次提取，最终将 CKB 提取到您的钱包内。

理解上，存入 Nervos DAO 就是存了一个为期 30 天的定期，到期之后会自动再为您存一个 30 天的定期。您只有在定期时间到了之后，才能真正取出存入的 CKB。

### 真实的存取情况会是什么样的？

假设您在 epoch 高度为 5 的时候，将 CKB 存入了 Nervos DAO。

当您在 epoch 高度为 100 的时候，发起了第 1 次取出申请，并被及时打包上链。那么您将获得从 epoch 从 5 - 100 期间的利息。但是此时因为存入周期不足 180 个 epoch，您无法发起第 2 次取出交易，您需要等到 epoch 高度大于 185（5+180）之后，再发起第 2 次取出交易，最终将存入的 CKB 取出。

当您在 epoch 高度为 186 的时候，发起了第 1 次取出申请，并被及时打包上链。那么您将获得从 epoch 从 5 - 186 期间的利息。但是此时因为存入周期已经超过了第一个 180 个 epoch，但是不满足第二个 180 个 epoch，您无法发起第 2 次取出交易，您需要等到 epoch 高度大于 365（5+180*2）之后，才能再发起第 2 次取出交易，最终将存入的 CKB 取出。

也就是正常而言，您在 epoch 高度等于 5 的时候存入，您一般可以在 epoch 高度大于 185，365，545... 之后，完成 CKB 的最终取出。

### 其他注意事项

Nervos DAO 会自动转存下一期，就是上面所提到的一旦没有在一个定期期满之前，发起第 1 笔提取交易，会自动转存一个新的定期。

Nervos DAO 的收益是实时减小的并非恒定值，所以存入 Nervos DAO 最好的时机就是现在。

---

## 进阶版

### 存款

用户可以随时发送交易将 CKBytes 存入 Nervos DAO。CKB 在创世块中包含一种特殊的 Nervos DAO 类型脚本。想要存储到Nervos DAO 中，只需随时创建一个包含新 Output Cell 的交易，并满足以下要求：

* 创建的 Output Cell 类型脚本必须设置为 Nervos DAO 脚本。

* 该 Output Cell 的 Cell Data 必须有 8 个字节长度，并用 0 将其填充完整。

为方便起见，一个满足上述条件的 Cell 被称为 `Nervos DAO 存款单`。为了遵循 CKB 的脚本验证逻辑，存款交易还需要将 Nervos DAO 类型脚本的引用包含在封闭交易的 `cell_deps` 部分中。注意，在一个交易中，我们不对完整的存款数量进行限制，一个有效的交易中可以创建多个「Nervos DAO 存款单」。

### 取款

用户可以随时发送交易从 Nervos DAO 中取出已存储的 CKByte（但这里会涉及到一个锁定期来确定什么时候可以取出代币）。一个 Nervos DAO Cell 获得的利息只会在取出阶段发放，这意味着对于一个包含 Nervos DAO 提取交易来说，所有 Onput Cell 的Capacity 总和可能超过所有 Input Cell 的 Capacity 总和。与存款过程不同，从 Nervos DAO 取出需要两个步骤：

* 在第一阶段，第一个交易是将 `Nervos DAO 存款单`转换为 `Nervos DAO 取款单`。

* 在第二阶段，第二个交易是从 `Nervos DAO 取款单`中提取代币。

#### 取款阶段 1

第一阶段是将 `Nervos DAO 存款单`转换为 `Nervos DAO 取款单`，这里的目的是确定一个 Cell 存入 Nervos DAO 的时间。一旦第一阶段的交易完成上链，那么就可以通过 `Nervos DAO 存款单`和 `Nervos DAO 取款单`之间的持续时间来计算利息，以及计算所存代币的剩余锁定期。

第一阶段的交易应符合下列条件：

* 交易中应包含一个或多个 Nervos DAO 存款单作为输入。

* 对于每个 Nervos DAO 存款单来说，交易需要在 `header_deps` 中包含对其相关（存款）区块的引用，Nervos DAO 类型脚本将以此作为存款的起点。

* 在 Input 索引 `i` 中的 Nervos DAO 存款单，应该在 Onput 索引 `i` 中创建 Nervos DAO 取款单，并满足以下要求：

    * 取款单应该与存款单具有相同的锁定脚本

    * 取款单应该与存款单具有相同的 Nervos DAO 类型脚本

    * 取款单应该与存款单具有相同的 Capacity

    * 取款单也应该有 8 个字节长度的 Cell Data，但不是 8 个零，Cell Data 部分应该存储存款单所在区块的区块数。该数字应该以 64 位未签名小端序整数格式打包。

* Nervos DAO 类型脚本应该包含在取出交易的 `cell_deps` 中。

一旦该交易完成上链，用户就可以开始准备阶段二的交易了。

#### 取款阶段 2

阶段 2 的交易是从 Nervos DAO 中取出已存的代币和利息。注意，与第一阶段交易不同的是，用户可以在任何时候发送第一阶段的交易，但在第二阶段的交易中，我们将会设置一个「since」字段来实现锁定期的要求，因此，可能会事先只生成一个交易，但是必须等待一段时间后，他/她才可以发送交易到 CKB。

第二阶段的交易应符合以下条件：

* 一个交易应该包含一个或多个 Nervos DAO 取款单作为 Input。

* 对于每个 Nervos DAO 取款单来说，交易需要在 `header_deps` 中包含对其相关（取款）区块的引用，Nervos DAO 类型脚本将以此作为存款的终点。

* 对于在 Input 索引 `i` 中的 Nervos DAO 取款单来说，用户应该定位到包含原始 Nervos DAO 存款单的区块头。有了这个存入区块头之后，我们还需要做 2 个操作：

    * 当前交易的 `header_deps` 中应该包含存入区块头的哈希

    * `header_deps` 中存入区块头哈希的索引应该使用 64 位未签名小端序整数格式，并保存在属于相应 Witness 输入 Cell 类型脚本部分的索引 `i` 中。Witness 当前的论证组织将会在另外一个单独的 RFC 中阐述。下面我们还将通过一个详细的例子来介绍这个过程。

* 对于一个 Nervos DAO 取款单来说，Cell 交易输入中的 `since` 字段应该反映 Nervos DAO Cell 的锁定周期要求，即 180 个Epoch。例如，如果一个人在第五个 Epoch 存入 Nervos DAO，则他/她只能在第 185、365 或 545 等 Epoch 从 Nervos DAO 中取出。注意，锁定期的计算与利息的计算无关。在第五个 Epoch 存入，在第一百个 Epoch 使用 `withdraw block`，在第 185 个 Epoch 使用 `since` 字段是完全有效的。请参考 [since RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md) 来了解如何表示有效的 Epoch 数，Nervos DAO 类型脚本目前只接受绝对的 Epoch 数作为 since 值。

* 利息计算逻辑完全独立于锁定期限的计算逻辑，我们将在下一节中解释利息计算逻辑。

* Nervos DAO 类型脚本中，所有 Input Cell 的 Capacity 加上利息的总和应该大于或等于所有 Onput Cell 的 Capacity 的总和。

* Nervos DAO 类型脚本应该被包含在 `cell_deps` 中。

正如上面的步骤所示的那样，在一个交易中执行多个取款是完全有可能的。更重要的是，Nervos DAO 并没有限制提取代币的目的，在同一交易中，将刚提取的代币重新存入 Nervos DAO 中也是有效的。实际上，一个交易可以用来自由地混合以下所有操作：

1. 将代币存入 Nervos DAO 中。

2. 将一些 Nervos DAO 存款单转化为 Nervos DAO 提款单。

3. 从其它 Nervos DAO 中提取 Cell。