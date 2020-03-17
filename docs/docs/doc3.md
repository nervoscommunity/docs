---
id: doc3
title: rpc
sidebar_label: rpc
---

### get_tip_block_number

```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_block_number","params":[]} '
```

```json
{
    "jsonrpc":"2.0",
    "result":"0xb26f",
    "id":1
}
```

### get_tip_header


```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_header","params":[]} '
```

```json
{
    "jsonrpc":"2.0",
    "result":{
        "compact_target":"0x1a269ee6",
        "dao":"0xf3e2341832e5c12e5891b7a7fe8c2300a23cb82a47c1060000a23c5c22050007",
        "epoch":"0x531024e000024",
        "hash":"0x9037a8fefafe2a50e62564076e02f72db05e0c5ddfff0d5d25cee5b77caa8ac6",
        "nonce":"0x7b2942c03f3d96bc0000000845010100",
        "number":"0xde80",
        "parent_hash":"0x3ae3fb2a6422317739dd96eece52f8a70017845a03fb38f13f05cb7fed373b49",
        "proposals_hash":"0x033a5fcc72ff8030ce52063053fb02b2c869612c4f35a039d2037978d786a387",
        "timestamp":"0x16e9e451059",
        "transactions_root":"0x5fcb660fd553e30e753179e6d18807bbe3b17652eabea8899a8c313ef9e07512",
        "uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000",
        "version":"0x0"
    },
    "id":1
}
```

### get_current_epoch

```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_current_epoch","params":[]} '
```

```json
{
    "jsonrpc":"2.0",
    "result":{
        "compact_target":"0x1a244678",
        "length":"0x4f9",
        "number":"0x27",
        "start_number":"0xee1c"
    },
    "id":1
}
```

### get_live_cell

```shell
```

```json

```

### get_cellbase_output_capacity_details


## Indexer

### index_lock_hash

### get_lock_hash_index_states

### get_live_cells_by_lock_hash

### get_transactions_by_lock_hash

### deindex_lock_hash

## Miner

### get_block_template

### submit_block

## Net

### local_node_info

### get_peers

### get_banned_addresses

### set_ban

## Pool

### send_transaction

### tx_pool_info

```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"tx_pool_info","params":[]} '

```

```json
{
    "jsonrpc":"2.0",
    "result":{
        "last_txs_updated_at":"0x0",
        "orphan":"0x0",
        "pending":"0x0",
        "proposed":"0x0",
        "total_tx_cycles":"0x0",
        "total_tx_size":"0x0"
    },
    "id":1
}
```

## Stats

### get_blockchain_info

```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_blockchain_info","params":[]} '
```

```json
{
    "jsonrpc":"2.0",
    "result":{
        "alerts":[],
        "chain":"ckb",
        "difficulty":"0x5acc615bb4e55",
        "epoch":"0x5cf015f000036",
        "is_initial_block_download":true,
        "median_time":"0x16ead9bec99"
    },
    "id":1
}
```

### get_peers_state

```shell
curl http://localhost:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_peers_state","params":[]} '

```

```json
{
    "jsonrpc":"2.0",
    "result":[
        {
            "blocks_in_flight":"0x7",
            "last_updated":"0x0",
            "peer":"0x1"
        }
    ],
    "id":1
}
```


---

参考：

https://docs.nervos.org/api/rpc.html