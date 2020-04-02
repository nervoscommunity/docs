---
id: start-testnet
title: 运行 CKB 测试链
sidebar_label: 运行 CKB 测试链
---

### 下载 `aggron.toml` 文件

ckb 的 测试网 [Aggron](https://explorer.nervos.org/aggron/) 每个月重置一次，请使用最新配置文件

https://gist.githubusercontent.com/doitian/573513c345165c0fe4f3504ebc1c8f9f/raw/dc955b0696333cf725b070b18d6350d64ba55e01/aggron.toml

<details>
<summary>点击查看文件内容</summary>
<br/>

```toml
name = "ckb_testnet"

[genesis]
version = 0
parent_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
timestamp = 1584599526000
compact_target = 0x1e015555
uncles_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
nonce = "0x0"
# run `cargo run list-hashes -b` to get the genesis hash
hash = "0x63547ecf6fc22d1325980c524b268b4a044d49cda3efbd584c0a8c8b9faaf9e1"

[genesis.genesis_cell]
message = "aggron-v3"

[genesis.genesis_cell.lock]
code_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
args = "0x"
hash_type = "data"

# An array list paths to system cell files, which is absolute or relative to
# the directory containing this config file.
[[genesis.system_cells]]
file = { bundled = "specs/cells/secp256k1_blake160_sighash_all" }
create_type_id = true
capacity = 100_000_0000_0000
[[genesis.system_cells]]
file = { bundled = "specs/cells/dao" }
create_type_id = true
capacity = 16_000_0000_0000
[[genesis.system_cells]]
file = { bundled = "specs/cells/secp256k1_data" }
create_type_id = false
capacity = 1_048_617_0000_0000
[[genesis.system_cells]]
file = { bundled = "specs/cells/secp256k1_blake160_multisig_all" }
create_type_id = true
capacity = 100_000_0000_0000

[genesis.system_cells_lock]
code_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
args = "0x"
hash_type = "data"

# Dep group cells
[[genesis.dep_groups]]
name = "secp256k1_blake160_sighash_all"
files = [
  { bundled = "specs/cells/secp256k1_data" },
  { bundled = "specs/cells/secp256k1_blake160_sighash_all" },
]
[[genesis.dep_groups]]
name = "secp256k1_blake160_multisig_all"
files = [
  { bundled = "specs/cells/secp256k1_data" },
  { bundled = "specs/cells/secp256k1_blake160_multisig_all" },
]

# For first 11 block
[genesis.bootstrap_lock]
code_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
args = "0x"
hash_type = "type"

# Burn
[[genesis.issued_cells]]
capacity = 8_400_000_000_00000000
lock.code_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
lock.args = "0x62e907b15cbf27d5425399ebf6f0fb50ebb88f18"
lock.hash_type = "data"

# Locks for developers to run tests
[[genesis.issued_cells]]
capacity = 8_399_578_345_00000000
lock.code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
lock.args = "0x64257f00b6b63e987609fa9be2d0c86d351020fb"
lock.hash_type = "type"
[[genesis.issued_cells]]
capacity = 8_399_578_345_00000000
lock.code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
lock.args = "0x3f1573b44218d4c12a91919a58a863be415a2bc3"
lock.hash_type = "type"
[[genesis.issued_cells]]
capacity = 8_399_578_347_00000000
lock.code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
lock.args = "0x57ccb07be6875f61d93636b0ee11b675494627d2"
lock.hash_type = "type"

[pow]
func = "Eaglesong"
```

</details>

### 生成 testnet 配置文件

`./ckb init --import-spec ./aggron.toml --chain testnet -C testnet`

```shell
testnet/
├── ckb-miner.toml
├── ckb.toml
└── specs
    └── testnet.toml
```

### 运行

`./ckb run -C testnet`

### 测试

```shell

curl http://127.0.0.1:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_block_number","params":[]} '

# => {"jsonrpc":"2.0","result":"0x771","id":1}
```

## 在公网可访问

### 修改 `ckb.toml`文件

将`listen_address = "127.0.0.1:8114"` 改为 `listen_address = "0.0.0.0:8114"`

在重启 ckb 网络即可

### 测试

```shell

curl http://<公网ip>:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_block_number","params":[]} '

# => {"jsonrpc":"2.0","result":"0x7dac","id":1}
```

---

### 参考

https://gist.github.com/doitian/573513c345165c0fe4f3504ebc1c8f9f

https://docs.nervos.org/dev-guide/testnet.html