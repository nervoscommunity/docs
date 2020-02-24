---
id: wishlist
title: Grants 申请范围
sidebar_label: Grants 申请范围
---

## 第一阶段：开发内容为主

Nervos 基金会成员 Ben 于 Talk 论坛上发布了[《Open Grant Program Categories and Scope of Work for Applications 》](https://talk.nervos.org/t/open-grant-program-categories-and-scope-of-work-for-applications/4109)（公开 Grants 计划类别和申请工作范围）。文中列出了一部分，目前已经开放给大家申请的 Grants 计划类别和工作范围，具体如下（目前第一阶段主要都是开发相关的内容，其他类别的 Grants 申请将在今后陆续开放）：

* **轻客户端协议**
    * Sub-linear PoW 验证协议，允许轻客户端在 sub-linear 时间内同步区块头
    * 状态查询协议，允许轻客户端高效、安全、隐私地从全节点查询状态

* **Nervos CKB 与比特币和以太坊之间的互操作性**
    * 原子交换
    * 无需信任的跨链资产转移

* **密码学原语移植到 CKB 上**
    * 连接不同的区块链以验证其区块头和交易的哈希函数，例如以太坊的 keccak256
    * 各种授权场景中的签名算法，如 BLS，Schnorr，RSA 等

* **智能合约语言和工具**
    * 编译器，可将现有的语言编译成 CKB VM 可执行的文件
    * 解释器，使得现有的语言可以在 CKB VM 上运行
    * 专门为 CKB 的编程模型设计的 DSL 或框架，使得生成器/验证器的编程更加方便且安全
    * 生产工具，如 IDE，调试器等
    * 用于代码复用的动态链接

* **矿池**
    * 代码开源的矿池项目，允许矿工在出块中选择打包某些交易，比如支持 Stratum V2 和（或者） BetterHash 的矿池

* **CKB SDKs 和中间件**
    * 不同语言的 SDK
    * 可配置和可扩展的交易以及 Cell 解析器，便利 dApp 开发者

* **UDT 相关的生态系统支持**
    * UDT 开发工具
    * UDT 示例和基于 UDT 的 dApp 开发
    * Token 交换
    * 支持通道

* **钱包开发**
    * 硬件钱包的集成
    * 高性能钱包（自动换币、一键锁 Nervos DAO）

* **Nervos DAO 相关的 dApps**