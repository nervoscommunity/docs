---
id: 0011-transaction-filter-protocol.zh
title: 交易过滤协议
sidebar_label: 11：交易过滤协议
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0011 | Standards Track | Proposal | Quake Wang |Nervos Foundation|2018-12-11|

# 交易过滤协议

## 摘要

交易过滤协议能够减少节点所需要发送的交易数据量。节点想要接收特定类型的交易，可以在连接中设置过滤选项。过滤选项将作为布隆过滤器作用于交易数据上。

## 目的

交易过滤协议的目的是让低性能的节点（智能手机、浏览器插件、内嵌设备等）能够实现同步链上某些特定交易的最新状态或者验证交易的执行情况。

这些节点无需验证完整的区块链数据，只需检查区块头连接是否正确，并相信难度最高的区块中的交易是有效的。

如果没有这个协议，节点必须下载完整区块并且接收所有交易广播，然后扔掉大部分交易。这反而减慢了同步进度，浪费了用户带宽，增加了内存使用量。

## 消息

*消息的系列化格式为[Molecule ](../0008-serialization/0008-serialization.zh)*

### SetFilter

在接收到 `SetFilter` 消息后，远程节点会立即限制其广播的交易，只广播与过滤器匹配的交易，匹配算法如下：

```
table SetFilter {
    filter: [uint8];
    num_hashes: uint8;
    hash_seed: uint32;
}
```

`filter`：一个任意大小的字节对齐的位字段，最大为 36,000 字节。 

`num_hashes`：该过滤器中使用的哈希函数的数量。这个字段允许的最大值是20。这个最大值和 `filter` 最大值同时使用的情况下，能够存储约10,000个子项，误判率为0.0001%。 

`hash_seed`：我们在本协议中使用 [Kirsch-Mitzenmacher-Optimization](https://www.eecs.harvard.edu/~michaelm/postscripts/tr-02-05.pdf) 哈希函数，`hash_seed ` 为随机偏移量，`h1  ` 为低位 uint32 的哈希值，`h2  ` 为高位 uint32 的哈希值，第 n 个哈希值为 `（hash_seed+h1+n*h2）mod filter_size`。 

### AddFilter

当收到 `AddFilter` 消息时，给定的位数据将通过 “按位或” 运算符添加到当前的过滤器中。该过滤器必须是之前已经用 `SetFilter` 提供过的。如果新过滤器被添加到节点时，节点的网络连接是开放的，则消息是有效的，也避免了重新计算和发送全新过滤器给所有节点的必要。

```
table AddFilter {
    filter: [uint8];
}
```

`filter`：一个任意大小的字节对齐的位字段，数据大小必须大于或等于之前提供的过滤器大小。 

### ClearFilter

`ClearFilter` 消息告诉接收节点移除此前设置的布隆过滤器。

```
table ClearFilter {
}
```

`ClearFilter` 消息无需参数。


### FilteredBlock

设置好过滤器后，节点不只是停止广播匹配不上的交易，它们也可以提供过滤后的区块消息。这种消息是同步协议中的 `Block` 消息和中继协议中的  `CompactBlock` 的替代品。

```
table FilteredBlock {
    header: Header;
    transactions: [IndexTransaction];
    hashes: [H256];
}

table IndexTransaction {
    index:                      uint32;
    transaction:                Transaction;
}
```

`header`：标准区块头结构。

`transactions`：标准交易结构以及交易索引。

`hashes`：部分默克尔树分支证明。

## 过滤匹配算法

过滤器测试适用于所有的广播交易，我们使用以下算法来确定一个交易是否匹配过滤器。一旦匹配，算法就会中止。

1. 测试交易本身哈希值。
2. 对于每个 CellInput，测试 `previous_output` 的哈希值。
3. 对于每个 CellOutput, 测试脚本的 `lock hash` 和 `type hash` 。
4. 以上都不满足，就是不匹配。
