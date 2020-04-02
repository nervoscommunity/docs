---
id: welcome-structure
title: CKB 结构
sidebar_label: CKB 结构
---

在 CKB 中，有四种主要的数据结构：cell，交易，script 和区块。

## Cell

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

| 名称       | 类型        | 描述                                           |
| :--------- | :--------- | :----------------------------------------------------------- |
| `capacity` | uint64     | **定义 cell 的容量大小 (用 shannons 表示)。** 当一个新的 Cell （通过转账） 生成时, 其中一条验证规则是 `capacity_in_bytes >= len(capacity) + len(data) + len(type) + len(lock)`. 这个值也代表了 CKB 作为 coin 的余额，就像比特币的 CTxOut 中的`nValue` 字段一样。(例如：Alice 拥有 100 个 CKB，这意味着她可以解锁一组共有数量为 100 个 `bytes` （即 10_000_000_000 个 `shannons`）的 Cells。) 实际返回值为十六进制字符串格式。|
| `type`     | `Script`   | **定义 cell 类型的脚本。** 它限制了新 cells 的 `data` 字段是如何从旧 cells 转换过来的。`type` 需要具有 `Script` 的数据结构。**这个字段是可选的。** |
| `lock`     | `Script`   | **定义 cell 所有权的脚本。** 就像是比特币 CTxOut 中的 `scriptPubKey` 字段一样。任何能够提供解锁参数使得脚本成功执行的人，都可以使用该 cell 作为转账的 input（即拥有该 cell 的所有权）。|

## Script

除了 CKB 协议定义的规则外，还需要根据交易中输入输出 cell 中的脚本进行验证。

`lock script` 和 `type script` 都是限制交易逻辑的脚本，都具有 `script` 结构，但是它们的验证逻辑不同：

* 对交易中所有输入 cell 的 `lock script` 进行验证
* 对交易中所有输入和输出 cell 的 `type script` 进行验证

理解 `lock script` 和 `type script` 的操作，对于理解 Nervos CKB 上的状态转换、UDT 实现、程序逻辑实现等内容至关重要。

### 示例

```json
{
  "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
  "hash_type": "type"
}
```

| 名称           | 类型                        | 描述                          |
| :------------ | :----------------------------------- | :----------------------------------------------------------- |
| `code_hash`   | H256(hash)                           | **定义为包含 CKB 脚本的具有 ELF 格式的 RISC-V 二进制文件的哈希值。** 出于空间效率的考虑，实际脚本会作为 dep cell 附到当前转账中。根据 `hash_type` 的值，此处指定的哈希应该匹配 dep cell 中 cell data 部分的哈希或者是 dep cell 中 type script 的哈希。当它在转账验证中被指定时，实际的二进制文件会被加载到 CKB-VM 中。 |
| `args`        | [Bytes]                              | **定义为作为脚本输入的参数数组。** 这里的参数将作为脚本的输入参数导入到 CKB-VM 中。注意，对于锁脚本，相应的 CellInput 将有另一个 args 字段附加到这个数组中，以形成完整的输入参数列表。 |
| `hash_type`   | String, 可以是 `type` 或者 `data`    | **定义为查找 dep cells 时对代码哈希的说明。** 如果是 `data`，`code_hash` 需要匹配 dep cell 中 data 部分经过 blake2b 得到的哈希；如果是 `type`，`code_hash` 需要需要匹配 dep cell 中 type script 的哈希。 |

### lock script

`lock script` 通常用来处理和 cell 所有权相关的逻辑。

一个典型的 `lock script` 会在 `code_hash` 中引用存放引用的签名算法的 cell 的哈希值，在 `args` 中存放与公钥地址相关的参数。在需要解锁这个 cell，也就是完成这个 cell 的 `lock script` 验证的时候，用户需要在 `witness` 字段中放入签名信息。在验证过程中，`lock script` 将通过签名信息和索引的签名算法，验证结果是否与 `args` 字段匹配，确保该笔交易确实是由输入 cell 的所有者进行签名的。

> 注意：`lock script` 中使用的签名算法和哈希函数不是由 CKB 协议写死的。开发者可以自由地在脚本中设计和实现定制化的签名算法和哈希函数。（当然，`type script` 中也可以实现相关内容）

### type script


### lock script 与 type script 的区别