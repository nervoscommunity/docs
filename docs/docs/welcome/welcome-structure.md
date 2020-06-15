---
id: welcome-structure
title: CKB 结构介绍
sidebar_label: CKB 结构介绍
---

## 总览

![](/img/docs/ckb-structure.png)

在 CKB 中，有四种主要的数据结构：
* [cell](#cell)
* [script](#script)
* [交易（transaction）](#交易)
* [区块（block）](#区块)。

## Cell

### 介绍

Cell 是 CKB 中最基础的元素，是最小的组成单元，cell 可用用于存储状态或者脚本。

一个 cell 包含以下四个字段：

```
pub struct CellOutput {
    pub capacity: Capacity,
    pub data: Vec<u8>,
    pub lock: Script,
    pub type_: Option<Script>,
}
```

* `capacity` 定义 cell 容量的大小（用 shannons 表示，1 CKB = 100,000,000 shannons）
* `data` 用于存储数据（包括状态数据、脚本数据等）
* `type script` 定义 cell 类型的脚本
* `lock script` 定义 cell 所有权的脚本

### 示例

```json
{
  "capacity": "0x19995d0ccf",
  "lock": {
    "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
    "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
    "hash_type": "type"
  },
  "type": null
}
```

### 字段描述

| 名称       | 类型        | 描述                                           |
| :--------- | :--------- | :----------------------------------------------------------- |
| `capacity` | uint64     | **定义 cell 的容量大小 (用 shannons 表示)。** 当一个新的 Cell （通过转账） 生成时, 其中一条验证规则是 `capacity_in_bytes >= len(capacity) + len(data) + len(type) + len(lock)`. 这个值也代表了 CKB 作为 coin 的余额，就像比特币的 CTxOut 中的`nValue` 字段一样。(例如：Alice 拥有 100 个 CKB，这意味着她可以解锁一组共有数量为 100 个 `bytes` （即 10_000_000_000 个 `shannons`）的 Cells。) 实际返回值为十六进制字符串格式。|
| `type`     | `Script`   | **定义 cell 类型的脚本。** 它限制了新 cells 的 `data` 字段是如何从旧 cells 转换过来的。`type` 需要具有 `Script` 的数据结构。**这个字段是可选的。** |
| `lock`     | `Script`   | **定义 cell 所有权的脚本。** 就像是比特币 CTxOut 中的 `scriptPubKey` 字段一样。任何能够提供解锁参数使得脚本成功执行的人，都可以使用该 cell 作为转账的 input（即拥有该 cell 的所有权）。|

---

## Script

### 介绍

除了 CKB 协议定义的规则外，还需要根据交易中输入输出 cell 中的脚本进行验证。

`lock script` 和 `type script` 都是限制交易逻辑的脚本，都具有 `script` 结构，但是它们的验证逻辑不同：

* 对交易中所有输入 cell 的 `lock script` 进行验证
* 对交易中所有输入和输出 cell 的 `type script` 进行验证

理解 `lock script` 和 `type script` 的操作，对于理解 Nervos CKB 上的状态转换、UDT 实现、程序逻辑实现等内容至关重要。

### lock script

`lock script` 通常用来处理和 cell 所有权相关的逻辑。

一个典型的 `lock script` 会在 `code_hash` 中引用存放引用的签名算法的 cell 的哈希值，在 `args` 中存放与公钥地址相关的参数。在需要解锁这个 cell，也就是完成这个 cell 的 `lock script` 验证的时候，用户需要在 `witness` 字段中放入签名信息。在验证过程中，`lock script` 将通过签名信息和索引的签名算法，验证结果是否与 `args` 字段匹配，确保该笔交易确实是由输入 cell 的所有者进行签名的。

> 注意：`lock script` 中使用的签名算法和哈希函数不是由 CKB 协议写死的。开发者可以自由地在脚本中设计和实现定制化的签名算法和哈希函数。（当然，`type script` 中也可以实现相关内容）

### type script

`type script` 通常用来定义 cell 转换的条件，或者说，定义了状态转换的约束条件。在一笔交易中，当输入 cell 和 输出 cell 具有相同的 `type script` 时，那么从输出 cell 到输入 cell 的转换就必须符合 `type script` 定义的规则。

例如：Alice 拥有一个 cell，其中的 `data` 字段存储了她持有的某种特定 UDT（User Defined Token 用户自定义代币）的余额，其中 `type script` 字段定义了该 UDT 的规则和逻辑。此时，Alice 想要向 Bob 发送一些代币，那么她需要将这个 cell 作为输入，并创建一个具有相同 `type script` 的输出 cell，而这个新的输出 `cell` 将使用 Bob 的 `lock script`。然后 Alice 可以组装交易，并将交易发送到 CKB 节点即可。（注意，如果 Alice 没有将这个 cell 中全部的代币都发送给 Bob，那么她还需要再为自己创建一个输出 cell 用于存放找零的代币）

### 示例

```json
{
  "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
  "hash_type": "type"
}
```

### 字段描述

| 名称           | 类型                        | 描述                          |
| :------------ | :----------------------------------- | :----------------------------------------------------------- |
| `code_hash`   | H256(hash)                           | **定义为包含 CKB 脚本的具有 ELF 格式的 RISC-V 二进制文件的哈希值。** 出于空间效率的考虑，实际脚本会作为 dep cell 附到当前转账中。根据 `hash_type` 的值，此处指定的哈希应该匹配 dep cell 中 cell data 部分的哈希或者是 dep cell 中 type script 的哈希。当它在转账验证中被指定时，实际的二进制文件会被加载到 CKB-VM 中。 |
| `args`        | [Bytes]                              | **定义为作为脚本输入的参数数组。** 这里的参数将作为脚本的输入参数导入到 CKB-VM 中。注意，对于锁脚本，相应的 CellInput 将有另一个 args 字段附加到这个数组中，以形成完整的输入参数列表。 |
| `hash_type`   | String, 可以是 `type` 或者 `data`    | **定义为查找 dep cells 时对代码哈希的说明。** 如果是 `data`，`code_hash` 需要匹配 dep cell 中 data 部分经过 blake2b 得到的哈希；如果是 `type`，`code_hash` 需要需要匹配 dep cell 中 type script 的哈希。 |

### lock script 与 type script 的区别

关于 `lock script` 与 `type script` 的设计缘由和具体区别的讨论由来已久，鉴于 CKB 是一个相当灵活的模型，我们对于 `lock script` 和 `type script` 可能也是相对局限和片面的，因此此处我们将提供多方解释，希望可以帮助大家理解，也希望大家可以打开思路，畅想两者的新用法。

* 来自 lan 的解释：

> lock 管死，type 管生。lock 负责 tx 中 input cells 的验证，type 负责 output cells 的验证。type 负责的是不能随意创建有某个 type 的 cell 出来，反过来的话，如果 cell 的 type 是 X，那 cell 一定通过了 X 的验证。

* 来自 leeyr 的例子：

> 我感觉用现实的物品做类比，就像：
> * `lock scrip`是保险箱的密码
> * `type scrip`是里面物品的防伪认证。
> 比如在保险箱里放的是“美金”，不是所有纸张都叫“美金”，它是具有一定特征的，这个 `type scrip` 实际上认证了这个保险箱里放的确实是“美金”，而不是“人民币”。
>
> 按理来说，把价值存储在一个地方(SoV)是要付“保管费”的，以使得管理者能有资金和动力去加强安全网络，以保证你的资产安全；在区块链网络中其实就是矿工，由矿工来保证网络的安全。
>
> 在以太坊的网络里，这个“保险箱”是所有用户共有的（所有用户的资产都放在一个合约里），所以所难去收“保管费”。
CKB的高明之处在于，把这个“保险箱”私有化，就可以收取一定的“保管费”来建立整个网络的安全。

* 来自 Cipher 的解释：

> “type 是对 cell data 内容的约束”。这句话应该这么理解：
>
> 假设一个 cell 内的 data 就只有 u256 一个数据，代表某个 UDT 的余额。在没有任何约束的情况下，任何人都可以构造一个 data 内容等于 MAX_INT 的 cell，来冒充这种 UDT。
>
> 因此 CKB 的小伙伴发明了 type 字段对其进行约束：所有 type 字段相等（=某个合约的hash值）的 cell 中的data 的含义使用同一个合约进行解析，并且只有这种 cell 能够用这个合约进行解析。所以你可以伪造一个 data 内容任意的 cell，但只要你的 type 字段内容不是特定 UDT 的 type，它就不是这个 UDT 的余额。
>
> 那么还剩一个问题，type 字段的内容如何管理——总不能谁都可以把自己的 cell 设置为任意的 type 吧。CKB 接着要求每个 cell 在生成的时候必须通过 type script 的校验。也就是说，generator 可以指定生成的 cell 的 type 为任意值，只要这个 TX 能够通过对应的 type script 的校验。那么显然，类似 UDT 的数额平衡会出现在对应的 type script 中，防止凭空印钱以及凭空烧币。其他的合约也会在这里对 cell data 的内容进行约束。
>
> 所以，type 就是对 cell data 内容的约束，这个约束发生在 TX / output cell 的创建时。如果一个 TX 包含多个不同 type 的 output cell 怎么办？挨个验算。

---

## 交易

### 介绍

交易用于更新 CKB 链上的 cell（即链上的状态）。通过向 CKB 节点发送一笔交易，该交易将被所有节点验证和确认，一旦通过验证和确认，那么包含新状态的 cell 将在链上生效。

每笔交易都包含一组输入 cell（旧状态）和一组输出 cell（新状态）。这与以太坊中的交易不同，在以太坊中，交易只包含一笔交易来进行链上状态的更新。在以太坊的节点收到交易后，节点将根据交易数据和之前链上的状态计算新状态，然后将旧状态替换为新计算的状态。以太坊属于链上计算，链上验证；而 Nervos CKB 选择的是链下计算，链上验证。

一笔交易主要包含三个部分：一组输入 cell（`input`），一组输出 cell（`output`），依赖库代码（`deps`）和签名（`witness`）来支持交易处理。

关于交易结构的更多资料可以查看 [RFC-0022-交易结构](../../rfcs/0019-data-structures/0019-data-structures.zh)。

### 交易验证

在 CKB 节点收到交易后，首先验证交易是否符合 CKB 协议规则，规则示例如下：

1. 只有 live cell 可以作为交易的输入。一个 cell 要么是 live 的（未消费的），要么是 dead（已消费的）。当一笔交易被打包并在链上确认后，那么它的输入 cell 将变成 dead cell，而它的输出 cell 将变成 live cell。这种机制可以防止某个 cell 被重复消费，这类似于比特币的 UTXO 模型。

2. 输出 cell 的 capacity 总量必须小于等于输入 cell 的 capacity 总量。（确保不会无缘无故创造出新的 capacity 即 CKB）

### 示例

```json
{
  "version": "0x0",
  "cell_deps": [
    {
      "out_point": {
        "tx_hash": "0xbd864a269201d7052d4eb3f753f49f7c68b8edc386afc8bb6ef3e15a05facca2",
        "index": "0x0"
      },
      "dep_type": "dep_group"
    }
  ],
  "header_deps": [
    "0xaa1124da6a230435298d83a12dd6c13f7d58caf7853f39cea8aad992ef88a422"
  ],
  "inputs": [
    {
      "previous_output": {
        "tx_hash": "0x8389eba3ae414fb6a3019aa47583e9be36d096c55ab2e00ec49bdb012c24844d",
        "index": "0x1"
      },
      "since": "0x0"
    }
  ],
  "outputs": [
    {
      "capacity": "0x746a528800",
      "lock": {
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "args": "0x56008385085341a6ed68decfabb3ba1f3eea7b68",
        "hash_type": "type"
      },
      "type": null
    },
    {
      "capacity": "0x1561d9307e88",
      "lock": {
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "args": "0x886d23a7858f12ebf924baaacd774a5e2cf81132",
        "hash_type": "type"
      },
      "type": null
    }
  ],
  "outputs_data": [
    "0x",
    "0x"
  ],
  "witnesses": ["0x55000000100000005500000055000000410000004a975e08ff99fa0001
    42ff3b86a836b43884b5b46f91b149f7cc5300e8607e633b7a29c94dc01c6616a12f62e74a1
    415f57fcc5a00e41ac2d7034e90edf4fdf800"
  ]
}
```

### 字段描述

#### 转账

| 名称              | 类型                             | 描述                                                  |
| ----------------- | -------------------------------- | ------------------------------------------------------------ |
| `version`         | uint32                           | **定义为当前转账的版本。** 当区块链系统发生分叉时，用它来区分转账（发生在哪一条链上）。 |
| `cell_deps`       | [`CellDep`]                      | **一个 `outpoint` 数组，指向此转账依赖的 cells。** 只有 live 的 cells 才可以列在这里。这里列出的 cells 是 read-only 的。 |
| `header_deps`     | [`H256(hash)`]                   | **一个 `H256` 哈希数组，指向此转账依赖的区块头。** 注意这里需要采用等待一定区块完成确认的规则：一笔交易只能引用至少已经完成 4 个 epochs 以上确认的区块头。 |
| `inputs`          | [`CellInput`]                    | **一个引用 cell inputs 的数组。** 参见下文对基本数据结构的解释。 |
| `outputs`         | [`Cells`], 详情见上文 | **一个作为 outputs 的 cells 数组。** 也就是新生成的 cells。这些 cells 可以作为其他转账的 inputs。每一个 Cell 都拥有和上面 [Cell 章节](#cell)一样的结构。 |
| `outputs_data`    | [`Bytes`]                        | **一个由所有 cell output 的 cell data 组成的数组。** 将实际数据与输出分离，以便于 CKB 脚本的处理和未来优化的可能。 |
| `witnesses`       | [`Bytes`]                        | **Witnesses 由交易创建器提供，使得相应的锁脚本可以成功执行。** 这里的一个例子是，这里可能包含签名，以确保签名验证的锁脚本可以通过。  |

#### CellDep

| 名称        | 类型                                 | 描述                                                 |
| ----------- | ------------------------------------ | --------------------------------------------------- |
| `out_point` | `OutPoint`                           | **一个指向 cells 的 cell outpoint，和 deps 一样使用。** Dep cells 和转账相关，它可以用于放置会加载到 CKB VM 中的代码，或者用于放置可用于脚本执行的数据。 |
| `dep_type`  | String, 是 `code` 或者是 `dep_group` | **解释引用 cell deps 的方法。** cell dep 可以通过两种方式进行引用：对于 `dep_type` 是 `code` 的 cell dep，这个 dep cell 会直接包含在转账中。对于 `dep_type` 是 `dep_group` 的 cell dep，假设这个 cell 包含了一个 cell deps 的列表，CKB 可以先加载这个 dep cell，然后将剩下的 cell deps 替代当前的 cell dep，并将它们包含在当前的转账中。这可以在一个 CellDep 结构中包含多个更快更小（就转账大小而言）的 dep cells。 |

#### CellInput

| 名称              | 类型        | 描述                                                  |
| ----------------- | ---------- | ------------------------------------------------------------ |
| `previous_output` | `OutPoint` | **一个指向之前作为 inputs cells 的 cell outpoint。** 输入 cells 实际上在上一次转账中是输出，因此在这里将它们标记为 `previous_output`。这些 Cells 通过 `outpoint` 进行引用，它会包含上一次转账的转账 `hash`，并在转账的 output 列表内包含这个 cell 的 `index`。 |
| `since`           | uint64     | **Since 值用于保护当前引用的 inputs。** 更多详情请参阅 [Since RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md)。 |

#### OutPoint

| 名称    | 类型              | 描述                                                  |
| ------- | ------------------ | ------------------------------------------------------------ |
| `hash`  | H256(hash)         | **当前 cell 所属的转账的哈希。**   |
| `index` | uint32             | **当前 cell 的转账 output 列表的索引。** |

关于 Nervos CKB 上转账的更多信息，可以在  [RFC-0022-交易结构](../../rfcs/0019-data-structures/0019-data-structures.zh) 中找到。

---

## 区块

### 介绍

区块结构中包含一组交易和一个包含元数据的区块头。

矿工的工作是将交易打包到一个区块中，并进行工作量证明计算，获取交易打包的权力，最后将打包好的区块广播到 CKB 网络。其他矿工在接收到这个区块后，验证这个区块中的内容，然后再从自己的交易池中收集一部分交易，并开始基于这个接收到的区块挖掘下一个新的区块。

在 CKB 中，一个区块在它的区块结构中还包含了叔块的信息，包括完整的叔块头和叔块的 `proposals`（提案交易，因为 CKB 采用的是两步交易确认，一笔交易被确认需要经过 proposal 和 commit 两步，了解更多请参考 [RFC-0020-CKB 共识协议](../../rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.zh)）。

### 计算 cycles 和交易大小

在打包一笔交易到区块中时，矿工需要考虑两个限制：计算 cycles 和交易大小。

在 CKB 中，交易验证（特别是脚本执行）所消耗的计算资源是通过 cycles 来衡量的。CKB VM 中每一条指令都有不同的 cycles 成本。验证区块中所有交易执行的所有脚本所消耗的总 cycles 受到 CKB 协议中定义的 `MAX_BLOCK_CYCLES` 值的限制。（了解更多关于 cycles 计算的信息，请参考 [RFC-0014-VM Cycle 限制](../../rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.zh)）

交易的大小通过字节作为单位去衡量。区块中所有交易的大小总和应该要小于 CKB 协议定义的 `MAX_BLOCK_BYTES` 值。

> 在 CKB 主网 Lina 中，`MAX_BLOCK_CYCLES` 值为 `597_000`；`MAX_BLOCK_BYTES` 值为 `3_500_000_000`。



### 示例

```json
{
  "uncles": [
    {
      "proposals": [

      ],
      "header": {
        "compact_target": "0x1a9c7b1a",
        "hash": "0x87764caf4a0e99302f1382421da1fe2f18382a49eac2d611220056b0854868e3",
        "number": "0x129d3",
        "parent_hash": "0x815ecf2140169b9d283332c7550ce8b6405a120d5c21a7aa99d8a75eb9e77ead",
        "nonce": "0x78b105de64fc38a200000004139b0200",
        "timestamp": "0x16e62df76ed",
        "transactions_root": "0x66ab0046436f97aefefe0549772bf36d96502d14ad736f7f4b1be8274420ca0f",
        "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "version": "0x0",
        "epoch": "0x7080291000049",
        "dao": "0x7088b3ee3e738900a9c257048aa129002cd43cd745100e000066ac8bd8850d00"
      }
    }
  ],
  "proposals": [
    "0x5b2c8121455362cf70ff"
  ],
  "transactions": [
    {
      "version": "0x0",
      "cell_deps": [

      ],
      "header_deps": [

      ],
      "inputs": [
        {
          "previous_output": {
            "tx_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "index": "0xffffffff"
          },
          "since": "0x129d5"
        }
      ],
      "outputs": [
        {
          "capacity": "0x1996822511",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0x2ec3a5fb4098b14f4887555fe58d966cab2c6a63",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x"
      ],
      "witnesses": ["0x590000000c00000055000000490000001000000030000000310000009b
          d7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce801140000002
          ec3a5fb4098b14f4887555fe58d966cab2c6a6300000000"
      ],
      "hash": "0x84395bf085f48de9f8813df8181e33d5a43ab9d92df5c0e77d711e1d47e4746d"
    }
  ],
  "header": {
    "compact_target": "0x1a9c7b1a",
    "hash": "0xf355b7bbb50627aa26839b9f4d65e83648b80c0a65354d78a782744ee7b0d12d",
    "number": "0x129d5",
    "parent_hash": "0x4dd7ae439977f1b01a8c9af7cd4be2d7bccce19fcc65b47559fe34b8f32917bf",
    "nonce": "0x91c4b4746ffb69fe000000809a170200",
    "timestamp": "0x16e62dfdb19",
    "transactions_root": "0x03c72b4c2138309eb46342d4ab7b882271ac4a9a12d2dcd7238095c2d131caa6",
    "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "uncles_hash": "0x90eb89b87b4af4c391f3f25d0d9f59b8ef946d9627b7e86283c68476fee7328b",
    "version": "0x0",
    "epoch": "0x7080293000049",
    "dao": "0xae6c356c8073890051f05bd38ea12900939dbc2754100e0000a0d962db850d00"
  }
}
```

### 字段描述

#### 区块

| 名称                    | 类型            | 描述                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------ |
| `header`                | `Header`        | **区块的区块头** 这一部分包含区块的一些元数据，请参阅下方[区块头](#header)部分，了解更多细节 |
| `trasactions`           | [`Transaction`] | **一个由区块中已经确认提交的转账组成的数组。** 这个数组中每个元素都具有同上面[转账]部分一样的结构 |
| `proposals`             | [string]        | **一个由提案转账进行十六进制编码后的短转账 ID 组成的数组。** |
| `uncles`                | [`UncleBlock`]  | **一个由叔块组成的数组** 详情参阅下方[叔块]部分。 |

#### 区块头

(`区块头` 是 `区块` 和 `叔块` 的子结构。)

| 名称                | 类型        | 描述                                                       |
| ------------------- | ---------- | ------------------------------------------------------------ |
| `compact_target`    | uint32     | **以压缩的格式表示的 PoW 解谜（挖矿）难度。** |
| `number`            | uint64     | **区块高度。**                                        |
| `parent_hash`       | H256(hash) | **上一个区块的哈希。**                            |
| `nonce`             | uint128    | **随机数。** 类似于[比特币中的随机数](https://en.bitcoin.it/wiki/Nonce)， 表示 PoW 谜题的解 |
| `timestamp`         | uint64     | **一个 [Unix time](http://en.wikipedia.org/wiki/Unix_time) 时间戳按毫秒计。** |
| `transactions_root` | H256(hash) | **串联的转账哈希的 CBMT 根和转账 witness 哈希的 CBMT 根的哈希。** |
| `proposals_hash`    | H256(hash) | **串联的提案 ids 的哈希。** (当没有提案时所有数字为 0) |
| `uncles_hash`       | H256(hash) | **所有叔块头的串联的哈希的哈希。** （当没有叔块时所有数字为 0) |
| `version`           | uint32     | **区块的版本。** 这是用于解决在 fork 之后可能出现的兼容性问题 |
| `epoch`             | uint64     | **当前 epoch 的信息。** 假设 `number` 代表当前 epoch 的数字，`index` 代表当前 epoch 中区块的索引（从 0 开始），`length` 代表当前 epoch 的长度。那么这里的值需要满足 `(number & 0xFFFFFF) | ((index & 0xFFFF) << 24) | ((length & 0xFFFF) << 40)` 。 |
| `dao`               | Bytes      | **包含 DAO 相关的信息。** 详情参阅 Nervos DAO RFC。 |

#### 叔块

(`叔块` 是 `区块` 的子结构。)

| 名称                    | 类型          | 描述                                                 |
| ----------------------- | ------------- | ------------------------------------------------------------ |
| `header`                | `Header`      | **叔块的区块头。** 这部分的内部结构和上方[区块头]一致 |
| `proposals`             | [`string`]    | **一个由叔块中提案转账的短转账 IDs 组成的数组** |
