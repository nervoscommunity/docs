---
id: download-client
title: 下载全节点客户端
sidebar_label: 下载全节点客户端
---


### 下载 ckb

下载 ckb 最新的版本 https://github.com/nervosnetwork/ckb/releases ，其中包括了几个主要操作系统的二进制版本，请选择适合自己系统的版本下载。

下载完成后进行解压缩，目录结构如下所示：

```shell
├── CHANGELOG.md
├── COPYING
├── README.md
├── ckb ①
├── ckb-cli ②
├── docs
│   ├── ckb-core-dev.md
│   ├── configure.md
│   ├── get-ckb.md
│   ├── hashes.toml
│   ├── integrity-check.md
│   ├── quick-start.md
│   ├── rpc.md
│   └── run-ckb-with-docker.md
└── init
    ├── README.md
    └── linux-systemd
        ├── README.md
        ├── ckb-miner.service
        └── ckb.service
```

① `ckb` 是主程序，通过命令行操作，我们可以生产配置，运行节点，同步区块信息，并开启挖矿等。

② `ckb-cli` 是官方的附加命令行工具，rpc 请求，生成 ckb 地址，管理钱包，模拟发送交易，并可以向 Nervos Dao 中存币。