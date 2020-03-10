---
id: doc0
title: 如何启动 CKB 的本地开发链
sidebar_label: 如何启动 CKB 的本地开发链
---


## 介绍

CKB 有3种运行环境：
 - Mainnet 主网，就是 ckb 正在运行的主网络，https://explorer.nervos.org/。

 - testnet 测试网，用于公开测试，需要从水龙头获取测试币才能部署脚本，https://explorer.nervos.org/aggron/ 。

 - dev 是本地的开发网络，用于本地测试，不需要对外公开，在本地开启挖矿程序，就可以获得测试币 。

## 前期准备工作

### 下载 ckb

下载目前 ckb 最新的版本 https://github.com/nervosnetwork/ckb/releases/tag/v0.29.0 ，包括了几个主要操作系统的二进制版本，选择适合自己系统的版本下载，这里以macOS版本为进行说明。

下载完成后进行解压缩，目录结构如下所示：

```shell
├── CHANGELOG.md
├── COPYING
├── README.md
├── ckb ①
├── ckb-cli ②
├── docs
│   ├── ckb-core-dev.md
│   ├── configure.md
│   ├── get-ckb.md
│   ├── hashes.toml
│   ├── integrity-check.md
│   ├── quick-start.md
│   ├── rpc.md
│   └── run-ckb-with-docker.md
└── init
    ├── README.md
    └── linux-systemd
        ├── README.md
        ├── ckb-miner.service
        └── ckb.service
```

① `ckb` 是主程序，通过命令行操作，我们可以生产配置，运行节点，同步区块信息，并开启挖矿等。

② `ckb-cli` 是官方的附加命令行工具，rpc 请求，生成 ckb 地址，管理钱包，模拟发送交易，并可以向 Nervos Dao 中存币。

### 安装 ckb ruby sdk

Nervos 为开发者提供了很多语言版本的 SDK：

* [ruby-sdk](https://github.com/nervosnetwork/ckb-sdk-ruby)
* [js-sdk](https://github.com/nervosnetwork/ckb-sdk-js)
* [java-sdk](https://github.com/nervosnetwork/ckb-sdk-java)

在官方教程中，ruby 出现了很多次，而且功能最为完备，我们就已 ruby sdk 作为示范。
请先下载 ruby，以下命令并不完整，具体如何下载，请看 https://ruby-china.org/wiki/rbenv-guide 。

```shell
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

# 使用 Ruby China 的镜像安装 Ruby, 国内用户推荐
git clone git://github.com/AndorChen/rbenv-china-mirror.git ~/.rbenv/plugins/rbenv-china-mirror

rbenv install --list  # 列出所有 ruby 版本
rbenv install 2.5.5 # 安装 2.5.5
ruby -v # 查看ruby版本
gem -v # 查看 gem版本

gem i bundler -V # 安装 bundler
```

运行 ruby-sdk

```shell
git clone https://github.com/nervosnetwork/ckb-sdk-ruby

cd ckb-sdk-ruby

./bin/setup # 安装插件
./bin/console # 进入 ruby REPL环境
```

## 开始


### 得到地址

```shell

./ckb-cli --version
# => ckb-cli 0.27.1 (9d0bf90 2020-01-31)


./ckb-cli account new # 新地址

Your new account is locked with a password. Please give a password. Do not forget this password.
Password: # 输入密码
Repeat password: # 再次输入相同密码

address:
  mainnet: ckb1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqd20pcj
  testnet: ckt1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqs0375w
lock_arg:  0x3c55d6660b44a9c6470ddea5cb47581e0260b184
lock_hash: 0xadba7f9d5dfb04b6424b0f599e6d0fe7ae865ec8b9a14e3b1ef85d0d93017d46

```

### 查看私钥

```shell

./ckb-cli account export --extended-privkey-path wallet --lock-arg 0x3c55d6660b44a9c6470ddea5cb47581e0260b184 # 导出私钥到wallet 文件

Password:
Success exported account as extended privkey to: "wallet", please use this file carefully

###########

cat wallet # 文本，第1行为私钥
fe59445edc3c30db6b0e1abcddc317137368f5604ce01cc1d279dfda001e8474
0c056c9cf7e08dd3af87860e62812861a85072c9ea53bc950f9804f4ca261d72

```

### 生成 dev 链配置文件

`./ckb init --chain dev -C dev`

```shell
├── ckb-miner.toml
├── ckb.toml
└── specs
    └── dev.toml

```

修改 `dev/ckb.toml`

```toml
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
args = "0x3c55d6660b44a9c6470ddea5cb47581e0260b184" # 只需要此处修改 ckb-cli 生成的 lock_arg
hash_type = "type"
message = "0x"
```

### 运行 ckb

```
./ckb run -C dev

2020-02-22 19:55:37.333 main INFO sentry  sentry is disabled
2020-02-22 19:55:37.434 main INFO ckb-chain  Start: loading live cells ...
2020-02-22 19:55:37.439 main INFO ckb-chain  Done: total 1346 transactions.
2020-02-22 19:55:37.443 main INFO main  ckb version: 0.29.0 (a6733e6 2020-02-26)
2020-02-22 19:55:37.443 main INFO main  chain genesis hash: 0x823b2ff5785b12da8b1363cac9a5cbe566d8b715a4311441b119c39a0367488c
2020-02-22 19:55:37.447 main INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/Qmao5nFMBHfAYmTT1tmkbkiz1pWtdrncZuvb5yguMqaC1k
2020-02-22 19:55:37.449 NetworkRuntime-0 INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }

```

### 挖矿

```shell
./ckb miner -C dev

2020-02-22 20:09:15.785 main INFO sentry  sentry is disabled

Found! #1349 0x8e86c06146dc81d703ad97facf296d25ff135d75eacad860b964675fb68cf0ab
Found! #1350 0xee5a78a62d750b834ff8fba8fa7377395ad4144e21d1ba6c07fb0de1594b1f42
Found! #1351 0x962ed570f09043a0d4893929a02eb275ae635cf7520cb605a455ef460ec65441
Found! #1352 0x4ce1b63b28ce0a155663d3eaf7431b8ee61610470ae7e071806c7adb62be9fa8
Found! #1353 0x53b2deaac68cefc3b241d1d702bdf33de910ef6752c3fe4eacbdc102a65eed9f
Found! #1354 0x4ecd3e3e525681bb2b229220607397aa14960b6073b78d812ec9d80bf78f3ecf
Found! #1355 0x529c1d488da135af9e0a81466e1b60251cae5d1e2857e80826e14f6b627b434e
Dummy-Worker ⠁ [00:00:00]
Total nonces found:  11

```

## 查看区块

### 用 ckb-cli 监控区块信息

`./ckb-cli tui`

![tui](/img/docs/tui.png)

### 使用 ruby-sdk 查询区块信息

先进入 `./bin/console`

```ruby
# ruby code

rpc = CKB::RPC.new
=> #<RPC@http://localhost:8114>

rpc.get_tip_header #获取最高块的数据

=> {:compact_target=>"0x20038e38",
 :dao=>"0x2baf11ed5932a22ed36667662587230019ce2276e9380000006aae417a02ff06",
 :epoch=>"0x7080166000001",
 :hash=>"0x1d637d9f74c4191cda8d828be9f41143a7f5ce82b1d0beabba46df7de8fb5a67",
 :nonce=>"0xbf57b7ed827a117965da0db15d3d180f",
 :number=>"0x54e",
 :parent_hash=>"0xa12044c77bcde4d19f44ba12378d766b6bf75cd7269b8f5cce2abb237a32d236",
 :proposals_hash=>"0x0000000000000000000000000000000000000000000000000000000000000000",
 :timestamp=>"0x170c45a5be2",
 :transactions_root=>"0x0531880b6da6d8be724114815a04b955fc7a28b63400d9024cb1dc02b54410cc",
 :uncles_hash=>"0x0000000000000000000000000000000000000000000000000000000000000000",
 :version=>"0x0"}

```

### 查询地址与余额

```ruby

_priv_key = "fe59445edc3c30db6b0e1abcddc317137368f5604ce01cc1d279dfda001e8474"

api = CKB::API.new
=> #<API@http://localhost:8114>

wallet = CKB::Wallet.from_hex(api, "0x"+_priv_key)

wallet.address
=> "ckt1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqs0375w"

wallet.key.privkey #私钥
=> "0xfe59445edc3c30db6b0e1abcddc317137368f5604ce01cc1d279dfda001e8474"

wallet.key.pubkey #公钥
=> "0x0351d114becc7f9ad1986b99951969c67bae6d00252c4901a6a3ef70ff1eb57dd4"

wallet.blake160 #lock_arg
=> "0x3c55d6660b44a9c6470ddea5cb47581e0260b184"

wallet.get_balance # 余额
=> 103265972696
```

### 得到新地址

```ruby
_priv = CKB::Key.random_private_key #生成私钥
=> "0x7b60c0ca227427836588f31291c90979b4d31f0d73d28772f172dc3f1b47a672"

new_wallet = CKB::Wallet.from_hex(api, _priv)
```

---

参考：

https://docs.nervos.org/dev-guide/devchain.html

https://github.com/nervosnetwork/ckb-sdk-ruby
