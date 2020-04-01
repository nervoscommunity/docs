---
id: ckb-cli-account
title: 账户管理
sidebar_label: 账户管理
---

## 可用命令

使用 `--help` 命令，查看可用命令

```shell
# account help doc
ckb-cli account --help
```

<details>
<summary>点击查看详细输出</summary>

```
Manage accounts

USAGE:
    ckb-cli account [FLAGS] [OPTIONS] [SUBCOMMAND]

FLAGS:
        --no-color         Do not highlight(color) output json
        --debug            Display request parameters
        --wait-for-sync    Ensure the index-store synchronizes completely before command being executed
    -h, --help             Prints help information
    -V, --version          Prints version information

OPTIONS:
        --output-format <output-format>    Select output format [default: yaml]  [possible values: yaml,
                                           json]

SUBCOMMANDS:
    list                List all accounts
    new                 Create a new account and print related information.
    import              Import an unencrypted private key from <privkey-path> and create a new account.
    import-keystore     Import key from encrypted keystore json file and create a new account.
    unlock              Unlock an account
    update              Update password of an account
    export              Export master private key and chain code as hex plain text (USE WITH YOUR OWN RISK)
    bip44-addresses     Extended receiving/change Addresses (see: BIP-44)
    extended-address    Extended address (see: BIP-44)
    help                Prints this message or the help of the given subcommand(s)
```
</details>

## 命令介绍及使用

|方法|描述|
|---|---|
|[list](#list)                |账户列表|
|[new](#new)                 |创建一个新帐户并打印相关信息|
|import              |从导入 `<privkey-path>` 未加密的私钥并创建一个新帐户|
|import-keystore     |从加密的 keystore json 文件导入密钥，并创建一个新帐户|
|unlock              |解锁账户|
|update              |更新账户密码|
|[export](#export)              |导出主私钥和链码为十六进制纯文本(由自己承担风险)|
|bip44-addresses     |扩展接收/更改地址(见BIP-44)|
|extended-address    |扩展地址(见BIP-44)|

---

### `list`

显示账户列表

```shell
ckb-cli account list --output-format json
```

<details>
<summary>点击查看详细输出</summary>

```json
[
  {
    "#":3,
    "address":{
      "mainnet":"ckb1qyqyjxhjklprtfaasnxdd2ppl5kjhftt2q8q7rnt58",
      "testnet":"ckt1qyqyjxhjklprtfaasnxdd2ppl5kjhftt2q8qrxd5cm"
    },
    "lock_arg":"0x491af2b7c235a7bd84ccd6a821fd2d2ba56b500e",
    "lock_hash":"0xf9df89a5936c26d5e003aec5e6869caba814b62f53ee9b6a5c70c2380d65da3f"
  },
  {
    "#":4,
    "address":{
      "mainnet":"ckb1qyqddjtrhl2jhtjv7pzkurtuvp2k3402c7ysvxhev4",
      "testnet":"ckt1qyqddjtrhl2jhtjv7pzkurtuvp2k3402c7ys3rfxqf"
    }
  }
]
```

</details>

---

### `new`

生成一个新的地址

请求：
```shell
ckb-cli account new

Your new account is locked with a password. Please give a password. Do not forget this password.
Password: # 输入密码
Repeat password: # 再次输入相同密码
```

响应：
```
address:
  mainnet: ckb1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqd20pcj
  testnet: ckt1qyqrc4wkvc95f2wxguxaafwtgavpuqnqkxzqs0375w
lock_arg:  0x3c55d6660b44a9c6470ddea5cb47581e0260b184
lock_hash: 0xadba7f9d5dfb04b6424b0f599e6d0fe7ae865ec8b9a14e3b1ef85d0d93017d46
```

---

### `export`

通过 `lock arg`，导出私钥

请求：
```shell
ckb-cli account export --extended-privkey-path wallet --lock-arg 0x3c55d6660b44a9c6470ddea5cb47581e0260b184 # 导出私钥到 wallet 文件
# 输入密码
Password:
Success exported account as extended privkey to: "wallet", please use this file carefully
```

响应：
```shell
cat wallet #使用 cat 命令查看文本，其中第 1 行为私钥

fe59445edc3c30db6b0e1abcddc317137368f5604ce01cc1d279dfda001e8474
0c056c9cf7e08dd3af87860e62812861a85072c9ea53bc950f9804f4ca261d72
```

- `--extended-privkey-path` 后跟导出的文件位置
- `--lock-arg 0x3c55d6...` 导出 lock-arg 对应值的私钥

---