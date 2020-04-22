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
|[import](#import)              |导入 `<privkey-path>` 未加密的私钥并创建一个新帐户|
|[import-keystore](#import-keystore)     |从加密的 keystore json 文件导入密钥，并创建一个新帐户|
|[unlock](#unlock)              |解锁账户|
|[update](#update)              |更新账户密码|
|[export](#export)              |导出主私钥和链码为十六进制纯文本(由自己承担风险)|
|[bip44-addresses](#bip44-addresses)     |扩展接收/更改地址(见BIP-44)|
|[extended-address](#extended-address)    |扩展地址(见BIP-44)|

---

### `list`

显示账户列表

> 用法：`ckb-cli account list [FLAGS] [OPTIONS]`

```shell
ckb-cli account list --output-format json
```

<details>
<summary>点击查看详细输出</summary>

```json
[
  {
    "#": 0,
    "address": {
      "mainnet": "ckb1qyqw5ps6f323lqhwzdcg0jy74ums73dssqdsmxfwet",
      "testnet": "ckt1qyqw5ps6f323lqhwzdcg0jy74ums73dssqdsxrh34h"
    },
    "lock_arg": "0xea061a4c551f82ee137087c89eaf370f45b0801b",
    "lock_hash": "0x22c596304fa49bd37d21a3eeb94bb572e69e9e18e329c251e42b91289721bf1e"
  },
  {
    "#": 1,
    "address": {
      "mainnet": "ckb1qyqwn2ajzmve7vhmmn0qmq33gvmzacmlr4vs2q3x0w",
      "testnet": "ckt1qyqwn2ajzmve7vhmmn0qmq33gvmzacmlr4vsh90erj"
    },
    "lock_arg": "0xe9abb216d99f32fbdcde0d823143362ee37f1d59",
    "lock_hash": "0xb8b81481d0ce46444d52b9bd23c429111029b0f38349ba9374db1b5be74de1a4"
  },
]
```

</details>

---

### `new`

生成一个新的地址

> 用法：`ckb-cli account new [FLAGS] [OPTIONS]`

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
  mainnet: ckb1qyqgxjh9jk4fyxy3mu9g4p5nvgnmvj8h8lmqh70qkn
  testnet: ckt1qyqgxjh9jk4fyxy3mu9g4p5nvgnmvj8h8lmq2m3l60
lock_arg: 0x834ae595aa921891df0a8a86936227b648f73ff6
lock_hash: 0x90b367c3086ad34412d795081c9be789973680ffc2586c0b56f3330aa9d8851e
```

---
### `import`

导入 `<privkey-path>` 路径下未加密的私钥，并创建一个新帐户

> 用法：`ckb-cli account import --extended-privkey-path <extended-privkey-path> --output-format <output-format> --privkey-path <privkey-path>`

请求：
```
ckb-cli account import --privkey-path wallet1
```
* wallet1 文件中为一段 256bit 的随机数

响应：
```shell
Password: # 输入密码
Repeat password: # 再次输入密码
address:
  mainnet: ckb1qyqrku7facdusmm6dgcfv4rs237pwqt27jnsuf9ye7
  testnet: ckt1qyqrku7facdusmm6dgcfv4rs237pwqt27jnspvmm4z
lock_arg: 3b73c9ee1bc86f7a6a30965470547c17016af4a7
```

---
### `import-keystore`

从加密的 keystore json 文件导入密钥，并创建一个新帐户

> 用法：`ckb-cli account import-keystore --output-format <output-format> --path <path>`

请求：

响应：

---
### `unlock`

解锁账户

> 用法：`ckb-cli account unlock --keep <keep> --lock-arg <lock-arg> --output-format <output-format>`


---
### `update`

更新账户密码

> 用法：`ckb-cli account update --lock-arg <lock-arg> --output-format <output-format>`

请求：
```
ckb-cli account update --lock-arg 0xc4841b76021839360b4b
bea51a290150b268abab
```

响应：
```shell
Old password: # 输入旧密码
New password:  # 输入新密码
Repeat password:  # 再次输入新密码
success
```

---

### `export`

通过 `lock arg`，导出私钥

> 用法：`ckb-cli account export [FLAGS] [OPTIONS] --extended-privkey-path <extended-privkey-path> --lock-arg <lock-arg>`

- `--extended-privkey-path` 后跟导出的文件位置和文件名
- `--lock-arg 0x834ae5...` 导出 lock-arg 对应值的私钥

请求：
```shell
ckb-cli account export --extended-privkey-path wallet --lock-arg 0x834ae595aa921891df0a8a86936227b648f73ff6 # 导出私钥到当前路径的 wallet 文件
# 输入密码
Password:
Success exported account as extended privkey to: "wallet", please use this file carefully
```

响应：
```shell
cat wallet #使用 cat 命令查看文本，其中第 1 行为私钥

97de6c08b3dd8f859d9fc1efed4301b0c05b6839ac3a097b80bfcfd7108e9fc6
a353ac6cf05bef04be186ad788a4512081c32f501a59810927398c6e448ff00c
```
---

### `bip44-addresses`

> 用法：`ckb-cli account bip44-addresses --change-length <change-length> --from-change-index <from-change-index> --from-receiving-index <from-receiving-index> --lock-arg <lock-arg> --output-format <output-format> --receiving-length <receiving-length>`

---

### `extended-address`

> 用法：` ckb-cli account extended-address --lock-arg <lock-arg> --output-format <output-format>`



---