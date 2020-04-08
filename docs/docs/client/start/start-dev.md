---
id: start-dev
title: 运行本地开发链
sidebar_label: 运行本地开发链
---

## 生成开发链配置文件

命令：
* Mac 用户

```
./ckb init --chain dev -C dev
```

* Linux/Windows 用户

```
ckb init --chain dev -C dev
```

响应：

```shell
├── ckb-miner.toml
├── ckb.toml
└── specs
    └── dev.toml
```

## 配置挖矿地址

### 修改 `dev/ckb.toml`(意思是指 dev 文件夹下的 ckb.toml 档）

因为运行本地开发链，您还需要进行本地挖矿，因此需要修改 `dev/ckb.toml` 将其中的挖矿地址设置为您钱包的地址。

```shell
# 将下方几行代码最前面的 '#' 删除，使得代码可以生效
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
args = "0x3c55d6660b44a9c6470ddea5cb47581e0260b184" # 只需要此处修改 ckb-cli 生成的 lock_arg
hash_type = "type"
message = "0x"
```

### 生成钱包地址

首次使用没有 CKB 钱包地址？通过 ckb-cli 生成一个。

命令：
* Mac 用户

```shell
./ckb-cli account new # 生成一个新的 CKB 地址
```

* Linux/Windows 用户

```shell
ckb-cli account new # 生成一个新的 CKB 地址
```

响应：

```shell
Your new account is locked with a password. Please give a password. Do not forget this password.
Password: # 输入密码
Repeat password: # 再次输入相同密码

address:
  mainnet: ckb1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqd20pcj
  testnet: ckt1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqs0375w
lock_arg:  0x3c55d6660b44a9c6470ddea5cb47581e0260b184
lock_hash: 0xadba7f9d5dfb04b6424b0f599e6d0fe7ae865ec8b9a14e3b1ef85d0d93017d46
```

## 运行开发链

命令：
* Mac 用户

```
./ckb run -C dev
```

* Linux/Windows 用户

```
ckb run -C dev
```

响应：
```shell
2020-02-22 19:55:37.333 main INFO sentry  sentry is disabled
2020-02-22 19:55:37.434 main INFO ckb-chain  Start: loading live cells ...
2020-02-22 19:55:37.439 main INFO ckb-chain  Done: total 1346 transactions.
2020-02-22 19:55:37.443 main INFO main  ckb version: 0.29.0 (a6733e6 2020-02-26)
2020-02-22 19:55:37.443 main INFO main  chain genesis hash: 0x823b2ff5785b12da8b1363cac9a5cbe566d8b715a4311441b119c39a0367488c
2020-02-22 19:55:37.447 main INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/Qmao5nFMBHfAYmTT1tmkbkiz1pWtdrncZuvb5yguMqaC1k
2020-02-22 19:55:37.449 NetworkRuntime-0 INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }

```

## 运行开发链挖矿

命令：
* Mac 用户

```
./ckb miner -C dev
```

* Linux/Windows 用户

```
ckb miner -C dev
```

响应：
```shell
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



https://docs.nervos.org/dev-guide/debugging-ckb-script.html#debug-syscall

---

参考：

https://docs.nervos.org/dev-guide/devchain.html

https://github.com/nervosnetwork/ckb-sdk-ruby
