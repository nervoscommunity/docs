---
id: start-dev
title: 运行本地开发链
sidebar_label: 运行本地开发链
---

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



https://docs.nervos.org/dev-guide/debugging-ckb-script.html#debug-syscall

---

参考：

https://docs.nervos.org/dev-guide/devchain.html

https://github.com/nervosnetwork/ckb-sdk-ruby