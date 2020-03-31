---
id: 0021-ckb-address-format.zh
title: CKB 地址格式
sidebar_label: 21：CKB 地址格式
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0021 | Standards Track | Proposal | Cipher Wang  |Nervos Foundation|2019-01-20|

# CKB 地址格式

## 摘要

**CKB 地址格式** 是 cell 的 **锁脚本** 在应用层的显示建议。锁脚本主要由三个关键参数组成，包括：`code_hash`，`hash_type` 和 `args`。CKB 地址将锁脚本包装成单行的、可验证的和人类可读的格式。

## 数据结构

### 有效格式类型

为了生成 CKB 地址，我们首先将锁脚本编码为字节数组，命名为 **payload**。然后，我们将有效形式转换为最终的地址格式。

有几种方式可以将锁脚本转换为有效的字节数组。我们使用 1 byte 来标识有效的格式。


| 格式类型     |                   描述                         |
|:-----------:|------------------------------------------------|
|  0x01       | locks 的简短版，具有通用的 code_hash           |
|  0x02       | 完整版，并且 hash_type = "Data"               |
|  0x04       | 完整版，并且 hash_type = "Type"               |



### 简短版的有效格式

简短版的有效格式是一种紧凑型的格式，它用 1 byte 的 code_hash_index 来标识常用的 code_hash，而不是 32 bytes 的 code_hash。

```c
payload = 0x01 | code_hash_index | args
```

将简短版的转换回锁脚本，可以使用下面的 `popular code_hash table` 将 `code_hash_index` 转换回 `code_hash` 和 `hash_type`。`args` 还是 `args`。


| code_hash_index |        code_hash     |   hash_type  |          args           |
|:---------------:|----------------------|:------------:|-------------------------|
|      0x00       | SECP256K1 + blake160 |     Type     |  blake160(PK)*          |
|      0x01       | SECP256K1 + multisig |     Type     |  multisig script hash** |

\* blake160 表示截取 Blake2b 哈希值的前 20 个 bytes。

\*\* **multisig script hash** 是多签脚本的 blake160 哈希的 20 个 bytes。多签脚本可以通过下面的格式进行组装：

```
S | R | M | N | blake160(Pubkey1) | blake160(Pubkey2) | ...
```

其中 S/R/M/N 是四个单字节的无符号整数，范围从 0 到 255，blake160(Pubkey1) 是公钥在 SECP256K1 压缩后，经过 blake2b 哈希后的前 160 个字节。S 是格式版本，目前固定为 0。M/N 表示用户必须提供 N 中 M 个签名才能解锁这个 cell。最后，R 表示提供的签名至少需要与公钥列表的前 R 项相匹配。


举个例子，Alice，Bob 和 Cipher 共同控制一个以多签形式锁定的 cell。他们定义解锁规则是：“三人中任意两人可以解锁这个 cell，但是 Cipher 必须同意”。那么相对应的多签脚本就是：

```
0 | 1 | 2 | 3 | Pk_Cipher_h | Pk_Alice_h | Pk_Bob_h
```


### 完整版的有效格式

完整版的有效格式直接编码锁脚本的所有数据字段。

```c
payload = 0x02/0x04 | code_hash | args
```


第一个字节定义锁脚本的 hash_type，"Data" 是 0x02，"Type" 是 0x04。



## 包装成地址

我们遵循 [Bitcoin base32 address format (BIP-173)](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki) 规则将有效格式转换成地址，这里使用的是 Bech32 编码和一个 [BCH 校验](https://en.wikipedia.org/wiki/BCH_code)。

Bech32 的原始版本最多允许 90 个字符的长度。和 [BOLT](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md) 类似，我们去掉了这个长度限制。因为当 Bech32 字符串长度大于 90 时，将会禁用纠错功能。我们不打算直接使用这样的函数，因为有可能会得到错误的修正结果。

Bech32 字符串由 **人类可读部分**，**分隔符** 和 **数据部分** 组成。数据部分的最后 6 个字符是校验码。下面是可读的 base32 编码表的翻译：


|       |0|1|2|3|4|5|6|7|
|-------|-|-|-|-|-|-|-|-|
|**+0** |q|p|z|r|y|9|x|8|
|**+8** |g|f|2|t|v|d|w|0|
|**+16**|s|3|j|n|5|4|k|h|
|**+24**|c|e|6|m|u|a|7|l|


人类可读部分的 "**ckb**" 意味着这是 CKB 主网，"**ckt**" 意味着这是测试网。分隔符总是 "1"。

![](/img/rfcs/0021/ckb-address.png)



## 示例和演示代码

```
== short address (code_hash_index = 0x00) test ==
args to encode:          b39bbc0b3673c7d36450bc14cfcdad2d559c6c64
address generated:       ckb1qyqt8xaupvm8837nv3gtc9x0ekkj64vud3jqfwyw5v

== short address (code_hash_index = 0x01) test ==
multi sign script:       00 | 01 | 02 | 03 | bd07d9f32bce34d27152a6a0391d324f79aab854 | 094ee28566dff02a012a66505822a2fd67d668fb | 4643c241e59e81b7876527ebff23dfb24cf16482
args to encode:          4fb2be2e5d0c1a3b8694f832350a33c1685d477a
address generated:       ckb1qyq5lv479ewscx3ms620sv34pgeuz6zagaaqklhtgg

== full address test ==
code_hash to encode:     9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8
with args to encode:     b39bbc0b3673c7d36450bc14cfcdad2d559c6c64
full address generated:  ckb1qjda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xw3vumhs9nvu786dj9p0q5elx66t24n3kxgj53qks
```

Demo 代码：https://github.com/CipherWang/ckb-address-demo

multisig_code：https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c
