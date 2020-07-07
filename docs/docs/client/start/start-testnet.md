---
id: start-testnet
title: 运行 CKB 测试链
sidebar_label: 运行 CKB 测试链
---

## 测试网介绍

CKB 测试网 [Aggron](https://explorer.nervos.org/aggron/) 会不定期重置，请使用[最新版客户端](https://github.com/nervosnetwork/ckb/releases)进行初始化。

您需要先根据[运行 CKB 主网](./start-mainnet)中的相关命令，下载并安装最新版的 CKB 客户端。

## 运行 CKB 测试链

### 生成 testnet 配置文件

命令：

* Mac 用户：

```
./ckb init --chain testnet -C testnet
```

* Linux/Windows 用户：

```
ckb init --chain testnet -C testnet
```

响应：

```shell
# 在当前路径下，生成 testnet 文件
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
