---
id: ckb-cli-util
title: 常用工具
sidebar_label: 常用工具
---

## util 子命令

|方法|描述|
|---|---|
|key-info                    |显示一个 secp256k1 私钥（来自文件）或公钥的公开信息|
|sign-data                   |使用 secp256k1 对 data 进行签名|
|sign-message                |使用 secp256k1 对 message 进行签名|
|verify-signature            |验证一个紧凑格式的签名|
|eaglesong                   |使用 eaglesong 算法进行二进制哈希|
|blake2b                     |使用 blake2b 算法（个性化：ckb-default-hash）进行二进制哈希|
|compact-to-difficulty       |将压缩目标值转换为难度值|
|difficulty-to-compact       |将难度值转换为压缩目标值|
|to-genesis-multisig-addr    |将单一签名格式的地址转化为多签格式（仅适用于主网 genesis cells）|
|to-multisig-addr            |将单一签名格式的地址转化为多签格式|

---