---
id: start-mainnet
title: 运行 CKB 主网
sidebar_label: 运行 CKB 主网
---
*有趣的事实：运行CKB Mainnet节点不仅有助于提高网络的健壮性和分散性，还意味着您无需依赖任何第三方来从区块链提供数据，从而提高了安全性。*

运行节点需要使用命令行工具。如果您以前从未使用过命令行，则可以参考下一章节如何使用命令行工具。尽管乍一看似乎很复杂，但它非常简单，您应该能够按照以下特定说明轻松运行CKB节点。

## Mac 用户

### 准备工作

#### 打开终端/命令行

* 要么 1）打开你的 "应用程序" 文件夹，然后打开 "实用程序"，双击 "终端"
* 要么 2）按 `Command - Spacebar` or `Control -Spacebar` 启动 Spotlight，输入 `Terminal`，然后双击搜索结果，在终端上执行以下步骤。

#### 下载客户端 (里面已包含 ckb 主程序以及 ckb-cli 客户端）

```bash
# 下载 CKB 客户端
curl -O https://github.com/nervosnetwork/ckb/releases/download/v0.33.0/ckb_v0.33.0_x86_64-apple-darwin.zip

# 解压文件
unzip ckb_v0.33.0_x86_64-apple-darwin.zip

```

### 检查版本

请注意：
* 注意您的文件路径，前往到文件所在目录后，进行相关操作。
* 本文中使用的是 ckb v0.33.0，若您下载到更新版本的 ckb 客户端，请更换对应的文件名，不影响其他操作。

```bash
# 进入文件
cd ckb_v0.33.0_x86_64-apple-darwin

# 检查 ckb 版本
./ckb --version

# 检查 ckb-cli 版本
./ckb-cli --version
```

<details>
<summary>点击查看详细输出</summary>

```bash
cd ckb_v0.33.0_x86_64-apple-darwin

$ ./ckb --version
ckb 0.33.0 (0a813b2 2020-06-19)

$ ./ckb-cli --version
ckb-cli 0.33.1 (488a2eb 2020-06-19)
```
</details>


### 初始化并运行

#### 初始化主网节点（只需在第一次使用时，运行一次）

```bash
./ckb init --chain mainnet
```

<details>
<summary>点击查看详细输出</summary>

```bash
$ ./ckb init --chain mainnet

WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /Users/(NAME)/Documents/ckb_v0.33.0_x86_64-apple-darwin # 路径不同，此处略有差异
create ckb.toml
create ckb-miner.toml
```
</details>

#### 运行 CKB 主网节点

```
./ckb run
```

<details>
<summary>点击查看详细输出</summary>

```bash
$ ./ckb run

**2020-04-08 10:57:32.288 +08:00 main INFO sentry  sentry is disabled
**2020-04-08 10:57:32.401 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
**2020-04-08 10:57:32.418 +08:00 main INFO ckb-db  Initialize a new database
**2020-04-08 10:57:32.661 +08:00 main INFO ckb-db  Init database version 20191127135521
**2020-04-08 10:57:32.668 +08:00 main INFO ckb-chain  Start: loading live cells ...
**2020-04-08 10:57:32.669 +08:00 main INFO ckb-chain  Done: total 2 transactions.
**2020-04-08 10:57:32.675 +08:00 main INFO main  ckb version: 0.30.2 (4382236 2020-04-02)
**2020-04-08 10:57:32.675 +08:00 main INFO main  chain genesis hash: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
...
...
**2020-04-08 10:57:33.963 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs: 1
**2020-04-08 10:57:33.965 +08:00 ChainService INFO ckb-chain  block: 2, hash: 0x2af0fc6ec802df6d1da3db2bfdd59159d210645092a3df82125d20b523e0ea83, epoch: 0(2/1743), total_diff: 0x58a98dbf21d31f, txs: 1
```
</details>

---

## Linux 用户

### 准备工作

#### 打开终端/命令行

直接打开终端，这里使用的是 Ubuntu 18.04

#### 下载客户端

```shell
# 下载 CKB 客户端
wget https://github.com/nervosnetwork/ckb/releases/download/v0.33.0/ckb_v0.33.0_x86_64-unknown-linux-gnu.tar.gz

# 解压文件
tar -zxvf ckb_v0.33.0_x86_64-unknown-linux-gnu.tar.gz
```

### 检查版本

请注意：
* 注意您的文件路径，前往到文件所在目录后，进行相关操作。
* 本文中使用的是 ckb v0.33.0，若您下载到更新版本的 ckb 客户端，请更换对应的文件名，不影响其他操作。

```shell
# 进入文件
cd ckb_v0.33.0_x86_64-unknown-linux-gnu

# 将 ckb 指令添加到全局
sudo ln -snf "$(pwd)/ckb" /usr/local/bin/ckb

# 将 ckb-cli 指令添加到全局
sudo ln -snf "$(pwd)/ckb" /usr/local/bin/ckb-cli

# 检查 ckb 版本
ckb --version

# 检查 ckb-cli 版本
ckb-cli --version
```

<details>
<summary>点击查看详细输出</summary>

```shell
cd ckb_v0.33.0_x86_64-unknown-linux-gnu

ckb --version
ckb 0.33.0 (0a813b2 2020-06-19)

ckb-cli --version
ckb-cli 0.33.1 (488a2eb 2020-06-19)
```

</details>

### 初始化并运行

#### 初始化主网节点（只需在第一次使用时，运行一次）

```shell
ckb init --chain mainnet
```

<details>
<summary>点击查看详细输出</summary>

```shell
ckb init --chain mainnet

WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /home/username/ckb_v0.30.0_x86_64-unknown-linux-gnu # 路径不同，此处略有差异
create ckb.toml
create ckb-miner.toml
```
</details>

#### 运行 CKB 主网节点

```
ckb run
```

<details>
<summary>点击查看详细输出</summary>

```shell
ckb run

2020-04-08 10:57:32.288 +08:00 main INFO sentry  sentry is disabled
2020-04-08 10:57:32.401 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
2020-04-08 10:57:32.418 +08:00 main INFO ckb-db  Initialize a new database
2020-04-08 10:57:32.661 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-04-08 10:57:32.668 +08:00 main INFO ckb-chain  Start: loading live cells ...
2020-04-08 10:57:32.669 +08:00 main INFO ckb-chain  Done: total 2 transactions.
2020-04-08 10:57:32.675 +08:00 main INFO main  ckb version: 0.30.2 (4382236 2020-04-02)
2020-04-08 10:57:32.675 +08:00 main INFO main  chain genesis hash: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
...
...
2020-04-08 10:57:33.963 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs: 1
2020-04-08 10:57:33.965 +08:00 ChainService INFO ckb-chain  block: 2, hash: 0x2af0fc6ec802df6d1da3db2bfdd59159d210645092a3df82125d20b523e0ea83, epoch: 0(2/1743), total_diff: 0x58a98dbf21d31f, txs: 1
```
</details>

---

## Windows 用户

### 准备工作

#### 下载客户端

建议直接前往 Github 下载 [CKB 客户端](https://github.com/nervosnetwork/ckb/releases/latest)，并完成解压缩。

#### 打开终端/命令行

* 请注意：如果你熟悉 Windows 上的命令行操作，你可以跳过这一步，打开 `cmd` 或 `Power Shell` 终端。
* 下载 [Git for windows](https://git-scm.com/downloads)，双击安装，在开始菜单中打开 Git Bash。下面的步骤将在 Git Bash 中进行。

### 检查版本

请注意：
* 注意您的文件路径，前往到文件所在目录后，进行相关操作。
* 本文中使用的是 ckb v0.33.0，若您下载到更新版本的 ckb 客户端，请更换对应的文件名，不影响其他操作。

```shell
# 进入文件
cd ckb_v0.33.0_x86_64-pc-windows-msvc

# 检查 ckb 版本
ckb --version

# 检查 ckb-cli 版本
ckb-cli --version
```

<details>
<summary>点击查看详细输出</summary>

```shell
cd ckb_v0.33.0_x86_64-pc-windows-msvc

ckb --version
ckb 0.33.0 (0a813b2 2020-06-19)

ckb-cli --version
ckb-cli 0.33.1 (488a2eb 2020-06-19)
```

</details>


### 初始化并运行

#### 初始化主网节点（只需在第一次使用时，运行一次）

```shell
ckb init --chain mainnet
```

<details>
<summary>点击查看详细输出</summary>

```shell
ckb init --chain mainnet

WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in D:\ckb\ckb_v0.33.0_x86_64-pc-windows-msvc # 路径不同，此处略有差异
create ckb.toml
create ckb-miner.toml
```
</details>

#### 运行 CKB 主网节点

```
ckb run
```

<details>
<summary>点击查看详细输出</summary>

```shell
ckb run

2020-04-08 10:57:32.288 +08:00 main INFO sentry  sentry is disabled
2020-04-08 10:57:32.401 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
2020-04-08 10:57:32.418 +08:00 main INFO ckb-db  Initialize a new database
2020-04-08 10:57:32.661 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-04-08 10:57:32.668 +08:00 main INFO ckb-chain  Start: loading live cells ...
2020-04-08 10:57:32.669 +08:00 main INFO ckb-chain  Done: total 2 transactions.
2020-04-08 10:57:32.675 +08:00 main INFO main  ckb version: 0.30.2 (4382236 2020-04-02)
2020-04-08 10:57:32.675 +08:00 main INFO main  chain genesis hash: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
...
...
2020-04-08 10:57:33.963 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs: 1
2020-04-08 10:57:33.965 +08:00 ChainService INFO ckb-chain  block: 2, hash: 0x2af0fc6ec802df6d1da3db2bfdd59159d210645092a3df82125d20b523e0ea83, epoch: 0(2/1743), total_diff: 0x58a98dbf21d31f, txs: 1
```
</details>
