---
id: start-mainnet
title: 运行 CKB 主网
sidebar_label: 运行 CKB 主网
---
*有趣的事实：运行CKB Mainnet节点不仅有助于提高网络的健壮性和分散性，还意味着您无需依赖任何第三方来从区块链提供数据，从而提高了安全性。*

运行节点需要使用命令行工具。如果您以前从未使用过命令行，则可以参考下一章节如何使用命令行工具。尽管乍一看似乎很复杂，但它非常简单，您应该能够按照以下特定说明轻松运行CKB节点。

**Open up Terminal (Mac) or command line (Windows).**

* On Mac:

    * 要么 1）打开你的 "应用程序 "文件夹，然后打开 "实用程序"，双击 "终端"；要么2）按 `Command - Spacebar` or `Control -Spacebar` 启动Spotlight，输入 `Terminal`，然后双击搜索结果，在终端上执行以下步骤。

* On Windows:

    * 请注意：如果你熟悉Windows上的命令行操作，你可以跳过这一步，打开`cmd`或`Power Shell`终端。
    * 下载Git for windows [Git-Downloads](https://git-scm.com/downloads), 双击安装，在开始菜单中打开Git Bash。下面的步骤将在Git Bash中进行。

**复制并粘贴以下命令到终端(Mac)/命令行(Windows):**

* 请注意：电脑上的目录和文件夹名称必须与下面的命令相匹配，如果不匹配，请修改相应的命令脚本。

* Mac

```
cd /Users/(NAME)/Documents/ckb_v0.25.2_x86_64-apple-darwin
./ckb --version
./ckb-cli --version
```

* Windows

```
cd C:/ckb_v0.25.2_x86_64-pc-windows-msvc 
ckb --version 
ckb-cli --version
```

<details>
<summary>(click here to view response)</summary>

```bash
$ ./ckb --version
$ ./ckb-cli --version

ckb 0.25.2 (dda4ed9 2019-11-17)
ckb-cli 0.25.2 (6ca7bbb 2019-11-17)
```
</details>

要运行CKB节点，请复制并粘贴以下命令到终端(Mac)/命令行(Windows)中:

* 初始化节点(只运行一次)

```
./ckb init --chain mainnet
```

<details>
<summary>(click here to view response)</summary>

```bash
$ ./ckb init --chain mainnet

WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /`PATH`/ckb_v0.25.2_x86_64-apple-darwin
create ckb.toml
create ckb-miner.toml
```
</details>

* Start the node.

```
./ckb run
```

<details>
<summary>(click here to view response)</summary>

```bash
$ ./ckb run

**2019-11-28 14:22:25.464 +08:00** **main** INFO sentry sentry is disabled
**2019-11-28 14:22:25.565 +08:00** **main** INFO main Miner is disabled, edit ckb.toml to enable it
**2019-11-28 14:22:25.635 +08:00** **main** INFO ckb-chain Start: loading live cells ...
**2019-11-28 14:22:25.636 +08:00** **main** INFO ckb-chain Done: total 2 transactions.
**2019-11-28 14:22:25.654 +08:00** **main** INFO main chain genesis hash: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
**2019-11-28 14:22:25.670 +08:00** **main** INFO ckb-network Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmbjjSgGQpvn3Fo28kvVWy9yZfgvtk9cNwRHEv646xxWYB
**2019-11-28 14:22:25.674 +08:00** **NetworkRuntime-0** INFO ckb-network p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
**2019-11-28 14:22:25.845 +08:00** **NetworkRuntime-3** INFO ckb-sync SyncProtocol.connected peer=SessionId(1)
**2019-11-28 14:22:25.846 +08:00** **NetworkRuntime-6** INFO ckb-relay RelayProtocol(1).connected peer=SessionId(1)
**2019-11-28 14:22:26.063 +08:00** **NetworkRuntime-4** INFO ckb-sync Ignoring getheaders from peer=SessionId(1) because node is in initial block download
**2019-11-28 14:22:26.197 +08:00** **ChainService** INFO ckb-chain block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs: 1
```
</details>
