---
id: ckb-cli-overview
title: ckb-cli 命令行
sidebar_label: ckb-cli 概述
---

[ckb-cli](https://github.com/nervosnetwork/ckb-cli) 是一个命令行工具，用于调试开发中的 CKB，以方便用户与 CKB 进行交互。ckb-cli 提供以下功能:

- 搜索区块链信息
- 配置环境变量
- 调用 RPC 与 CKB 节点交互
- 处理模拟交易
- 创建钱包和查询余额等。

## 下载

ckb 客户端内含有 ckb-cli，你可以直接通过下载 [ckb 客户端](https://github.com/nervosnetwork/ckb/releases)获取最新版的 ckb-cli，当然你也可以直接前往 [ckb-cli 代码库](https://github.com/nervosnetwork/ckb-cli/releases)获取最新版本的 ckb-cli。

## 常用命令

### 检查版本

```shell
ckb-cli --version

=> ckb-cli 0.30.0 (2a7ed95 2020-03-20)
```

### 可用命令

请求：
```shell
# Top level help doc
ckb-cli --help
# RPC help doc
ckb-cli rpc --help
```

响应：
```shell
USAGE:
    ckb-cli [FLAGS] [OPTIONS] [SUBCOMMAND]

FLAGS:
                           # 输出 jason 取消高亮
        --no-color         Do not highlight(color) output json
                           # 显示请求参数
        --debug            Display request parameters
                           # 确保索引库在执行命令前完成同步
        --wait-for-sync    Ensure the index-store synchronizes completely before command being executed
                           # 打印帮助信息
    -h, --help             Prints help information
                           # 打印版本信息
    -V, --version          Prints version information

OPTIONS:
                                            # RPC API 服务 url
        --url <url>                        RPC API server url
                                            # 选择输出格式，默认 yaml，可选项：yaml，json
        --output-format <output-format>    Select output format [default: yaml]  [possible values: yaml, json]

SUBCOMMANDS:
                # 对节点调用 RPC 命令
    rpc         Invoke RPC call to node
                # 账户管理
    account     Manage accounts
                # 处理模拟交易（验证/发送）
    mock-tx     Handle mock transactions (verify/send)
                # 处理常见的签名/多签交易
    tx          Handle common sighash/multisig transaction
                # 启动 API 服务
    server      Start advanced API server
                # 常用工具
    util        Utilities
                # molecule 编码/解码工具
    molecule    Molecule encode/decode utilities
                # 交易 / 查询余额（通过本地索引）/ key utils
    wallet      Transfer / query balance (with local index) / key utils
                # 存入 / 准备 / 取出 / 查询 Nervos DAO 余额（通过本地索引）/ key utils
    dao         Deposit / prepare / withdraw / query NervosDAO balance (with local index) / key utils
                # 进入 TUI 模式
    tui         Enter TUI mode
                # help
    help        Prints this message or the help of the given subcommand(s)
```

### 设定 RPC URL

rpc url 默认为 `127.0.0.1:8114`，可以修改为：

`export API_URL=http://<公共ip>:8114`

或改为默认
`export API_URL=http://127.0.0.1:8114`

在执行一些命令时，会从设定的 rpc url 中获得数据。

### TUI

在运行 ckb 节点后，查看同步状态

```shell
# 需在链启动后使用
ckb-cli tui
```

- `Chain`： 运行的 mainnet、testnet、dev
- `Epoch`：周期
- `Difficulty`：难度
- `Tip Block`：当前最高区块

![](/img/docs/tui.png)

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

命令使用：https://github.com/nervosnetwork/ckb-cli/wiki/Sub-Commands