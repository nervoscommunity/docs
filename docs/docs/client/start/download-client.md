---
id: download-client
title: 下载客户端
sidebar_label: 下载客户端
---

## 下载 CKB 客户端

你可以直接前往 [Github](https://github.com/nervosnetwork/ckb/releases/latest)，下载最新版的 CKB 全节点客户端，下载页面包括了几个主要操作系统的不同版本，请选择适合自己系统的版本下载，并请注意所需的依赖环境。

|OS	|Arch	|运行依赖|
|---|---|---|
|macOS	|x64	|macOS 10.12 or above|
|Linux	|x64	|glibc, libstdc++|
|CentOS	|x64	|glibc, libstdc++, openssl|
|Windows*|x64	|VC++ Redistributable|
|Docker|||

## 目录结构

下载完成后进行解压缩操作，目录结构如下所示：

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