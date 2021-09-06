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

如上所述，*Exit* 系统调用的函数签名如下：

```c
void exit(int8_t code)
{
  syscall(93, code, 0, 0, 0, 0, 0);
}
```

因为 CKB VM 不支持从该函数中返回值，所以*Exit* 系统调用不需要返回值。当接收到这个系统调用时， CKB VM 将使用指定的返回码终止执行。这是在 CKB VM 中正确退出脚本的唯一方法。

### Load Transaction Hash
[load transaction hash]: #load-transaction-hash

*Load Transaction Hash* 系统调用的函数签名如下：

```c
int ckb_load_tx_hash(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2061, addr, len, offset, 0, 0, 0);
}
```

此处使用的参数：

- `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

该系统调用会计算出当前交易的哈希值，并根据局部加载工作流将其复制到 VM 内存空间。

### Load Transaction
[load transaction]: #load-transaction

*Load Transaction* 系统调用的函数签名如下：

```c
int ckb_load_transaction(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2051, addr, len, offset, 0, 0, 0);
}
```

此处使用的参数：

- `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

该系统调用将包含运行脚本的完整交易序列化为Molecule Encoding [1] 格式，然后根据局部加载工作流将其复制到 VM 内存空间。

### Load Script Hash
[load script hash]: #load-script-hash

*Load Script Hash* 系统调用的函数签名如下：

```c
int ckb_load_script_hash(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2062, addr, len, offset, 0, 0, 0);
}
```

此处使用的参数：

- `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

该系统调用将计算当前运行脚本的哈希值，然后根据局部加载工作流将其复制到 VM 内存空间。

### Load Script
[load script]: #load-script

*Load Script* syscall 系统调用的函数签名如下：

```c
int ckb_load_script(void* addr, uint64_t* len, size_t offset)
{
  return syscall(2052, addr, len, offset, 0, 0, 0);
}
```

此处使用的参数：

- `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

该系统调用将当前运行脚本序列化为Molecule Encoding [1] 格式，然后根据局部加载工作流将其复制到 VM 内存空间。

### Load Cell
[load cell]: #load-cell

*Load Cell* syscall 系统调用的函数签名如下：

```c
int ckb_load_cell(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2071, addr, len, offset, index, source, 0);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。
* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
    + 1：输入 cells
    + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
    + 2：输出 cells
    + `0x0100000000000002`：运行脚本与当前脚本相同的输出 cells
    + 3：dep cells.

该系统调用将根据 `source` 和 `index` 的值来定位当前交易中的 cell，将整个 cell 序列化为 Molecule Encoding [1] 格式，然后使用与【局部加载】部分中所描述的相同步骤将序列化的值传送给 VM 。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Cell By Field
[load cell by field]: #load-cell-by-field

*Load Cell By Field* 系统调用的函数签名如下：

```c
int ckb_load_cell_by_field(void* addr, uint64_t* len, size_t offset,
                           size_t index, size_t source, size_t field)
{
  return syscall(2081, addr, len, offset, index, source, field);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
    + 1：输入 cells
    + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
    + 2：输出 cells
    + `0x0100000000000002`：运行脚本与当前脚本相同的输出 cells
    + 3：dep cells.
* `field`：表示要读取的 cell 字段标志，可能的值如下：
    + 0： 容量，以 64 位无符号大端整数值表示。
    + 1：数据哈希值。
    + 2：Molecule Encoding 格式的锁脚本（lock script）
    + 3：锁脚本哈希值。
    + 4：Molecule Encoding 格式的类型脚本。
    + 5：类型脚本哈希值。
    + 6：占用了的容量值， 以 64 位无符号小端整数值表示。

该系统调用会跟 *Load Cell* 系统调用一样，定位当前交易中的 cell，然后获取 `field` 值对应的数据。数据会使用【局部加载】工作流传送到 VM 内存空间。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。
- 无效的 `field`  值会立即触发一个 VM 错误并终止执行。
- 在某些情况下，如果缺少某些值（例如在没有类型脚本的 cell 中请求类型），系统调用将返回 `2` 作为返回值。

### Load Cell Data
[load cell Data]: #load-cell-data

*Load Cell Data* 系统调用的函数签名如下：

```c
int ckb_load_cell_data(void* addr, uint64_t* len, size_t offset,
                       size_t index, size_t source)
{
  return syscall(2092, addr, len, offset, index, source, 0);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
  + 2：输出 cells
  + `0x0100000000000002`：运行脚本与当前脚本相同的输出 cells
  + 3：dep cells.

该系统调用会跟 *Load Cell* 系统调用一样，定位当前交易中的 cell，然后定位 cell 的数据部分。cell 数据会使用【局部加载】工作流传送给 VM 内存空间。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Cell Data As Code
[load cell Data As Code]: #load-cell-data-as_code

*Load Cell Data* 系统调用的函数签名如下：

```c
int ckb_load_cell_data_as_code(void* addr, size_t memory_size, size_t content_offset,
                               size_t content_size, size_t index, size_t source)
{
  return syscall(2091, addr, memory_size, content_offset, content_size, index, source);
}
```

此处使用的参数：

* `addr`：指向虚拟机内存空间中用于存放加载代码的缓冲区的指针，必须满足 4KB 对齐。
* `memory_size`：用于存放代码的内存缓冲区大小，必须是4KB的倍数。
* `content_offset`：载入 cell 数据的代码起始偏移量。
* `content_size`：要载入 cell 数据的代码内容的大小。
* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
    + 1：输入 cells
    + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
    + 2：输出 cells
    + `0x0100000000000002`：运行脚本与当前脚本相同的输出 cells
    + 3：dep cells.

该系统调用会像 *Load Cell* 系统调用一样，定位当前交易的 cell，然后定位 cell 的数据部分。不过跟 *Load Cell Data* 系统调用不同，该系统调用会将请求的 cell 数据内容加载到 VM 内存中，并且标记已加载的内存页为可执行的。然后 CKB VM 就可以跳转到已加载的内存页，执行已加载的代码。这可以用来实现 CKB VM 中的动态链接（dynamic linking）。

注意，该系统调用未实现【局部加载】工作流。

目前，标记为可执行的内存页不能还原为不可执行的内存页。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

*  `addr` 或者 `memory_size`  的不对齐会马上触发 VM 错误并终止执行。
* `content_offset` 或者 `content_size` 值的溢出，会马上触发 VM 错误并终止执行。
* `content_size` 不能大于 `memory_size`，否则会马上触发 VM 错误并终止执行。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

具体使用该系统调用的例子，可参考 [本脚本](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/0759a656c20e652e9ad2711fde0ed96ce9f1130b/c/or.c)。

### Load Input
[load input]: #load-input

*Load Input* 系统调用的函数签名如下：

```c
int ckb_load_input(void* addr, uint64_t* len, size_t offset,
                   size_t index, size_t source)
{
  return syscall(2073, addr, len, offset, index, source, 0);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells

该系统调用会基于 `source` 和 `index` 值定位当前交易中的输入 cell ，序列化整个输入 cell 为 Molecule Encoding 格式，然后使用【局部加载】小节中的方式将序列化值传送给 VM。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

* 当 `source` 字段使用了 `output cells` 或者 `dep cells` 时，该系统调用会返回 `2`，因为输入 cell 只存在于输入 cells。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Input By Field
[load input by field]: #load-input-by-field

*Load Input By Field* 系统调用的函数签名如下：

```c
int ckb_load_input_by_field(void* addr, uint64_t* len, size_t offset,
                            size_t index, size_t source, size_t field)
{
  return syscall(2083, addr, len, offset, index, source, field);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells

* `field`：表示要读取的输入的`field` 标识，可能的值如下：
    + 0：Molecule Encoding 格式的 out_point 
    + 1：since，以无符号的64位小端模式的整数值表示。

该系统调用会跟 *Load Cell* 系统调用一样，定位当前交易中的输入 cell，然后获取 `field` 值对应的数据。数据会使用【局部加载】工作流传送到 VM 内存空间。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

* 当 `source` 字段使用了 `output cells` 或者 `dep cells` 时，该系统调用会返回 `2`，因为输入 cell 只存在于输入 cells。
* 无效的 `field`  值会立即触发一个 VM 错误并终止执行。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Header
[load header]: #load-header

*Load Header* 系统调用的函数签名如下：

```c
int ckb_load_header(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2072, addr, len, offset, index, source, 0);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
  + 4：header deps.

该系统调用将基于 `source` 和 `index` 值定位与输入 cell 或者 header dep 相关的 header，然后序列化整个 header 为 Molecule Encoding [1] 格式，使用【局部加载】小节中的方式将序列化值传送给 VM。

请注意，当你在加载与输入 cell 相关的 header 时，header hash 仍然应该包含在当前交易的 `header deps` 中。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

* 如果请求输入 cell 的 header，但 `header deps`  中缺少输入 cell 的 header hash，则系统调用将返回 `2`。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Header By Field
[load header by field]: #load-header-by-field

*Load Header By Field* 系统调用的函数签名如下：

```c
int ckb_load_header_by_field(void* addr, uint64_t* len, size_t offset,
                             size_t index, size_t source, size_t field)
{
  return syscall(2082, addr, len, offset, index, source, field);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
  + 4：header deps.

* `field`：表示要读取的输入的`field` 标识，可能的值如下：
    + 0：当前 epoch 值，以无符号的64位小端模式的整数值表示。
    + 1：当前 epoch 的首个区块高度，以无符号的64位小端模式的整数值表示。
    + 2：epoch 长度，以无符号的64位小端模式的整数值表示。

该系统调用将基于 `source` 和 `index` 值定位与输入 cell 或者 header dep 相关的 header，然后获取 `field` 值对应的数据。数据会使用【局部加载】工作流传送到 VM 内存空间。

请注意，当你在加载与输入 cell 相关的 header 时，header hash 仍然应该包含在当前交易的 `header deps` 中。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

* 如果请求输入 cell 的 header，但 `header deps`  中缺少输入 cell 的 header hash，则系统调用将返回 `2`。
* 无效的 `field`  值会立即触发一个 VM 错误并终止执行。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Load Witness
[load witness]: #load-witness

*Load Witness* 系统调用的函数签名如下：

```c
int ckb_load_witness(void* addr, uint64_t* len, size_t offset, size_t index, size_t source)
{
  return syscall(2074, addr, len, offset, index, source, 0);
}
```

此处使用的参数：

* `addr`， `len` 和 `offset` 的用法跟【局部加载】小节中的说明一致。

* `index`：一个索引值，表示要读取的条目索引。
* `source`：表示要定位的 cell 的来源标志，可能的值如下：
  + 1：输入 cells
  + `0x0100000000000001`：运行脚本与当前脚本相同的输入 cells
  + 2：输出 cells
  + `0x0100000000000002`：运行脚本与当前脚本相同的输出 cells

该系统调用将基于 `source` 和 `index` 值定位当前交易的见证条目，然后使用【局部加载】小节的方式将序列化值传送给 VM。

`source` 字段在这里是作为脚本的一个提示帮助，只要提供上面列出的  `source` ，就会返回相应的由索引表示的见证条目。

该系统调用可能会返回以下错误：

- 无效的 `source`  值会立即触发一个 VM 错误并终止执行。
- 如果 `index` 值溢出，系统调用将返回 `1` 。

如果出现错误， `addr` 和 `index`  将不包含有效数据。

### Debug
[debug]: #debug

*Debug* 系统调用的函数签名如下：

```c
void ckb_debug(const char* s)
{
  syscall(2177, s, 0, 0, 0, 0, 0);
}
```

This syscall accepts a null terminated string and prints it out as debug log in CKB. It can be used as a handy way to debug scripts in CKB. This syscall has no return value.

该系统调用一个以 null 结束的字符串，并在 CKB 中以调试日志的形式打印出来。可以作为调试 CKB 中的脚本的方式，该系统条用没有返回值。

# 参考引用

* [1]: [Molecule Encoding][1]

[1]: ../0008-serialization/0008-serialization.zh	"    "