---
id: 0023-dao-deposit-withdraw.zh
title: Nervos DAO 的存入和取出
sidebar_label: 23：Nervos DAO 的存入和取出
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0023 | Standards Track | Proposal | Jan Xie, Xuejie Xiao, Ian Yang  |Nervos Foundation|2019-10-30|

# Nervos DAO 的存入和取出

## Abstract

本文描述了 Nervos DAO 中的存入和取出机制。

注意: 一个 `Common Gotchas` 页面在[这里](https://github.com/nervosnetwork/ckb/wiki/Common-Gotchas#nervos-dao)，如果您想要清楚地了解如何使用 Nervos DAO 并且不丢失 CKB，那么请务必阅读该部分，里面包含了一些常见的且非常重要的要点。即使您可能想跳过本 RFC 的其他某些部分，也请仔细阅读这个部分的内容。

## 动机

Nervos DAO 是一个智能合约，就像 CKB 上其他的智能合约一样，用户可以与之交互。Nervos DAO 的功能之一就是为 CKByte 持币者提供一种抗稀释的功能。通过将 CKByte 存入 Nervos DAO 中，持有者可以获得一定比例的二级发行，在存款和取款之间的这段时间内，他们的持有比例只会受到创世块和基础发行的影响，就像和有硬顶的比特币一样。

持有者可以随时将他们的 CKByte 存入 Nervos DAO 中。Nervos DAO 是一种定期存款，存在一个最短存款期限（会按照区块计算），持有者只能在一个完整的存款期之后进行取款。如果持有者在存款期结束时没有取款，这些 CKByte 将自动进入新的存款周期，这样可以尽量减少持币人的操作次数。

## 背景

CKB 的发行曲线由两部分组成：

* 基础发行：奖励给矿工的有硬顶的代币发行，使用与比特币相同的发行曲线，约每 4 年减半。

* 二级发行：常量发行，每个难度调节周期（Epoch）都会发行相同数量的 CKByte，这意味着随着时间的推移，二级发行比率将逐渐趋近于零。因为每个 Epoch 内的区块数量是[动态调整](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md)的，所以每个区块的二级发行会是一个变量。


如果在 CKB 中只有基础发行而没有二级发行，那么 CKByte 的总供应量将会存在一个硬顶，其发行曲线将会和比特币完全一样。为了保障 CKB 的长期持有者不被二级发行稀释，在 Nervos DAO 中锁定的 CKByte 将获得部分比例的二级发行，该比例等于锁定在 Nervos DAO 中的 CKByte 占整个 CKByte 流通量的百分比。

更多关于 Nervos DAO 和 CKB 经济模型的细节，请查看[Nervos RFC #0015](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).

## 存款

用户可以随时发送交易将 CKBytes 存入 Nervos DAO。CKB 在创世块中包含一种特殊的 Nervos DAO 类型脚本。想要存储到Nervos DAO 中，只需随时创建一个包含新 Output Cell 的交易，并满足以下要求：

* 创建的 Output Cell 类型脚本必须设置为 Nervos DAO 脚本。

* 该 Output Cell 的 Cell Data 必须有 8 个字节长度，并用 0 将其填充完整。

为方便起见，一个满足上述条件的 Cell 被称为 `Nervos DAO 存款单`。为了遵循 CKB 的脚本验证逻辑，存款交易还需要将 Nervos DAO 类型脚本的引用包含在封闭交易的 `cell_deps` 部分中。注意，在一个交易中，我们不对完整的存款数量进行限制，一个有效的交易中可以创建多个「Nervos DAO 存款单」。

## 取款

用户可以随时发送交易从 Nervos DAO 中取出已存储的 CKByte（但这里会涉及到一个锁定期来确定什么时候可以取出代币）。一个 Nervos DAO Cell 获得的利息只会在取出阶段发放，这意味着对于一个包含 Nervos DAO 提取交易来说，所有 Onput Cell 的Capacity 总和可能超过所有 Input Cell 的 Capacity 总和。与存款过程不同，从 Nervos DAO 取出需要两个步骤：

* 在第一阶段，第一个交易是将 `Nervos DAO 存款单`转换为 `Nervos DAO 取款单`。

* 在第二阶段，第二个交易是从 `Nervos DAO 取款单`中提取代币。

### 取款阶段 1

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

### 取款阶段 2

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

## 计算

本节解释了在 CKB 区块头中 Nervos DAO 利息和相关字段的计算。

CKB 的区块头有一个名为 `dao` 的特殊字段，其中包含了使用 Nervos DAO 的辅助信息。具体来说，以下数据需按如下顺序封装在一个 32 字节的 `dao` 字段中：

* `C_i`：截至区块 `i`（包含区块 `i`）系统中累积的 CKByte 发行量
* `AR_i`：当前区块 `i` 的累积利率。`AR_j` / `AR_i` 表示一单位的 CKByte 在区块 `i` 中存入 Nervos DAO，并在区块 `j` 中取出的本息之和。
* `S_i`：截至区块 `i`（包含区块 `i`）系统中累积的二级发行总和
* `U_i`：截至区块 `i`（包含区块 `i`）系统中占用的空间之和。已占用的空间是用于存储所有 Cell 空间的总和。

以上的这 4 个值都是以 64 位未签名小端序数存储在 `dao` 字段中。为了保证足够的精度，`AR_i` 以原始值乘以 `10 ** 16` 的方式储存。

对于单个区块 `i` 来说，我们可以定义如下变量：

* `p_i`：区块 `i` 应得的基础发行
* `s_i`：区块 `i` 应得的二级发行
* `U_{in,i}`：区块 `i` 中所有 Input Cell 占用的空间之和
* `U_{out,i}`：区块 `i` 中所有 Onput Cell 占用的空间之和
* `C_{in,i}`：区块 `i` 中所有 Input Cell 的 Capacity 之和
* `C_{out,i}`：区块 `i` 中所有 Onput Cell 的 Capacity 之和
* `I_i`：所有 Nervos DAO 的利息之和

创世块中初始值的定义如下：

* `C_0`: `C_{out,0}` - `C_{in,0}` + `p_0` + `s_0`
* `U_0`: `U_{out,0}` - `U_{in,0}`
* `S_0`: `s_0`
* `AR_0`: `10 ^ 16`

我们可以因此得出每个后续区块的累加公式：

- `C_i` : `C_{i-1}` + `p_i` + `s_i`
- `U_i` : `U_{i-1}` + `U_{out,i}` - `U_{in,i}`
- `S_i` : `S_{i-1}` - `I_i` + `s_i` - floor( `s_i` * `U_{i-1}` / `C_{i-1}` )
- `AR_i` : `AR_{i-1}` + floor( `AR_{i-1}` * `s_i` / `C_{i-1}` )

有了这些值，现在就可以计算出一个 Cell 中的 Nervos DAO 利息了。假设 Nervos DAO 的 Cell 在区块 `m` 中存入（即 Nervos DAO 存款单被包含在区块 `m` 中），用户在区块 `n` 中开始取款（即 Nervos DAO 取款单被包含在区块 `n` 中），Nervos DAO Cell 的 Capacity 总和为 `c_t`，Nervos DAO Cell 所占用的空间为 `c_o`。 Nervos DAO 利息的计算公式如下：

( `c_t` - `c_o` ) * `AR_n` / `AR_m` - ( `c_t` - `c_o` )

即该 Nervos DAO Input Cell 的最大总取款 Capacity 为：

( `c_t` - `c_o` ) * `AR_n` / `AR_m` + `c_o`

## 案例

在这个案例中，我们假设 Nervos DAO 脚本用下面的类型脚本表示：

    {
      "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      "args": "0x",
      "hash_type": "type"
    }

以下 OutPoint 表示包含了 Nervos DAO 脚本的 Cell：

    {
      "out_point": {
        "tx_hash": "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
        "index": "0x2"
      },
      "dep_type": "code"
    }

以下交易为将 100 个 CKB 存入 Nervos DAO 中：

    {
      "version": "0x0",
      "cell_deps": [
        {
          "out_point": {
            "tx_hash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
            "index": "0x0"
          },
          "dep_type": "dep_group"
        },
        {
          "out_point": {
            "tx_hash": "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
            "index": "0x2"
          },
          "dep_type": "code"
        }
      ],
      "header_deps": [],
      "inputs": [
        {
          "previous_output": {
            "tx_hash": "0xeb4644164c4dc64f195bb3b0c6e4f417e11519b1931e5f7177ff8008d96dbe83",
            "index": "0x1"
          },
          "since": "0x0"
        }
      ],
      "outputs": [
        {
          "capacity": "0x2e90edd000",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0xe5f99902495d04d9dcb013aefc96093d365b77dc",
            "hash_type": "type"
          },
          "type": {
            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
            "args": "0x",
            "hash_type": "type"
          }
        },
        {
          "capacity": "0x101db898cb1",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0x9776eaa16af9cd8b6a2d169ae95671b0bcb8b0c4",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x0000000000000000",
        "0x"
      ],
      "witnesses": [
        "0x5500000010000000550000005500000041000000c22c72efb85da607ac48b220ad5b7132dc7abe50c3337c9a51e75102e8efaa5557e8b0567f9e0d9753016ebd52be3091bd55d4b87d7d4845f0d56ccf06e6ffe400"
      ],
      "hash": "0x81c400a761b0b5f1d8b00d8939e5a729d21d25a08e14e54f0661cb4f6fc6fb81"
    }

假设该交易被包含在以下区块中：

    {
      "compact_target": "0x1a2158d9",
      "hash": "0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc",
      "number": "0x105f",
      "parent_hash": "0x36990fe91a0ee3755fd6faaa2563349425b56319f06aa70d2846af47e3132262",
      "nonce": "0x19759fb43000000000000000b28a9573",
      "timestamp": "0x16e80172dbf",
      "transactions_root": "0x66866dcfd5426b2bfeecb3cf4ff829d353364b847126b2e8d2ce8f8aecd28fb8",
      "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "version": "0x0",
      "epoch": "0x68d0288000002",
      "dao": "0x8268d571c743a32ee1e547ea57872300989ceafa3e710000005d6a650b53ff06"
    }

正如上面提到的，这里的 `dao` 字段包含 4 个字段，`AR` 是列表中的第二个字段，从偏离量 `8` 到偏离量 `16` 中提取小端序整数，当前的 `AR` 存款是 `10000435847357921`，因为 `AR` 是以原始值乘以 `10 ** 16` 的方式储存，所以这里的 `AR` 值是 `1.0000435847357921`。

接下来就可以开始第一阶段的提款过程，将 Nervos DAO 存款单转换成 Nervos DAO 取款单：

    {
      "version": "0x0",
      "cell_deps": [
        {
          "out_point": {
            "tx_hash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
            "index": "0x0"
          },
          "dep_type": "dep_group"
        },
        {
          "out_point": {
            "tx_hash": "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
            "index": "0x2"
          },
          "dep_type": "code"
        }
      ],
      "header_deps": [
        "0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc"
      ],
      "inputs": [
        {
          "previous_output": {
            "tx_hash": "0x81c400a761b0b5f1d8b00d8939e5a729d21d25a08e14e54f0661cb4f6fc6fb81",
            "index": "0x0"
          },
          "since": "0x0"
        },
        {
          "previous_output": {
            "tx_hash": "0x043639b6aedcd0d897583e3d056e5a9c4875538533733818aca31fbeabfd5fba",
            "index": "0x1"
          },
          "since": "0x0"
        }
      ],
      "outputs": [
        {
          "capacity": "0x2e90edd000",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0xe5f99902495d04d9dcb013aefc96093d365b77dc",
            "hash_type": "type"
          },
          "type": {
            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
            "args": "0x",
            "hash_type": "type"
          }
        },
        {
          "capacity": "0x179411d65",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0x5df75f10330a05ec9f862dec9bb37b5e11171475",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x5f10000000000000",
        "0x"
      ],
      "witnesses": [
        "0x5500000010000000550000005500000041000000d952a9b844fc441529dd310e49907cc5eba009dcf0fcd7a5fb1394017c29b90b7c68e1d0db52c67d444accec4c04670d197630656837b33d07f0cbdd1f33907d01",
        "0x5500000010000000550000005500000041000000d8e77676d57742b9b1e3a47e53f023ade294af5ca501f33406e992af01b1d0dd4a4f22d478c9497b184b04ea56c4ce71fccd9f0d4c25f503324edff5f2b26f0d00"
      ],
      "hash": "0x9ab05d622dc6d9816f70094242740cca594e677009b88c3f2b367d8b32f928fd"
    }

在这个交易中有几个重要的地方值得注意：

* Input Nervos DAO 存款单被包含在 `0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc` 区块中，因此它被包含在 `header_deps` 中。
* 包含的区块号是 `4191`，它是以 64 位未签名小端序整数格式，同时也是十六进制的格式打包，即 `0x5f10000000000000`。
* 将以上两个交易放在一起来看，该交易中的 Output Cell 与之前的 Nervos DAO 存款单具有相同的 Lock、Type 和 Capacity，但会使用不同的 Cell 数据。

假设该交易被包含在下面的区块中：

    {
      "compact_target": "0x1a2dfb48",
      "hash": "0xba6eaa7e0acd0dc78072c5597ed464812391161f0560c35992ae0c96cd1d6073",
      "number": "0x11ea4",
      "parent_hash": "0x36f16c9a1abea1cb44bc1d923feb9f62ff45b9327188dca954968dfdecc03bd0",
      "nonce": "0x74e39f370400000000000000bb4b3299",
      "timestamp": "0x16ea78c300f",
      "transactions_root": "0x4efccc5beeeae3847aa65f2e987947957d68f13687af069f52be361d0648feb8",
      "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "version": "0x0",
      "epoch": "0x645017e00002f",
      "dao": "0x77a7c6ea619acb2e4b841a96c88e2300b6b274a096c1080000ea07db0efaff06"
    }

现在，我们可以进行下面的第二阶段交易，从 Nervos DAO 中提取代币：

    {
      "version": "0x0",
      "cell_deps": [
        {
          "out_point": {
            "tx_hash": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
            "index": "0x0"
          },
          "dep_type": "dep_group"
        },
        {
          "out_point": {
            "tx_hash": "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
            "index": "0x2"
          },
          "dep_type": "code"
        }
      ],
      "header_deps": [
        "0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc",
        "0xba6eaa7e0acd0dc78072c5597ed464812391161f0560c35992ae0c96cd1d6073"
      ],
      "inputs": [
        {
          "previous_output": {
            "tx_hash": "0x9ab05d622dc6d9816f70094242740cca594e677009b88c3f2b367d8b32f928fd",
            "index": "0x0"
          },
          "since": "0x20068d02880000b6"
        }
      ],
      "outputs": [
        {
          "capacity": "0x2e9a2ed603",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0x89e1914565e6fcc74e36d6c7bec4bdfa222b3a25",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x"
      ],
      "witnesses": [
        "0x61000000100000005500000061000000410000006114fee94f91ed089a32df9c3b0cda0ca1e1e97879d0aae253d0785fc6f7019b20cccbc7ea338ea96e64172f4a810ef531ab5ca1570a9742f0fb23378e260d9f01080000000000000000000000"
      ],
      "hash": "0x1c375948bae003ef1a9e86e6b049199480987d7dcf96bdfa2a914ecd4dadd42b"
    }

在这个交易中有几个重要的地方值得注意：

* 该交易的 `header_deps` 包含两个 header：`0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc` 包含了原始 Nervos DAO 存款单所在的区块头哈希，而 `0xba6eaa7e0acd0dc78072c5597ed464812391161f0560c35992ae0c96cd1d6073` 是 Nervos DAO 取款单所在的区块。
* 因为 `0x37ef8cf2407044d74a71f927a7e3dcd3be7fc5e7af0925c0b685ae3bedeec3bc` 位于 `header_deps` 中的索引 `0` 处，数字 `0` 将会以 64 位未签名小端序整数的格式打包，即 `0000000000000000`，并被附加到与 Nervos DAO Input Cell 对应的 Witness 末尾。
* Nervos DAO Input Cell 中有一个 `0x20068d02880000b6` 的 `since` 字段，它的计算如下：
    * 存款区块的区块头 Epoch 值为 `0x68d0288000002`，即 `2 + 648 / 1677` 个 Epoch
    * 取款单所在的区块头 Epoch 值为 `0x645017e00002f`，即 `47 + 382 / 1605` 个 Epoch
    * 离取款单最接近的 Epoch 是 `47 + 382 / 1605`，但满足锁周期的 Epoch 是 `182 + 648 / 1677`，正确的格式是 `0x68d02880000b6`。
    * 因为在 Since 字段中使用的是绝对 Epoch 数，所以需要使用必要的标志使值为 `0x20068d02880000b6`。有关格式的详细信息，请参阅 since RFC。

使用与上面相同的计算方式，取款区块 `0xba6eaa7e0acd0dc78072c5597ed464812391161f0560c35992ae0c96cd1d6073` 的 `AR` 为 `1.0008616347796555`。

现在可以计算出从上述 Nervos DAO Input Cell 中可以提取的最大 Capacity 为：

`total_capacity` = 200000000000

`occupied_capacity` = 10200000000 (8 CKB 用于 Capacity, 53 byte 用于 lock script, 33 bytes 用于 type script, 以及额外 8 byte 用于 cell 中 data 部分，这些的总和为 102 byte, 即 10200000000 shannons)

`counted_capacity` = 200000000000 - 10200000000 = 189800000000

`maximum_withdraw_capacity` = 189800000000 * 10008616347796555 / 10000435847357921 + 10200000000 = 200155259131

因此，200155259131 是最大的可以取出的 capacity。该交易有一个包含 0x2e9a2ed603 = 200155256323 的输出，他还支付了 2808 shannons 的交易手续费。现在简单测试一下：200155259131 = 200155256323 + 2808，很显然是符合的。