---
id: 0008-serialization.zh
title: 序列化
sidebar_label: 08：序列化
---

| Number | Category        | Status   | Author    | Organization      | Created    |
| ------ | --------------- | -------- | --------- | ----------------- | ---------- |
| 0008   | Standards Track | Proposal | Boyu Yang | Nervos Foundation | 2018-12-17 |

# 序列化

CKB 主要使用两种序列化格式： [Molecule][molecule] 和 [JSON][json]。

[Molecule][molecule] 是一种规范化的零拷贝序列化格式，其当前仍处于实验阶段，我们对其做了一些小修改。

[JSON][json]  主要通过  [JSON-RPC][jsonrpc] 用于节点 RPC 服务中。

## Molecule

### 概览

#### 固定大小/动态大小

| 类型 | byte | array | struct | vector | table | option | union |
| ---- | ---- | ----- | ------ | ------ | ----- | ------ | ----- |
| 大小 | 固定 | 固定  | 固定   | 动态   | 动态  | 动态   | 动态  |

#### Memory Layout 内存布局

| Type   | Header                                               | Body                                 |
| ------ | ---------------------------------------------------- | ------------------------------------ |
| array  |                                                      | item-0 \|  item-1 \| ... \|  item-N  |
| struct |                                                      | field-0 \| field-1 \| ... \| field-N |
| fixvec | items-count                                          | item-0 \|  item-1 \| ... \|  item-N  |
| dynvec | full-size \| offset-0 \| offset-1 \| ... \| offset-N | item-0 \|  item-1 \| ... \|  item-N  |
| table  | full-size \| offset-0 \| offset-1 \| ... \| offset-N | field-0 \| field-1 \| ... \| field-N |
| option |                                                      | item or none (zero bytes)            |
| union  | item-type-id                                         | item                                 |

- 头中的所有子项都会小端模式的32位无符号整数。

### 基本类型

#### `byte` 字节

The `byte` is a byte.

##### 例子

`00` is a `byte`.

### 复合类型

#### `array`

 `array` 是一种固定大小的类型：固定大小的内部类型以及固定的长度。

 `array`  的大小为内部类型的大小乘以  `array` 的长度。

序列化 `array` 只需要序列化其内部所有子项。

序列化数组没有开销，因为 `array` 连续存储所有子项，在两个相邻的子项之间没有额外的空间。

##### 例子

如果我们定义数组 ` Byte3 [byte; 3];`，我们要存储三个字节：第一个是01，第二个是02，最后一个是03，然后序列化得到的字节为： `01 02 03`。

如果我们定义数组 ` Uint32 [byte; 4];` ，我们要用小端模式存储一个32位无符号整数  `0x01020304` ，那么序列化得到的字节为  `04 03 02 01`：

如果我们定义数组  ` TwoUint32 [Uint32; 2]`;，我们要用小端模式存储两个32位无符号整数：第一个是 `0x01020304`，第二个是 `0xabcde`，那么序列化得到的字节为  `04 03 02 01 de bc 0a 00`。

#### `struct` 结构体

 `struct`  是一种固定大小的类型：结构体中的所有字段都是固定大小，并且字段数量也固定。结构体的大小为所有字段大小的总和。

序列化一个结构体只需要序列化其中的所有字段。结构体中的字段按照各自声明的顺序存储。

序列化结构体没有开销，结构体连续存储所有字段，在两个相邻的子项之间没有额外的空间。

##### 例子

如果我们定义结构体  `OnlyAByte { f1: byte }`, 我们想要存储一个字节 `ab`，那么序列化得到的字节为 `ab`。

如果我们定义结构体 `ByteAndUint32 { f1: byte, f2: Uint32 }`, 我们想要存储一个字节 `ab` 以及小端模式的32位无符号整数 `0x010203` ，那么序列化得到的字节为 `ab 03 02 01 00`。

#### vectors 向量

向量有分：固定向量 `fixvec` 和动态向量 `dynvec`。

向量是固定还是动态取决于其内部子项的类型：如果内部子项为固定大小，那么为固定向量；反之则为动态向量。

 `fixvec` 和`dynvec` 都属于动态大小类型。

##### `fixvec` - fixed vector 固定向量

序列化固定向量分两步：

1. 以小端模式的32位无符号整数序列化其长度
2. 序列化其所有子项

##### 例子

如果我们定义向量  `Bytes <byte>;`:

- 空字节序列化得到的字节为 `00 00 00 00` （任何空固定向量的长度都为 0 ）
- `0x12`  序列化得到的字节为 `01 00 00 00, 12`。
- `0x1234567890abcdef` 序列化得到的字节为 `08 00 00 00, 12 34 56 78 90 ab cd ef`。

如果我们定义向量  `Uint32Vec <Uint32>;`:

- 空 `Uint32Vec` 序列化得到的字节为 `00 00 00 00` 

- `0x123`序列化得到的字节为 `01 00 00 00, 23 01 00 00`.

- `[0x123, 0x456, 0x7890, 0xa, 0xbc, 0xdef]` 序列化得到的字节为：

  ```
  # there are 6 items
  06 00 00 00
  # six items
  23 01 00 00, 56 04 00 00, 90 78 00 00, 0a 00 00 00, bc 00 00 00, ef 0d 00 00
  ```

##### `dynvec` - dynamic vector 动态向量

序列化动态向量分三步：

1. 以小端模式的32位无符号整数序列化完整大小
2. 以小端模式的32位无符号整数序列化所有子项的偏移
3. 序列化向量的所有子项

##### 例子

如果我们定义向量  `BytesVec <Bytes>;`:

- 空向量 `BytesVec`  序列化得到的字节为 `04 00 00 00`（空动态向量的完整大小为 4 字节）

- `[0x1234]` 序列化得到的字节为：

  ```
  # the full size is 14 bytes
  0e 00 00 00
  # one offset
  08 00 00 00
  # one item
  02 00 00 00 12 34
  ```

- `[0x1234, 0x, 0x567, 0x89, 0xabcdef]` 序列化得到的字节为：

  ```
  # the full size is 52 (0x34) bytes
  34 00 00 00
  # five offsets (20 bytes in total)
  18 00 00 00, 1e 00 00 00, 22 00 00 00, 28 00 00 00, 2d 00 00 00
  # five items (28 bytes in total)
  02 00 00 00, 12 34
  00 00 00 00,
  02 00 00 00, 05 67
  01 00 00 00, 89
  03 00 00 00, ab cd ef
  ```

#### `table` 表

 `table` 是一种动态大小的类型，可将它视为动态向量，只不过长度固定。

序列化步骤与动态向量一样：

1. 以小端模式的32位无符号整数序列化完整大小
2. 以小端模式的32位无符号整数序列化所有子项的偏移
3. 按照字段各自声明的顺序，序列化其所有字段

##### 例子

如果我们定义表格 `MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }`

- 序列化  `MixedType { f1: 0x, f2: 0xab, f3: 0x123, f4: 0x456789, f5: 0xabcdef }`  得到的字节为：

  ```
  # the full size is 43 (0x2b) bytes
  2b 00 00 00
  # five offsets (20 bytes in total)
  18 00 00 00, 1c 00 00 00, 1d 00 00 00, 21 00 00 00, 24 00 00 00
  # five items (19 bytes in total)
  00 00 00 00
  ab
  23 01 00 00
  45 67 89
  03 00 00 00, ab cd ef
  ```

#### `option` 选项

 `option` 是一种动态大小的类型

序列化  `option` 取决于其是否为空：

- 如果为空，则为 0 字节（大小为 0）
- 如果不为空，只需要序列化其内部子项（大小等于其内部子项的大小）

##### 例子

如果我们定义选项 `BytesVecOpt (BytesVec);`

- 序列化 `None` 得到的字节为空

- 序列化 `Some([])` 得到的字节为 `04 00 00 00`.

- 序列化 `Some([0x])` 得到的字节为

  ```
  # the full size of BytesVec is 12 bytes
  0c 00 00 00
  # the offset of Bytes
  08 00 00 00
  # the length of Bytes
  00 00 00 00
  ```

#### `union`共同体

 `union` 是一种动态大小的类型。

序列化 `union` 分两步：

- 以小端模式的32位无符号整数序列化 item-type-id，item-type-id 为内部子项的索引，从 0 开始。
- 序列化内部子项

##### 例子

如果我们定义共同体 `HybridBytes { Byte3, Bytes, BytesVec, BytesVecOpt }`



- 序列化 `Byte3 (0x123456)` 得到的字节为 `00 00 00 00, 12 34 56`

- 序列化 `Bytes (0x)` 得到的字节为 `01 00 00 00, 00 00 00 00`

- 序列化 `Bytes (0x123)` 得到的字节为 `01 00 00 00, 02 00 00 00, 01 23`

- 序列化 `BytesVec ([])` 得到的字节为`02 00 00 00, 04 00 00 00`

- 序列化 `BytesVec ([0x])` 得到的字节为 `02 00 00 00, 0c 00 00 00, 08 00 00 00, 00 00 00 00`

- 序列化 `BytesVec ([0x123])` 得到的字节为  `02 00 00 00, 0e 00 00 00, 08 00 00 00, 02 00 00 00, 01 23`

- 序列化 `BytesVec ([0x123, 0x456])` 得到的字节为 

  ```
  # Item Type Id
  02 00 00 00
  # the full size of BytesVec is 24 bytes
  18 00 00 00
  # two offsets of BytesVec (8 bytes in total)
  0c 00 00 00, 12 00 00 00,
  # two Bytes (12 bytes in total)
  02 00 00 00, 01 23
  02 00 00 00, 04 56
  ```

- 序列化 `BytesVecOpt (None)`  得到的字节为  `03 00 00 00`

- 序列化  `BytesVecOpt (Some(([])))` 得到的字节为 `03 00 00 00, 04 00 00 00`

- 序列化 `BytesVecOpt (Some(([0x])))`  得到的字节为 `03 00 00 00, 0c 00 00 00, 08 00 00 00, 00 00 00 00`

- 序列化 `BytesVecOpt (Some(([0x123])))`  得到的字节为 `03 00 00 00, 0e 00 00 00, 08 00 00 00, 02 00 00 00, 01 23`

- 序列化 `BytesVecOpt (Some(([0x123, 0x456])))`  得到的字节为 

  ```
  # Item Type Id
  03 00 00 00
  # the full size of BytesVec is 24 bytes
  18 00 00 00
  # two offsets of BytesVec (8 bytes in total)
  0c 00 00 00, 12 00 00 00,
  # two Bytes (12 bytes in total)
  02 00 00 00, 01 23
  02 00 00 00, 04 56
  ```



[molecule]: #molecule
[json]: https://www.json.org
[jsonrpc]: https://www.jsonrpc.org/specification