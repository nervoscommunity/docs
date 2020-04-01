---
id: ckb-cli-util
title: 常用工具
sidebar_label: 常用工具
---

## util 子命令

|方法|描述|
|---|---|
|key-info                    |Show public information of a secp256k1 private key (from file) or public |key|
|sign-data                   |Sign data with secp256k1 signature|
|sign-message                |Sign message with secp256k1 signature|
|verify-signature            |Verify a compact format signature|
|eaglesong                   |Hash binary use eaglesong algorithm|
|blake2b                     |Hash binary use blake2b algorithm (personalization: 'ckb-default-hash')|
|compact-to-difficulty       |Convert compact target value to difficulty value|
|difficulty-to-compact       |Convert difficulty value to compact target value|
|to-genesis-multisig-addr    |Convert address in single signature format to multisig format (only for mainnet genesis cells)|
|to-multisig-addr            |Convert address in single signature format to multisig format|

---