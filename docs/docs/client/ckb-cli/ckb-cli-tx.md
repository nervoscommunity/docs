---
id: ckb-cli-tx
title: 交易相关
sidebar_label: 交易相关
---

## tx 子命令

|方法|描述|
|---|---|
|init                      |Init a common (sighash/multisig) transaction|
|add-multisig-config       |Add multisig config|
|clear-field               |Remove all field items in transaction|
|add-input                 |Add cell input (with secp/multisig lock)|
|add-output                |Add cell output|
|add-signature             |Add signature|
|info                      |Show detail of this multisig transaction (capacity, tx-fee, etc.)|
|sign-inputs               |Sign all sighash/multisig inputs in this transaction|
|send                      |Send multisig transaction|
|build-multisig-address    |Build multisig address with multisig config and since(optional) argument|

---