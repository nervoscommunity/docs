---
id: ckb-cli-rpc
title: RPC 调用
sidebar_label: RPC 调用
---

## rpc 子命令

|方法|描述|
|---|---|
|[get_block](#get_block)                               |通过 hash 获取 block 信息|
|[get_block_by_number](#get_block_by_number)                     |通过高度获取 block 信息|
|[get_block_hash](#get_block_hash)                          |通过高度获取 block hash|
|[get_cellbase_output_capacity_details](#get_cellbase_output_capacity_details)    |通过 hash 获取区块头内容|
|[get_cells_by_lock_hash](#get_cells_by_lock_hash)                  |通过 lock hash 获取 cell|
|[get_current_epoch](#get_current_epoch)                       |获取当前 epoch 信息|
|[get_epoch_by_number](#get_epoch_by_number)                     |通过 epoch 数获取 epoch 信息|
|[get_header](#get_header)                              |通过 hash 获取区块头|
|[get_header_by_number](#get_header_by_number)                    |通过高度获取区块头|
|[get_live_cell](#get_live_cell)                           |获取 live cell (live 意味这是未花费的)|
|[get_tip_block_number](#get_tip_block_number)                    |获取最高块高度|
|[get_tip_header](#get_tip_header)                          |获取最高块内容|
|get_transaction                         |通过交易 hash 获取交易内容|
|deindex_lock_hash                       |通过 hash 删除 live cell 和交易的索引|
|get_live_cells_by_lock_hash             |通过 hash 获取 live cell 的集合|
|get_transactions_by_lock_hash           |通过 hash 获取交易，当 lock_hash 没有被索引时返回空数组|
|index_lock_hash                         |通过 hash 为 live cell 和交易创建索引|
|get_banned_addresses                    |获取所有被禁止的 IP/子网掩码|
|get_peers                               |获取链接的节点|
|local_node_info                         |获取本地节点信息|
|set_ban                                 |从禁止列表中插入或删除一个 IP/子网掩码|
|tx_pool_info                            |获取交易池信息|
|get_blockchain_info                     |获取链信息|
|add_node                                |手动连接到节点|
|remove_node                             |手动断开节点|
|broadcast_transaction                   |广播未签名的交易|

---

### 输出格式

默认输出 yaml 格式，加入 `--output-format json` 后输出 json 格式。

#### 默认输出 yaml 格式

请求:
```
ckb-cli rpc get_tip_header
```

<details>
<summary>点击查看详细输出</summary>

```yaml
version: 0
compact_target: 0x20010000
timestamp: "1585623784848 (2020-03-31 11:03:04.848 +08:00)"
number: 15
epoch: "0x3e8000f000000 {number: 0, index: 15, length: 1000}"
parent_hash: 0xaef44205227ee5c1ed9054c7cf90bf7893d9ec95cf769497d5a4d4887119c67a
transactions_root: 0xf20f3b68f7661180b162f93eb001edc70c3b77f01e750ca5b4a3c4ef95f53e1d
proposals_hash: 0x0000000000000000000000000000000000000000000000000000000000000000
uncles_hash: 0x0000000000000000000000000000000000000000000000000000000000000000
dao: 0x4030263fe021a12eb4e10d13f38623006132a176c400000000c78cd606fbfe06
nonce: 0x4215d94fd0f4fa327c3b192a054ace61
hash: 0xbf6b97e591081f0412d58da5aa802a3bff28d2442384f413beb763df6d1af286
```
</details>

#### 输出 json 格式

请求:
```
ckb-cli rpc get_tip_header --output-format json
```

<details>
<summary>点击查看详细输出</summary>

```json
{
  "compact_target": "0x20010000",
  "dao": "0x50ccf902cc22a12e14d8993ef3862300f0ab150bf5000000003be7840cfbfe06",
  "epoch": "0x3e80013000000 {number: 0, index: 19, length: 1000}",
  "hash": "0xcb76494f2a288eecb8965be41eb1e7aa337dc30c9604dc0791a1bc581bade1f8",
  "nonce": "0x1c30e32d0f9c98b299df3272acd0d0ab",
  "number": 19,
  "parent_hash": "0xd1bfac76c80bdffe80d8865a4d13fbff75eb563a3ef9b106b334b5577683e1dc",
  "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "1585623804894 (2020-03-31 11:03:24.894 +08:00)",
  "transactions_root": "0x4f2605ef84fd54fe457c40c5efef0333b184cf6de5286e28b6452ec4fdada52e",
  "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "version": 0
}
```
</details>

---

### `get_block`

通过 hash 获取 block 信息

> 用法：`ckb-cli rpc get_block --hash <hash> --output-format <output-format>`

请求：
```
ckb-cli rpc get_block --hash 0xe40b78aadfa3e0a3ebbbfe6bcf0c9c1bf8e9875aafb9e257650f61ba29f91813 --output-format json
```

<details>
<summary>点击查看详细输出</summary>

```json
{
  "header": {
    "compact_target": "0x20010000",
    "dao": "0x60ee2736217ca12e721996be03872300f06cdb4d5d130000002f2d9533fdfe06",
    "epoch": "0x3e80197000000 {number: 0, index: 407, length: 1000}",
    "hash": "0xe40b78aadfa3e0a3ebbbfe6bcf0c9c1bf8e9875aafb9e257650f61ba29f91813",
    "nonce": "0x632ce6b0af4a476f6885b2400bba20e6",
    "number": 407,
    "parent_hash": "0x3da752ce6c27ca54ef076c4b14ac41e05078b3c4ccb1870bbc6b610af5848c12",
    "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "1585631634141 (2020-03-31 13:13:54.141 +08:00)",
    "transactions_root": "0x5c8ca246d6a09d81fb75c296241e39fb0c305466908ea087905b11973e799006",
    "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "version": 0
  },
  "proposals": [],
  "transactions": [
    {
      "cell_deps": [],
      "hash": "0x2663350738fd7032341b2959dcd6ca78248d4b6d5826ddd7d0d37d6f0bcba2cc",
      "header_deps": [],
      "inputs": [
        {
          "previous_output": {
            "index": 4294967295,
            "tx_hash": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          "since": "0x197 (absolute block(407))"
        }
      ],
      "outputs": [
        {
          "capacity": "2009.88191668",
          "lock": {
            "args": "0xc4841b76021839360b4bbea51a290150b268abab",
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8 (sighash)",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x"
      ],
      "version": 0,
      "witnesses": [
        "0x590000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000c4841b76021839360b4bbea51a290150b268abab00000000"
      ]
    }
  ],
  "uncles": []
}
```
</details>

---

### `get_block_by_number`

通过区块高度获取 block 信息

> 用法：`ckb-cli rpc get_block_by_number --number <number> --output-format <output-format>`


请求：
```
ckb-cli rpc get_block_by_number --number 66 --output-format json
```

<details>
<summary>点击查看详细输出</summary>

```json
{
  "header": {
    "compact_target": "0x20010000",
    "dao": "0x0c36f03f9e2da12e2936463ef58623005fe678db2f030000000e8e454ffbfe06",
    "epoch": "0x3e80042000000 {number: 0, index: 66, length: 1000}",
    "hash": "0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f",
    "nonce": "0x96aec3fcd4d936b0ece72b2b42e16cdd",
    "number": 66,
    "parent_hash": "0x4fb0ef914a5ad1287ed9a0a9cadc50f000a2e9493d31edbc9d9d0d3b5f1b1664",
    "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "1585624040324 (2020-03-31 11:07:20.324 +08:00)",
    "transactions_root": "0x6d79a7b986ab70077dc8761e863e013f8d1b65fcacc6fdcd3612948a102dc87c",
    "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "version": 0
  },
  "proposals": [],
  "transactions": [
    {
      "cell_deps": [],
      "hash": "0x88fb7cba95ff13f26e4748bd95da951d70ec2c66738509e0b913c5f61e10960c",
      "header_deps": [],
      "inputs": [
        {
          "previous_output": {
            "index": 4294967295,
            "tx_hash": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          "since": "0x42 (absolute block(66))"
        }
      ],
      "outputs": [
        {
          "capacity": "2009.88390228",
          "lock": {
            "args": "0xc4841b76021839360b4bbea51a290150b268abab",
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8 (sighash)",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x"
      ],
      "version": 0,
      "witnesses": [
        "0x590000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000c4841b76021839360b4bbea51a290150b268abab00000000"
      ]
    }
  ],
  "uncles": []
}
```
</details>

---


### `get_block_hash`

通过高度获取 block hash

> 用法：`ckb-cli rpc get_block_hash --number <number> --output-format <output-format>`


请求：
```
ckb-cli rpc get_block_hash --number 66
```

响应：
```yaml
0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f
```

---

### `get_cellbase_output_capacity_details`

通过 hash 获取区块头内容

> 用法：`ckb-cli rpc get_cellbase_output_capacity_details --hash <hash> --output-format <output-format>`


请求：
```
ckb-cli rpc get_cellbase_output_capacity_details --hash 0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f --output-format json
```

响应：
```json
{
  "primary": "1917.80821918",
  "proposal_reward": "0.0",
  "secondary": "92.0756831",
  "total": "2009.88390228",
  "tx_fee": "0.0"
}
```

---

### `get_cells_by_lock_hash`

通过 loch hash 获取 cell

> 用法：`ckb-cli rpc get_cells_by_lock_hash --from <from> --hash <hash> --output-format <output-format> --to <to>`

---

### `get_current_epoch`

获取当前 epoch 信息

> 用法：`ckb-cli rpc get_current_epoch --output-format <output-format>`

请求
```
ckb-cli rpc get_current_epoch
```

响应：
```yaml
number: 0
start_number: 0
length: 1000
compact_target: 0x20010000
```

---

### `get_epoch_by_number`

通过 epoch 高度获取 epoch 信息

> 用法：`ckb-cli rpc get_epoch_by_number --number <number> --output-format <output-format>`

请求
```
ckb-cli rpc get_epoch_by_number --number 0
```

响应：
```yaml
number: 0
start_number: 0
length: 1000
compact_target: 0x20010000
```

---

### `get_header`

通过 hash 获取区块头

> 用法：`ckb-cli rpc get_header --hash <hash> --output-format <output-format>`

请求
```
ckb-cli rpc get_header --hash 0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f --output-format json
```

响应：
```json
{
  "compact_target": "0x20010000",
  "dao": "0x0c36f03f9e2da12e2936463ef58623005fe678db2f030000000e8e454ffbfe06",
  "epoch": "0x3e80042000000 {number: 0, index: 66, length: 1000}",
  "hash": "0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f",
  "nonce": "0x96aec3fcd4d936b0ece72b2b42e16cdd",
  "number": 66,
  "parent_hash": "0x4fb0ef914a5ad1287ed9a0a9cadc50f000a2e9493d31edbc9d9d0d3b5f1b1664",
  "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "1585624040324 (2020-03-31 11:07:20.324 +08:00)",
  "transactions_root": "0x6d79a7b986ab70077dc8761e863e013f8d1b65fcacc6fdcd3612948a102dc87c",
  "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "version": 0
}
```

---

### `get_header_by_number`

通过区块高度获取区块头

> 用法：`ckb-cli rpc get_header_by_number --number <number> --output-format <output-format>`

请求
```
ckb-cli rpc get_header_by_number --number 66 --output-format json
```

响应：
```json
{
  "compact_target": "0x20010000",
  "dao": "0x0c36f03f9e2da12e2936463ef58623005fe678db2f030000000e8e454ffbfe06",
  "epoch": "0x3e80042000000 {number: 0, index: 66, length: 1000}",
  "hash": "0xeca1f56a817746ff7cd27b88e4eca132c47557771fd4f6a182272efaf74f486f",
  "nonce": "0x96aec3fcd4d936b0ece72b2b42e16cdd",
  "number": 66,
  "parent_hash": "0x4fb0ef914a5ad1287ed9a0a9cadc50f000a2e9493d31edbc9d9d0d3b5f1b1664",
  "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "1585624040324 (2020-03-31 11:07:20.324 +08:00)",
  "transactions_root": "0x6d79a7b986ab70077dc8761e863e013f8d1b65fcacc6fdcd3612948a102dc87c",
  "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "version": 0
}
```

---

### `get_live_cell`

获取 live cell

> 用法：`ckb-cli rpc get_live_cell --index <index> --output-format <output-format> --tx-hash <tx-hash>`

---

### `get_tip_block_number`

获取当前最高区块的区块高度

请求：
```
ckb-cli rpc get_tip_block_number
```

响应：
```yaml
32608
```
---

### `get_tip_header`

获取当前最高区块内容

请求：
```
ckb-cli rpc get_tip_header
```

响应：
```yaml
version: 0
compact_target: 0x1d354c1d
timestamp: "1582435950 (2020-02-23 13:32:30)"
number: 32631
epoch: "0x1e6014e00002e number: 46, index: 334, length: 486"
parent_hash: 0xd08c98912f7e0f9d548eafaa0c025523da1df34f7e3c051ecbddb4478b7dbc32
transactions_root: 0x15114b7301fd78cb6dce654db88ec6c19a7d24804dd113f4e802033b339cde59
proposals_hash: 0x0000000000000000000000000000000000000000000000000000000000000000
uncles_hash: 0x0000000000000000000000000000000000000000000000000000000000000000
dao: 0x2106b159e61bcb2e88551445b18e2300b45006cb63a7080000a6982c3c300307
nonce: 0xa6d52aea64bef4f6d43c3df463f24fb9
hash: 0xf6d1088e86c5df0c939a43d330092aea3e6cb46b20c021b0a63bf79b90148f05
```

---