---
id: ckb-cli-tx
title: 交易相关
sidebar_label: 交易相关
---

## tx 子命令

|方法|描述|
|---|---|
|init                      |初始化一个普通的（单签/多签）交易 |
|add-multisig-config       |添加多签配置|
|clear-field               |清除交易中所有字段|
|add-input                 |添加 cell input（带有 secp/多签 的 lock）|
|add-output                |添加 cell output|
|add-signature             |Add signature 添加签名|
|info                      |显示这笔多签交易的细节（capacity，tx-fee，等等）|
|sign-inputs               |签名这笔交易中所有的单签/多签 input|
|send                      |发送多签交易|
|build-multisig-address    |使用多签配置和 since（可选）参数来构建多签地址|

---