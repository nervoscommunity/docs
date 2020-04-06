---
id: script-stdlib
title: CKB C 标准库
sidebar_label: CKB C 标准库
---

[CKB C 标准库](https://github.com/nervosnetwork/ckb-c-stdlib)

在 CKB 脚本的开发过程中，我们发现了很多在编写 CKB 脚本时非常有用的用例和模式。

这个标准库定义了一些通用的用例，这可能包括但不限于以下这些:

* CKB 的数据结构定义
* 通过系统调用与 CKB 进行交互的实用工具
* 一个 shimmed 的 libc
> 注意这里的 libc 是为 CKB 的特殊需求而定制的

请注意，虽然这个库会使用了 C 语言的代码来实现，但它并不限于用 C 语言编写的脚本。Rust 脚本可能会使用 FFI 来利用这里的 C 代码，更高级别的语言也可以使用某些工具来使用这里的代码。