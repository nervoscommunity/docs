---
id: start-testnet
title: 运行 CKB 测试链
sidebar_label: 运行 CKB 测试链
---

## 测试网介绍

CKB 测试网 [Aggron](https://explorer.nervos.org/aggron/) 会不定期重置，请使用[最新配置文件](https://gist.githubusercontent.com/doitian/573513c345165c0fe4f3504ebc1c8f9f/raw/dc955b0696333cf725b070b18d6350d64ba55e01/aggron.toml)并配合使用最新版客户端进行初始化。

## 运行 CKB 测试链

### 准备工作

在初始化测试网前，请您将配置文件 [aggron.toml](https://gist.githubusercontent.com/doitian/573513c345165c0fe4f3504ebc1c8f9f/raw/dc955b0696333cf725b070b18d6350d64ba55e01/aggron.toml) 置于 CKB 客户端目录下。

<details>
<summary>点击查看配置文件</summary>
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

命令：

* Mac 用户：

```
./ckb init --import-spec ./aggron.toml --chain testnet -C testnet
```

* Linux/Windows 用户：

```
ckb init --import-spec ./aggron.toml --chain testnet -C testnet
```

响应：

```shell
testnet/
├── ckb-miner.toml
├── ckb.toml
└── specs
    └── testnet.toml
```

### 运行测试链

命令：

* Mac 用户：

```
./ckb run -C testnet
```

* Linux/Windows 用户：

```
ckb run -C testnet
```

<details>
<summary>点击查看详细输出</summary>
<br/>

```shell
2020-04-08 11:38:54.945 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
2020-04-08 11:38:54.959 +08:00 main INFO ckb-db  Initialize a new database
2020-04-08 11:38:55.210 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-04-08 11:38:55.216 +08:00 main INFO ckb-chain  Start: loading live cells ...
2020-04-08 11:38:55.216 +08:00 main INFO ckb-chain  Done: total 2 transactions.
2020-04-08 11:38:55.220 +08:00 main INFO main  ckb version: 0.30.2 (4382236 2020-04-02)
2020-04-08 11:38:55.220 +08:00 main INFO main  chain genesis hash: 0x63547ecf6fc22d1325980c524b268b4a044d49cda3efbd584c0a8c8b9faaf9e1
2020-04-08 11:38:55.221 +08:00 main INFO ckb-network  Generate random key
2020-04-08 11:38:55.221 +08:00 main INFO ckb-network  write random secret key to "testnet\\data\\network\\secret_key"
2020-04-08 11:38:55.234 +08:00 main INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmbcHjRr5Pdv1ya3qNYiAc96uKa6kAvZVcv212qsdGiB7m
2020-04-08 11:38:55.235 +08:00 main WARN jsonrpc_http_server  Multi-threaded server is not available on Windows. Falling back to single thread.
2020-04-08 11:38:55.243 +08:00 NetworkRuntime-0 INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-04-08 11:38:55.461 +08:00 NetworkRuntime-4 INFO ckb-relay  RelayProtocol(1).connected peer=SessionId(1)
2020-04-08 11:38:55.461 +08:00 NetworkRuntime-5 INFO ckb-sync  SyncProtocol.connected peer=SessionId(1)
2020-04-08 11:38:55.477 +08:00 NetworkRuntime-2 INFO ckb-sync  Ignoring getheaders from peer=SessionId(1) because node is in initial block download
2020-04-08 11:38:56.657 +08:00 NetworkRuntime-5 INFO ckb-relay  RelayProtocol(1).connected peer=SessionId(2)
2020-04-08 11:38:56.662 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x016da1edf2776ba642be5417f30fbabde296227025cf643bcc65cd55e378178e, epoch: 0(1/1000), total_diff: 0x1800060, txs: 1
2020-04-08 11:38:56.663 +08:00 ChainService INFO ckb-chain  block: 2, hash: 0x3106bda1ae33366e0dddd9b369cb5a8b9dbf3a9dca655fc1b131a02c37b25076, epoch: 0(2/1000), total_diff: 0x2400090, txs: 1
```

</details>

## 访问 CKB 测试链

### 本地访问

```shell
curl http://127.0.0.1:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_block_number","params":[]} '

# => {"jsonrpc":"2.0","result":"0x771","id":1}
```

### 公网访问

#### 修改 `ckb.toml` 文件

将 `ckb.toml` 文件中的 `listen_address = "127.0.0.1:8114"` 改为 `listen_address = "0.0.0.0:8114"`

再重启 ckb 网络即可


#### 公网访问

```shell

curl http://<公网ip>:8114 -H 'content-type: application/json' -d  ' {"id":1,"jsonrpc":"2.0","method":"get_tip_block_number","params":[]} '

# => {"jsonrpc":"2.0","result":"0x7dac","id":1}
```

---

## 参考资料

https://gist.github.com/doitian/573513c345165c0fe4f3504ebc1c8f9f

https://docs.nervos.org/dev-guide/testnet.html