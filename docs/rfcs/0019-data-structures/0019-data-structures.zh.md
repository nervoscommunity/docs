---
id: 0019-data-structures.zh
title: Nervos CKB 的数据结构
sidebar_label: 19：Nervos CKB 的数据结构
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0019 | Informational | Draft | Xuejie Xiao |Nervos Foundation|2019-03-26|

# Nervos CKB 的数据结构

本文档描述了 CKB 中使用的所有基本数据结构。

* [Cell](#cell)
* [Script](#script)
* [Transaction](#transaction)
* [Block](#block)

## Cell

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


### 描述

| 名称       | 类型        | 描述                                                  |
| :--------- | :--------- | :----------------------------------------------------------- |
| `capacity` | uint64     | **定义 cell 的容量大小 (用 shannons 表示)。** 当一个新的 Cell （通过转账） 生成时, 其中一条验证规则是 `capacity_in_bytes >= len(capacity) + len(data) + len(type) + len(lock)`. 这个值也代表了 CKB 作为 coin 的余额，就像比特币的 CTxOut 中的`nValue` 字段一样。(例如：Alice 拥有 100 个 CKB，这意味着她可以解锁一组共有数量为 100 个 `bytes` （即 10_000_000_000 个 `shannons`）的 Cells。) 实际返回值为十六进制字符串格式。|
| `type`     | `Script`   | **定义 cell 类型的脚本。** 它限制了新 cells 的 `data` 字段是如何从旧 cells 转换过来的。`type` 需要具有 `Script` 的数据结构。**这个字段是可选的。** |
| `lock`     | `Script`   | **定义 cell 所有权的脚本。** 就像是比特币 CTxOut 中的 `scriptPubKey` 字段一样。任何能够提供解锁参数使得脚本成功执行的人，都可以使用该 cell 作为转账的 input（即拥有该 cell 的所有权）。|


关于 Cell 的更多信息可以在 [白皮书](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md#42-cell) 中找到。



## Script

### 示例

```json
{
  "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
  "hash_type": "type"
}
```



### 描述

| 名称           | 类型                                 | 描述                                                  |
| :------------ | :----------------------------------- | :----------------------------------------------------------- |
| `code_hash`   | H256(hash)                           | **定义为包含 CKB 脚本的具有 ELF 格式的 RISC-V 二进制文件的哈希值。** 出于空间效率的考虑，实际脚本会作为 dep cell 附到当前转账中。根据 `hash_type` 的值，此处指定的哈希应该匹配 dep cell 中 cell data 部分的哈希或者是 dep cell 中 type script 的哈希。当它在转账验证中被指定时，实际的二进制文件会被加载到 CKB-VM 中。 |
| `args`        | [Bytes]                              | **定义为作为脚本输入的参数数组。** 这里的参数将作为脚本的输入参数导入到 CKB-VM 中。注意，对于锁脚本，相应的 CellInput 将有另一个 agrs 字段附加到这个数组中，以形成完整的输入参数列表。 |
| `hash_type`   | String, 可以是 `type` 或者 `data`    | **定义为查找 dep cells 时对代码哈希的说明。** 如果是 `data`，`code_hash` 需要匹配 dep cell 中 data 部分经过 blake2b 得到的哈希；如果是 `type`，`code_hash` 需要需要匹配 dep cell 中 type script 的哈希。 |

当一个脚本被验证时，CKB 链会在 RISC-V 虚拟机内运行它，`args` 必须通过特殊的 CKB syscalls 进行调用加载。CKB 中不使用 UNIX 标准中的 `argc`/`argv` 方法。想要了解更多关于 CKB 虚拟机的信息，请参阅 [CKB VM RFC](../0003-ckb-vm/0003-ckb-vm.md)。

更多关于 `Script` 结构如何应用的信息，请参阅 [CKB repo](https://github.com/nervosnetwork/ckb)。



## 转账

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

### 描述

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


关于 Nervos CKB 上转账的更多信息，可以在 [whitepaper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md#44-transaction) 中找到。



## 区块

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

### 描述

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