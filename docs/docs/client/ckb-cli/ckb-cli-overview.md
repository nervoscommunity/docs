---
id: ckb-cli-overview
title: ckb-cli 命令行
sidebar_label: ckb-cli 概述
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

### 版本

```shell
./ckb-cli --version
=> ckb-cli 0.30.0 (2a7ed95 2020-03-20)
```

### 可用命令

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

![tui](/img/docs/tui.png)

---

参考：https://docs.nervos.org/dev-guide/ckb-cli.html

命令使用：https://github.com/nervosnetwork/ckb-cli/wiki/Sub-Commands