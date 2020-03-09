---
id: about-ckb
title: CKB 是什么
sidebar_label: CKB 是什么
---

CKB 是 Nervos Network 的 Layer1 层的原生 Token 的名称。对于 CKB 这个缩写，目前主要有两种同样合理的释义：

第一种，CKB 是（**Common Knowledge Base** 共同知识库）的缩写，所谓的共同知识就是每个人都能知道，也知道其他人几乎都知道的知识。在区块链世界里，共同知识指的是经过全球共识验证并且网络中的所有人接受的「状态」。

第二种，CKB 是（**Common Knowledge Byte** 共同知识字节）的缩写，前面的“共同知识”同第一种解释是一样的，而最后的 Base 被替换成为了 Byte 字节（字节：是计算机内用于计量存储容量的一种计量单位），Byte 赋予了 CKB 实际的物理意义，演变成为了 CKByte，CKByte 是所有人用来存储共同知识的物理空间，所以 1 CKB = 1 Byte。

Nervos CKB 是 Layer1 的区块链，储存所有类型的共同知识，而不像比特币一样只局限于货币，CKB 还可以存储有价值的密码学证明，为更上层（Layer2）的协议提供安全性。

比特币和 NervosCKB 都是共同知识的存储和验证系统。比特币的是UTXO 集，透过其脚本进行验证。NervosCKB 泛化了比特币的数据结构和脚本功能，将其全局状态存储为一组可编程的单元（我们称之为 Cell），并通过虚拟机来运行用户自定义的图灵完备脚本来验证他的状态转换。