---
id: script-stdlib
title: CKB C标准库
sidebar_label: CKB C标准库
---

在CKB脚本的开发过程中，我们发现了很多在编写CKB脚本时非常有用的用例和模式。

这个标准库定义了一些通用的用例，这可能包括但不限于以下这些:

* CKB的数据结构定义
* 通过系统调用与CKB进行交互的实用工具
* 一个shimmed的libc 
> 注意这里的libc是为CKB的特殊需求而定制的

请注意，虽然这个库会使用了C语言的代码来实现，但它并不限于用C语言编写的脚本。Rust脚本可能会使用FFI来利用这里的C代码，更高级别的语言也可以使用某些工具来使用这里的代码。


[Github](https://github.com/nervosnetwork/ckb-c-stdlib)