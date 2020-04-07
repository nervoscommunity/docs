---
id: connect-client
title: 与客户端交互
sidebar_label: 与客户端交互
---

## 安装 ckb ruby sdk

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

### 生成地址

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
api = CKB::API.new

new_key = CKB::Key.random_private_key #生成私钥
=> "0x7b60c0ca227427836588f31291c90979b4d31f0d73d28772f172dc3f1b47a672"

wallet2 = CKB::Wallet.from_hex(api, new_key)
=> #<CKB::Wallet:0x00007fedace7ef40
 @addr=
  #<CKB::Address:0x00007fedace7ec70
   @mode="testnet",
   @prefix="ckt",
   @script=
    #<CKB::Types::Script:0x00007fedace7ece8
     @args="0x114acda8ba61ced5d0c9086fee91877c296b3259",
     @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
     @hash_type="type">>,
 @address="ckt1qyqpzjkd4zaxrnk46ryssmlwjxrhc2ttxfvswf5pjs",
 @api=#<API@http://localhost:8114>,
 @blake160="0x114acda8ba61ced5d0c9086fee91877c296b3259",
 @hash_type="type",
 @key=
  #<CKB::Key:0x00007fedace7f378
   @privkey="0xf99fcf8ca46f7fb9e305f9123fb1fee48faa78ddeccda0c268fb83c11006d617",
   @pubkey="0x039c730f2a61cf1e1cd9f98c916e86a5176b973d531fddd0444c780bcebe5aee93">,
 @pubkey="0x039c730f2a61cf1e1cd9f98c916e86a5176b973d531fddd0444c780bcebe5aee93",
 @skip_data_and_type=true>
```

### 发送交易

```ruby
api = CKB::API.new

alice = CKB::Wallet.from_hex(api, CKB::Key.random_private_key)
puts "alice balance: " + alice.get_balance.to_s

bob = CKB::Wallet.from_hex(api, CKB::Key.random_private_key)

tx_hash = alice.send_capacity(bob.address, 100*(10**8), fee: 3000) # alice 向bob发送100个ckb，手续是 1000 ckb byte
```

### 查询交易

```ruby
api.get_transaction(tx_hash) # 获得交易的详细信息

=> #<CKB::Types::TransactionWithStatus:0x00007faceb8f8fc8
 @transaction=
  #<CKB::Types::Transaction:0x00007faceb8f9298
   @cell_deps=
    [#<CKB::Types::CellDep:0x00007faceb8faf80
      @dep_type="dep_group",
      @out_point=
       #<CKB::Types::OutPoint:0x00007faceb8fb098
        @index=0,
        @tx_hash="0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708">>],
   @hash="0x277cfd0cde5b6afd13913fad03af6d184a60abb219778d1914b17dda5433efd8",
   @header_deps=[],
   @inputs=
    [#<CKB::Types::Input:0x00007faceb8fab20
      @previous_output=
       #<CKB::Types::OutPoint:0x00007faceb8fae18
        @index=0,
        @tx_hash="0x62cc19fa97eb2bfed88801b4a7c13d7dbf0c4d712d3eb975d3b4102c56e7b874">,
      @since=0>],
   @outputs=
    [#<CKB::Types::Output:0x00007faceb8fa198
      @capacity=100000000000,
      @lock=
       #<CKB::Types::Script:0x00007faceb8fa2b0
        @args="0x53e7ae882f39cae6df36ff9b7462d7c10465f26c",
        @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        @hash_type="type">,
      @type=nil>,
     #<CKB::Types::Output:0x00007faceb8f93d8
      @capacity=100988421204,
      @lock=
       #<CKB::Types::Script:0x00007faceb8f9798
        @args="0x831c7bc6e7f758c1c69a98bd1d999bd9b8510011",
        @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        @hash_type="type">,
      @type=nil>],
   @outputs_data=["0x", "0x"],
   @version=0,
   @witnesses=
    ["0x5500000010000000550000005500000041000000fc98ac5594b0e7ee8fd5158ef3489db4afc4422c11e3022a8e6a1582582e71c049d2a756444d46f88c5389805e6e4be2671369d0e333855cf0cb656f60abf47101"]>,
 @tx_status=
  #<CKB::Types::TxStatus:0x00007faceb8f90e0
   @block_hash="0x00f8f9fef1f041e63a61dd37a3432e8c4ea5a1a4ea4d1c78ed7ab9d56d3ed2aa",
   @status="committed">>
```

## 设置

### 在 ckb.toml 设置 ckb-script 的 log 级别

```js
[logger]
filter = "info,ckb-script=debug"
```