---
id: 0009-vm-syscalls.zh
title: VM 系统调用
sidebar_label: 09：VM Syscalls
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0009 | Standards Track | Proposal | Xuejie Xiao  |Nervos Foundation|2018-12-14|

# VM 系统调用

## 摘要

本 RFC 介绍当前 CKB 已实现的所有 RISC-V VM  系统调用。

## 介绍

CKB VM 系统调用用于实现基于 RISC-V 的 CKB VM 与 CKB 主进程之间的通信，能够让在 VM 中运行的脚本从 CKB 中读取当前的交易信息以及通用的区块链信息。利用系统调用而非自定义指令，能够让我们保持一个兼容 RISC-V 实现的标准以及更广阔的支持面。 

## 局部加载

除了 `Exit` 异常外，本文档包含的所有系统调用都使用了局部加载设计。在每个系统调用中都会用到以下三个参数：

* `addr`：一个指向 VM 内存空间中缓冲区的指针，表示我们要加载系统调用数据的位置。
* `len`：一个指向 VM 内存空间中一个64位无符号整数的指针，当调用系统调用时，这个内存位置应该存储 `addr` 指定的缓冲区的长度，当从系统调用返回时，CKB VM 会用缓冲区的实际长度填入 `len` 。我们下面会解释具体的逻辑。
* `offset`：一个偏移量，指定我们应该从哪个偏移量开始加载系统调用数据。

每个系统调用准备返回数据的方式可能不同，当数据准备完毕后，会通过以下步骤将其输入到 VM 中。为了方便参考，我们把准备好的返回数据称为 `data`，其数据长度称为  `data_length`。

1. 执行内存读取操作，从虚拟机内存空间读取 `len` 指针中的值，这里我们称 `len` 为 `size` （大小）。
2. `full_size` 的计算方法为是 `data_length - offset`。
3. `real_size` 为 `size` 和 `full_size` 两者的最小值。
4. 从 `&data[offset]` 开始到 `&data[offset + real_size]` 的序列化值被写入从 `addr` 开始的 VM 内存空间位置。
5. `full_size` 写入到 `len` 指针中。
6. 系统调用返回 `0` 表示执行成功。

整个过程的重点，是为 VM 端提供了一种在可用内存不足的情况下进行局部读取的方法，进而支持读取完整的数据。

这里有一个技巧，就是通过提供 `NULL` 作为 `addr` ，一个0值的 `uint64_t` 指针作为`len`，这个系统调用可以用来获取序列化数据部分的长度，而不需要读取任何实际数据。

## 系统调用规范

在 CKB 中，我们使用 RISC-V 的标准系统调用解决方案：每个系统调用接受 6 个参数，分别存储在寄存器 `A0` ~ `A5` 中。这里的每个参数都是寄存器字长，所以它可以存储常规的整数或指针。系统调用号存储在 `A7` 中。当所有的参数和系统调用号都设置好后，用 `ecall` 指令触发系统调用执行，CKB VM 再将控制权从 VM 转移到实际的系统调用实现下。例如，以下 RISC-V 程序集将触发 *Exit* 系统调用，返回代码为10。

```
li a0, 10
li a7, 93
ecall
```

如例所示，并不是所有的系统调用都会用到 6 个参数。在这种情况下，调用方只能填写需要的参数。

系统调用可以通过 2 种方式响应 VM：

* 如果返回值存在，则将值放在 `A0` 中。
* 系统调用也可以将数据写入某些系统调用参数所指向的内存位置，所以在系统调用完成后，正常的 VM 指令可以读取系统调用所准备的数据。

为了方便起见，我们可以将调用系统调用的逻辑封装在一个 C 函数中：

```c
static inline long
__internal_syscall(long n, long _a0, long _a1, long _a2, long _a3, long _a4, long _a5)
{
  register long a0 asm("a0") = _a0;
  register long a1 asm("a1") = _a1;
  register long a2 asm("a2") = _a2;
  register long a3 asm("a3") = _a3;
  register long a4 asm("a4") = _a4;
  register long a5 asm("a5") = _a5;

  register long syscall_id asm("a7") = n;

  asm volatile ("scall"
		: "+r"(a0) : "r"(a1), "r"(a2), "r"(a3), "r"(a4), "r"(a5), "r"(syscall_id));

  return a0;
}

#define syscall(n, a, b, c, d, e, f) \
        __internal_syscall(n, (long)(a), (long)(b), (long)(c), (long)(d), (long)(e), (long)(f))
```

（注：本函数改编自 [riscv-newlib](https://github.com/riscv/riscv-newlib/blob/77e11e1800f57cac7f5468b2bd064100a44755d4/libgloss/riscv/internal_syscall.h#L25)）

现在，我们能够在 C 代码中更容易地触发同样的 *Exit* 系统调用：

```c
syscall(93, 10, 0, 0, 0, 0, 0);
```

请注意，尽管 *Exit* 系统调用只需要一个参数，但我们的C语言封装函数要求我们填入全部参数，我们可以将其他未使用的参数初始化为 0。下面我们将用一个 C 函数签名来说明每个系统调用的接受参数。同时为了说明原因，本 RFC 中显示的所有代码都假定是用纯 C 语言编写的。

- [Exit]
- [Load Transaction Hash]
- [Load Transaction]
- [Load Script Hash]
- [Load Script]
- [Load Cell]
- [Load Cell By Field]
- [Load Cell Data]
- [Load Cell Data As Code]
- [Load Input]
- [Load Input By Field]
- [Load Header]
- [Load Header By Field]
- [Load Witness]
- [Debug]

### Exit
[exit]: #exit

As shown above, *Exit* syscall has a signature like following:

```c
void exit(int8_t code)
{
  syscall(93, code, 0, 0, 0, 0, 0);
}
```

*Exit* syscall don't need a return value since CKB VM is not supposed to return from this function. Upon receiving this syscall, CKB VM would terminate execution with the specified return code. This is the only way of correctly exiting a script in CKB VM.

### Load Transaction Hash
[load transaction hash]: #load-transaction-hash

*Load Transaction Hash* syscall has a signature like following:

```c
int ckb_load_tx_hash(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2061, addr, len, offset, 0, 0, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.

This syscall would calculate the hash of current transaction and copy it to VM memory space based on *partial loading* workflow.

### Load Transaction
[load transaction]: #load-transaction

*Load Transaction* syscall has a signature like following:

```c
int ckb_load_transaction(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2051, addr, len, offset, 0, 0, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.

This syscall serializes the full transaction containing running script into the Molecule Encoding [1] format, then copy it to VM memory space based on *partial loading* workflow.

### Load Script Hash
[load script hash]: #load-script-hash

*Load Script Hash* syscall has a signature like following:

```c
int ckb_load_script_hash(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2062, addr, len, offset, 0, 0, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.

This syscall would calculate the hash of current running script and copy it to VM memory space based on *partial loading* workflow.

### Load Script
[load script]: #load-script

*Load Script* syscall has a signature like following:

```c
int ckb_load_script(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2052, addr, len, offset, 0, 0, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.

This syscall serializes the current running script into the Molecule Encoding [1] format, then copy it to VM memory space based on *partial loading* workflow.

### Load Cell
[load cell]: #load-cell

*Load Cell* syscall has a signature like following:

```c
int ckb_load_cell(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2071, addr, len, offset, index, source, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 2: output cells.
    + `0x0100000000000002`: output cells with the same running script as current script
    + 3: dep cells.

This syscall would locate a single cell in the current transaction based on `source` and `index` value, serialize the whole cell into the Molecule Encoding [1] format, then use the same step as documented in *Partial Loading* section to feed the serialized value into VM.

This syscall might return the following errors:

* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Cell By Field
[load cell by field]: #load-cell-by-field

*Load Cell By Field* syscall has a signature like following:

```c
int ckb_load_cell_by_field(void* addr, uint64_t* len, size_t offset,
                           size_t index, size_t source, size_t field)
{
  return syscall(2081, addr, len, offset, index, source, field);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 2: output cells.
    + `0x0100000000000002`: output cells with the same running script as current script
    + 3: dep cells.
* `field`: a flag denoting the field of the cell to read, possible values include:
    + 0: capacity in 64-bit unsigned little endian integer value.
    + 1: data hash.
    + 2: lock in the Molecule Encoding format.
    + 3: lock hash.
    + 4: type in the Molecule Encoding format.
    + 5: type hash.
    + 6: occupied capacity in 64-bit unsigned little endian integer value.

This syscall would locate a single cell in current transaction just like *Load Cell* syscall, and then fetches the data denoted by the `field` value. The data is then fed into VM memory space using the *partial loading* workflow.

This syscall might return the following errors:

* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* An invalid field value would immediately trigger an VM error and halt execution.
* In some cases certain values are missing(such as requesting type on a cell without type script), the syscall would return `2` as return value then.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Cell Data
[load cell Data]: #load-cell-data

*Load Cell Data* syscall has a signature like following:

```c
int ckb_load_cell_data(void* addr, uint64_t* len, size_t offset,
                       size_t index, size_t source)
{
  return syscall(2092, addr, len, offset, index, source, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 2: output cells.
    + `0x0100000000000002`: output cells with the same running script as current script
    + 3: dep cells.

This syscall would locale a single cell in the current transaction just like *Load Cell* syscall, then locates its cell data section. The cell data is then fed into VM memory space using the *partial loading* workflow.

This syscall might return the following errors:

* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Cell Data As Code
[load cell Data As Code]: #load-cell-data-as_code

*Load Cell Data* syscall has a signature like following:

```c
int ckb_load_cell_data_as_code(void* addr, size_t memory_size, size_t content_offset,
                               size_t content_size, size_t index, size_t source)
{
  return syscall(2091, addr, memory_size, content_offset, content_size, index, source);
}
```

The arguments used here are:

* `addr`: a pointer to a buffer in VM memory space used to hold loaded code, must be aligned on a 4KB boundary.
* `memory_size`: the size of memory buffer used to hold code, must be a multiple of 4KB.
* `content_offset`: start offset of code to load in cell data.
* `content_size`: size of code content to load in cell data.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 2: output cells.
    + `0x0100000000000002`: output cells with the same running script as current script
    + 3: dep cells.

This syscall would locale a single cell in the current transaction just like *Load Cell* syscall, then locates its cell data section. But different from *Load Cell Data* syscall, this syscall would load the requested cell data content into VM memory, and marked the loaded memory page as executable. Later CKB VM can then jump to the loaded memory page to execute loaded code. This can be used to implement dynamic linking in CKB VM.

Notice this syscall does not implement *partial loading* workflow.

For now, memory pages marked as executable cannot be reverted to non-executable pages.

This syscall might return the following errors:

* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* An unaligned `addr` or `memory_size` would immediately trigger an VM error and halt execution.
* Out of bound`content_offset` or `content_size` values would immediately trigger an VM error and halt execution.
* `content_size` must not be larger than `memory_size`, otherwise it would immediately trigger an VM error and halt execution.

In case of errors, `addr` and `index` will not contain meaningful data to use.

For an example using this syscall, please refer to [this script](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/0759a656c20e652e9ad2711fde0ed96ce9f1130b/c/or.c).

### Load Input
[load input]: #load-input

*Load Input* syscall has a signature like following:

```c
int ckb_load_input(void* addr, uint64_t* len, size_t offset,
                   size_t index, size_t source)
{
  return syscall(2073, addr, len, offset, index, source, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of inputs to read.
* `source`: a flag denoting the source of inputs to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script

This syscall would locate a single cell input in the current transaction based on `source` and `index` value, serialize the whole cell input into the Molecule Encoding [1] format, then use the same step as documented in *Partial Loading* section to feed the serialized value into VM.

This syscall might return the following errors:
* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* When `output cells` or `dep cells` is used in `source` field, the syscall would return with `2` as return value, since cell input only exists for input cells.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Input By Field
[load input by field]: #load-input-by-field

*Load Input By Field* syscall has a signature like following:

```c
int ckb_load_input_by_field(void* addr, uint64_t* len, size_t offset,
                            size_t index, size_t source, size_t field)
{
  return syscall(2083, addr, len, offset, index, source, field);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of inputs to read.
* `source`: a flag denoting the source of inputs to locate, possible values include:
    + 1: inputs.
    + `0x0100000000000001`: input cells with the same running script as current script
* `field`: a flag denoting the field of the input to read, possible values include:
    + 0: out_point in the Molecule Encoding format.
    + 1: since in 64-bit unsigned little endian integer value.

This syscall would locate a single cell input in current transaction just like *Load Cell* syscall, and then fetches the data denoted by the `field` value. The data is then fed into VM memory space using the *partial loading* workflow.

This syscall might return the following errors:
* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* When `output cells` or `dep cells` is used in `source` field, the syscall would return with `2` as return value, since cell input only exists for input cells.
* An invalid field value would immediately trigger an VM error and halt execution.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Header
[load header]: #load-header

*Load Header* syscall has a signature like following:

```c
int ckb_load_header(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2072, addr, len, offset, index, source, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 4: header deps.

This syscall would locate the header associated either with an input cell, or a header dep based on `source` and `index` value, serialize the whole header into Molecule Encoding [1] format, then use the same step as documented in *Partial Loading* section to feed the serialized value into VM.

Note when you are loading the header associated with an input cell, the header hash should still be included in `header deps` section of current transaction.

This syscall might return the following errors:
* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* This syscall would return with `2` as return value if requesting a header for an input cell, but the `header deps` section is missing the header hash for the input cell.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Header By Field
[load header by field]: #load-header-by-field

*Load Header By Field* syscall has a signature like following:

```c
int ckb_load_header_by_field(void* addr, uint64_t* len, size_t offset,
                             size_t index, size_t source, size_t field)
{
  return syscall(2082, addr, len, offset, index, source, field);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 4: header deps.
* `field`: a flag denoting the field of the header to read, possible values include:
    + 0: current epoch number in 64-bit unsigned little endian integer value.
    + 1: block number for the start of current epoch in 64-bit unsigned little endian integer value.
    + 2: epoch length in 64-bit unsigned little endian integer value.

This syscall would locate the header associated either with an input cell, or a header dep based on `source` and `index` value, and then fetches the data denoted by the `field` value. The data is then fed into VM memory space using the *partial loading* workflow.

Note when you are loading the header associated with an input cell, the header hash should still be included in `header deps` section of current transaction.

This syscall might return the following errors:
* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.
* This syscall would return with `2` as return value if requesting a header for an input cell, but the `header deps` section is missing the header hash for the input cell.
* An invalid field value would immediately trigger an VM error and halt execution.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Load Witness
[load witness]: #load-witness

*Load Witness* syscall has a signature like following:

```c
int ckb_load_witness(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2074, addr, len, offset, index, source, 0);
}
```

The arguments used here are:

* `addr`, `len` and `offset` follow the usage descripted in *Parital Loading* section.
* `index`: an index value denoting the index of entries to read.
* `source`: a flag denoting the source of cells to locate, possible values include:
    + 1: input cells.
    + `0x0100000000000001`: input cells with the same running script as current script
    + 2: output cells.
    + `0x0100000000000002`: output cells with the same running script as current script

This syscall locates a witness entry in current transaction based on `source` and `index` value, then use the same step as documented in *Partial Loading* section to feed the serialized value into VM.

The `source` field here, is only used a hint helper for script side. As long as one provides a possible `source` listed above, the corresponding witness entry denoted by `index` will be returned.

This syscall might return the following errors:

* An invalid source value would immediately trigger an VM error and halt execution.
* The syscall would return with `1` as return value if the index value is out of bound.

In case of errors, `addr` and `index` will not contain meaningful data to use.

### Debug
[debug]: #debug

*Debug* syscall has a signature like following:

```c
void ckb_debug(const char* s)
{
  syscall(2177, s, 0, 0, 0, 0, 0);
}
```

This syscall accepts a null terminated string and prints it out as debug log in CKB. It can be used as a handy way to debug scripts in CKB. This syscall has no return value.

# Reference

* [1]: [Molecule Encoding][1]

[1]: ../0008-serialization/0008-serialization.md	"    "