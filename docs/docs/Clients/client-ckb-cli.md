---
id: client-ckb-cli
title: ckb-cli
sidebar_label: ckb-cli
---

ckb-cli 是一个命令行工具，用于调试开发中的 CKB，以方便用户与 CKB 进行交互。ckb-cli 包括以下功能:

- 搜索区块链信息
- 配置环境变量
- 调用 RPC 与 CKB 节点交互
- 处理模拟交易
- 创建钱包和查询余额等。

## 源码

https://github.com/nervosnetwork/ckb-cli

## 下载

下载最新版本的 ckb-cli：https://github.com/nervosnetwork/ckb-cli/releases

## 常用命令

### 显示可用命令

```shell
# Top level help doc
ckb-cli --help
# RPC help doc
ckb-cli rpc --help
```

可用命令：

```
SUBCOMMANDS:
    config     Config environment
    info       Display global variables
    exit       Exit the interactive interface [aliases: quit]
    rpc        Invoke RPC call to node
    account    Manage accounts
    mock-tx    Handle mock transactions (verify/send)
    util       Utilities
    wallet     Transfer / query balance (with local index) / key utils
    dao        Deposit / prepare / withdraw / query NervosDAO balance (with local index) / key utils
    help       Prints this message or the help of the given subcommand(s)
```

### 版本

```shell
./ckb-cli --version
# => ckb-cli 0.27.1 (9d0bf90 2020-01-31)
```

### Tui

运行 ckb 节点后，查看同步状态

```shell
./ckb-cli tui
```

- `Chain`： 运行的 mainnet、testnet、dev
- `Epoch`：调整周期
- `Difficulty`：难度
- `Tip Block`：最高块的高度

![tui](/img/docs/tui.png)

### account 子命令：管理账户

```
list                账户列表
new                 创建一个新帐户并打印相关信息
import              从<privkey-path>导入未加密的私钥并创建一个新帐户
import-keystore     从加密的 keystore json 文件导入密钥，并创建一个新帐户
unlock              解锁账户
update              更新账户密码
export              导出主私钥和链码为十六进制纯文本(由自己承担风险)
bip44-addresses     扩展接收/更改地址(见BIP-44)
extended-address    扩展地址(见BIP-44)
```

#### 生成新地址

```shell

./ckb-cli account new

Your new account is locked with a password. Please give a password. Do not forget this password.
Password: # 输入密码
Repeat password: # 再次输入相同密码

address:
  mainnet: ckb1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqd20pcj
  testnet: ckt1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqs0375w
lock_arg:  0x3c55d6660b44a9c6470ddea5cb47581e0260b184
lock_hash: 0xadba7f9d5dfb04b6424b0f599e6d0fe7ae865ec8b9a14e3b1ef85d0d93017d46
```

#### 查看私钥

```shell

./ckb-cli account export --extended-privkey-path wallet --lock-arg 0x3c55d6660b44a9c6470ddea5cb47581e0260b184 # 导出私钥到wallet 文件

Password:
Success exported account as extended privkey to: "wallet", please use this file carefully

###########

cat wallet # 文本，第1行为私钥
fe59445edc3c30db6b0e1abcddc317137368f5604ce01cc1d279dfda001e8474
0c056c9cf7e08dd3af87860e62812861a85072c9ea53bc950f9804f4ca261d72

```

- `--extended-privkey-path` 后跟导出的文件位置
- `--lock-arg 0x3c55d6...` 导出 lock-arg 对应值的私钥

#### 显示 account 列表

```shell
./ckb-cli account list
./ckb-cli account list --output-format json
```

<details>
<summary>点击查看详细输出</summary>
<br/>

```json
[
  {
    "#":3,
    "address":{
      "mainnet":"ckb1qyqyjxhjklprtfaasnxdd2ppl5kjhftt2q8q7rnt58",
      "testnet":"ckt1qyqyjxhjklprtfaasnxdd2ppl5kjhftt2q8qrxd5cm"
    },
    "lock_arg":"0x491af2b7c235a7bd84ccd6a821fd2d2ba56b500e",
    "lock_hash":"0xf9df89a5936c26d5e003aec5e6869caba814b62f53ee9b6a5c70c2380d65da3f"
  },
  {
    "#":4,
    "address":{
      "mainnet":"ckb1qyqddjtrhl2jhtjv7pzkurtuvp2k3402c7ysvxhev4",
      "testnet":"ckt1qyqddjtrhl2jhtjv7pzkurtuvp2k3402c7ys3rfxqf"
    }
  }
]
```

</details>

### mock-tx 子命令：处理模拟交易（验证/发送）

```
template    打印模拟交易模板
complete    完成模拟交易
verify      验证本地的模拟交易
send        完成并发送一笔交易
```

### rpc 子命令：对节点调用 RPC 命令

```
./ckb-cli rpc get_tip_block_number

# => 32608
```

```
./ckb-cli rpc get_tip_header

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

### 输出的数据格式为 json

```
./ckb-cli rpc get_tip_block --output-format json

{
  "compact_target": "0x1d354c1d",
  "dao": "0x2106b159e61bcb2e88551445b18e2300b45006cb63a7080000a6982c3c300307",
  "epoch": "0x1e6014e00002e number: 46, index: 334, length: 486",
  "hash": "0xf6d1088e86c5df0c939a43d330092aea3e6cb46b20c021b0a63bf79b90148f05",
  "nonce": "0xa6d52aea64bef4f6d43c3df463f24fb9",
  "number": 32631,
  "parent_hash": "0xd08c98912f7e0f9d548eafaa0c025523da1df34f7e3c051ecbddb4478b7dbc32",
  "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "1582435950 (2020-02-23 13:32:30)",
  "transactions_root": "0x15114b7301fd78cb6dce654db88ec6c19a7d24804dd113f4e802033b339cde59",
  "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "version": 0
}
```

### ckb-cli 支持的 rpc 命令

```
get_block                               通过 hash 获取 block 信息
get_block_by_number                     通过高度获取 block 信息
get_block_hash                          通过高度获取 block hash
get_cellbase_output_capacity_details    通过 hash 获取区块头内容
get_cells_by_lock_hash                  通过获取 cell
get_current_epoch                       获取当前 epoch 信息
get_epoch_by_number                     通过 epoch 数获取 epoch 信息
get_header                              通过 hash 获取区块头
get_header_by_number                    通过高度获取区块头
get_live_cell                           获取 live cell (live 意味这是未花费的)
get_tip_block_number                    获取最高块高度
get_tip_header                          获取最高块内容
get_transaction                         通过交易 hash 获取交易内容
deindex_lock_hash                       通过 hash 删除 live cell 和交易的索引
get_live_cells_by_lock_hash             通过 hash 获取 live cell 的集合
get_transactions_by_lock_hash           通过 hash 获取交易，当 lock_hash 没有被索引时返回空数组
index_lock_hash                         通过 hash 为 live cell 和交易创建索引
get_banned_addresses                    获取所有被禁止的 IP/子网掩码
get_peers                               获取链接的节点
local_node_info                         获取本地节点信息
set_ban                                 从禁止列表中插入或删除一个 IP/子网掩码
tx_pool_info                            获取交易池信息
get_blockchain_info                     获取链信息
add_node                                手动连接到节点
remove_node                             手动断开节点
broadcast_transaction                   广播未签名的交易
```

---

参考：https://docs.nervos.org/dev-guide/ckb-cli.html

更多命令使用：https://github.com/nervosnetwork/ckb-cli/wiki/Sub-Commands
