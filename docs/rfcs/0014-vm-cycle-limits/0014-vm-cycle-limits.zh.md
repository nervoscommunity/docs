---
id: 0014-vm-cycle-limits.zh
title: VM Cycle 限制
sidebar_label: 14：VM Cycle 限制
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0014 | Standards Track | Proposal | Xuejie Xiao  |Nervos Foundation|2019-01-04|

# VM Cycle 限制

## 介绍

这个 RFC 描述了用于规范 VM 脚本的 cycle 限制。

CKB VM 是一个灵活的虚拟机，可以自由地实现许多流程控制，比如 loops 或者 branches。因此，我们需要在 CKB VM 中强制执行某些规则来防止恶意脚本，比如带有无限循环的脚本。

我们引入一个叫做 cycles 的概念，每一个 VM 指令或 syscall 都将消耗一定数量的 cycles。在共识层面，定义了一个叫做 `max_block_cycles` 的标量字段，保证一个区块中所有脚本使用的 cycles 总和不能超过这个值。否则，这个区块将会被拒绝。通过这种方式，我们可以保证所有在 CKB VM 中运行的脚本都会停止结束，或者以报错结束。


## 共识变化

如上所述，一个新的标量字段 `max_block_cycles` 被添加到 chain spec 中，作为一个共识规则，它对一个区块中的脚本可使用的 cycles 进行了严格的限制。没有哪个区块可以使用大于 `max_block_cycles` 的 cycles。

注意，对单个交易或者脚本，没有 cycles 限制。对于一个交易或者一个脚本它们可以自由地使用需要的 cycles 数量，只要整个区块使用的 cycles 小于 `max_block_cycles` 字段即可。


## Cycle 的测量

这里我们将指定每个 CKB VM 指令或者 syscalls 所需的 cycles。注意，目前还是 RFC，在这里我们为每个指令或者 syscall 定义硬性的规则，在未来，这可能会成为共识规则的一部分，这样我们可以更容易地改变它们。

The cycles consumed for each operation are determined based on the following rules:

1. Cycles for RISC-V instructions are determined based on real hardware that implement RISC-V ISA.
2. Cycles for syscalls are measured based on real runtime performance metrics obtained while benchmarking current CKB implementation.

### Initial Loading Cycles

For each byte loaded into CKB VM in the initial ELF loading phase, 0.25 cycles will be charged. This is to encourage dapp developers to ship smaller smart contracts as well as preventing DDoS attacks using large binaries. Notice fractions will be rounded up here, so 30.25 cycles will become 31 cycles.

### 指令 Cycles

除以下指令外，所有的 CKB VM 指令均消耗一个 cycle。


| Instruction | Cycles               |
|-------------|----------------------|
| JALR        | 3                    |
| JAL         | 3                    |
| J           | 3                    |
| JR          | 3                    |
| BEQ         | 3                    |
| BNE         | 3                    |
| BLT         | 3                    |
| BGE         | 3                    |
| BLTU        | 3                    |
| BGEU        | 3                    |
| BEQZ        | 3                    |
| BNEZ        | 3                    |
| LD          | 2                    |
| SD          | 2                    |
| LDSP        | 2                    |
| SDSP        | 2                    |
| LW          | 3                    |
| LH          | 3                    |
| LB          | 3                    |
| LWU         | 3                    |
| LHU         | 3                    |
| LBU         | 3                    |
| SW          | 3                    |
| SH          | 3                    |
| SB          | 3                    |
| LWSP        | 3                    |
| SWSP        | 3                    |
| MUL         | 5                    |
| MULW        | 5                    |
| MULH        | 5                    |
| MULHU       | 5                    |
| MULHSU      | 5                    |
| DIV         | 32                   |
| DIVW        | 32                   |
| DIVU        | 32                   |
| DIVUW       | 32                   |
| REM         | 32                   |
| REMW        | 32                   |
| REMU        | 32                   |
| REMUW       | 32                   |
| ECALL       | 500 (see note below) |
| EBREAK      | 500 (see note below) |


### Syscall Cycles

As shown in the above chart, each syscall will have 500 initial cycle consumptions. This is based on real performance metrics gathered benchmarking CKB implementation, certain bookkeeping logics are required for each syscall here.

In addition, for each byte loaded into CKB VM in the syscalls, 0.25 cycles will be charged. Notice fractions will also be rounded up here, so 30.25 cycles will become 31 cycles.

## Guidelines

In general, the cycle consumption rules above follow certain guidelines:

* Branches 应该要比普通指令更贵。
* Memory accesses are more expensive than normal instructions. Since CKB VM is a 64-bit system, loading 64-bit value directly will cost less cycle than loading smaller values.
* 乘法和除法要比普通指令贵得多。
* Syscalls include 2 parts: the bookkeeping part at first, and a plain memcpy phase. The first bookkeeping part includes quite complex logic, which should consume much more cycles. The memcpy part is quite cheap on modern hardware, hence less cycles will be charged.

Looking into the literature, the cycle consumption rules here resemble a lot like the performance metrics one can find in modern computer archtecture.


