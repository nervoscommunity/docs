---
id: kyper-intro
sidebar_label: blog
title: "Keyper —— Nervos 上的 cell 管理协议"
author: Matt Quinn
author_title: Nervos Team
author_url:
author_image_url: https://miro.medium.com/fit/c/128/128/1*cfQUiPIVeYKzexUs-VCp5Q.jpeg
tags: [Keyper, Matt, DApp]
---

在智能合约平台上，用户通常只有一个一直使用的地址。但是，Nervos 的 [cell 模型](https://docs.nervos.org/key-concepts/cell-model.html)提供了一个不同的设计范例，用户在 Nervos 上可能会控制许多有着不同 [lock script](https://docs.nervos.org/technical-concepts/architecture.html#lock-script) 的不同的 cells。

当我们在和区块链进行交互时，这样的设计提供了强大的灵活性。为了控制 cell 的所有权，开发人员可以指定条件然后通过使用任意数量的密码学原语来控制这些 cells 的所有权。这样灵活的设计可以在 [P wallet](https://www.youtube.com/watch?v=Bh7GpFerpJw) 中看到。

<!--truncate-->

![](/img/blog/kyper-intro-1.png)

出于安全问题，这些 lock script 的使用和管理都将掌握在用户手中。与使用单一地址相比，增加了更多的实现细节，同时也丰富了用户体验，因为单一地址的功能总是相同的。

Keyper 的设计就是为了解决用户和程序开发人员面临的这一挑战。它是钱包和 dApp 之间的密钥管理的标准设计，还是一个支持插件的 lock 管理 SDK。

Keyper 简化了应用程序开发，提高了 Nervos 应用程序的用户友好性。Keyper 实现（又叫做 Keyper Agencies）包含了一个 lock script 的容器，它可以根据用户的私钥和应用程序的实现来生成合适的 lock script 值和签名。

![](/img/blog/kyper-intro-2.png)

### Keyper Agency

Keyper agency 是在用户设备上运行的 Keyper 的具体实现。

在不同的格式下，比如浏览器插件、桌面应用或者库等，可以构建许多不同的 Keyper agencies。Keyper agency 将会存储不同的 lock script 插件，允许用户方便地管理由不同的 lock script 保护的 cells。

这里是一个用户与 Keyper agency 交互的例子：

1. 用户连接到 dApp
2. dApp 请求 Keyper agency（在用户的设备上），获取可使用 cells 的列表
3. Keyper agency 将用户的部分 cells 传递给 dApp
4. dApp 服务器检查 cells 是否有效
5. dApp 服务器将组装生成一笔交易，并请求用户签名
6. 用户使用 Keyper agency（在用户的设备上）完成交易签名

[Rebase 团队](https://rebase.foundation/)正在实现一个 Keyper agency，作为 grants 资助的 [Synapse 浏览器插件钱包](https://talk.nervos.org/t/synapse-browser-wallet-and-keyper-agency/4339/)的一部分，您可以在 Nervos Talk 上追踪该项目的最新进展。

[原文连接](https://medium.com/nervosnetwork/introducing-keyper-for-cell-management-on-nervos-8e5a8a42fa5f)
