---
id: script-udt
title: UDT合约
sidebar_label: UDT合约
---

### 概述

UDT全称是User Defined Token，用户定义代币，可以理解为Ethereum网络中的Erc20代币。CKB的典型用途之一是在其上发行用户定义代币（UDT）。这意味着任何人都可以设计和创建代表不同类型资产的代币，而不需要从头开始建立一个新的公共区块链。

就像原生代币CKB一样，UDT也存储在Cells中。这意味着你可以像转移CKB代币一样转移UDTs。这与Ethereum不同的是，Ethereum上的UDT（如ERC20或ERC721）是由智能合约账户发行和存储的，因此用户只能通过合约来控制他们的UDT资产，而不是由用户自己直接控制。

> 你已经读到这个文档最有意思的部分了(我认为). **让我们开始吧**

### 编写UDT合约


