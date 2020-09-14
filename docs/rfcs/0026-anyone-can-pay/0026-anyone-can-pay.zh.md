---
id: 0026-anyone-can-pay.zh
title: Anyone-Can-Pay 锁脚本
sidebar_label: 26：Anyone-Can-Pay 锁脚本
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0026 | Standards Track | Proposal | Xuejie Xiao |Nervos Foundation|2020-09-03|

# Anyone-Can-Pay 锁脚本

本 RFC 描述了一种新的 CKB 锁脚本，它可以用来接收任意数量的[最简 UDT](../0025-simple-udt/0025-simple-udt.md) 或者 CKB。以前，当使用默认锁脚本时，一个用户至少向另一个用户转账 61 个 CKBytes，当使用其他锁脚本或类型脚本时可能会更多。当 UDT 方案在 CKB 中落地后，这将成为一个更大的问题：一个原生的 UDT 转账操作，不仅需要 UDTs，还需要一定数量的 CKBytes 来将 UDT 保存在一个 cell 中。

在这里，我们试图通过引入一个新的任何人都可以支付的锁脚本来解决这一问题，它不仅可以通过验证签名来解锁，还可以通过接收任意金额的转账来进行解锁。这样一来，用户就可以使用 anyone-can-pay 锁来向一个 cell 发送任意数量的 CKBytes 或 UDTs，而不是总是创建一个新的 cell。因此，anyone-can pay 锁脚本为上述两个问题提供了一个解决方案。

## 脚本结构

Anyone-can-pay 锁脚本是在默认的 secp256k1-blake2b-sighash-all 锁脚本的基础上，在脚本 args 部分增加了一些内容。新的 Anyone-can-pay 锁脚本可以接受以下任意一种脚本 args 结构：

```
<20 byte blake160 public key hash>
<20 byte blake160 public key hash> <1 byte CKByte minimum>
<20 byte blake160 public key hash> <1 byte CKByte minimum> <1 byte UDT minimum>
```

新增的 CKByte 和 UDT 最小值强制规定了一个人可以转账到 anyone-can-pay 锁脚本的最小数量。这就提供了一个 cell 层面的对 DDoS 攻击的缓解措施：如果一个 cell 使用的是 anyone-can-pay 的锁脚本，那么攻击者就可以不断地创建只向这个 cell 传输 1 个 shannon 或者 1 个 UDT 的交易，从而使得 cell 的所有者很难使用存放在 cell 中的代币。通过设置最小的转账金额，用户可以提高攻击成本，从而保护自己的 cell 免受 DDoS 攻击。当然，这种机制并不能防止所有类型的 DDoS，但它可以作为一种快速的解决方案来缓解更廉价的 DDoS。

CKByte & UDT 的最小值中存储的值，解释如下：如果字段中存储了 `x`，则最小转账额为 `10^x`，例如：

* 如果在 CKByte 的最小值中存储的是 3，则意味着该 cell 可接受的最小量是 1000 shannon。
* 如果在 UDT 的最小值中存储的是 4，则意味着该 cell 可接受的最小金额为 10000 UDT 基本单位。

请注意，最小值字段是完全可选的，如果没有提供最小值，我们将把最小值视为 0，这就意味着没有最小值。如果没有提供最小值，我们将把最小值视为 0，这意味着在转账操作中没有执行最小值。值得一提的是，不同的最小值也会导致单元格使用不同的锁脚本。

## UDT 释义

Anyone-can-pay 锁脚本假定被锁定的 cell 遵循[最简 UDT 规范](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)，因此该 cell 1）有一个类型脚本，2）cell 的 data 部分至少有 16 个字节。用户要确保只使用最简 UDT 规范的类型脚本的 anyone-can-pay 锁脚本。

## 解锁逻辑

Anyone-can-pay 锁脚本将遵循以下规则：

1. 如果提供了签名，它的工作原理和默认的 secp256k1-blake2b-sighash-all 锁脚本完全一样，如果在 witness 中提供了签名，并且可以验证，则锁脚本将返回成功状态。

    1.a. 如果提供的签名没有通过验证，锁脚本将返回错误状态

The anyone-can-pay lock will work following the rules below:

1. If a signature is provided, it works exactly as the default secp256k1-blake2b-sighash-all lock, if a signature is provide in witness and can be validated, the lock returns with a success state.

    1.a. If the provided signature fails validation, the lock returns with an error state

2. If a signature is not provided, the lock continues with the added anyone-can-pay logic below:

    2.a. It loops through all input cells using the current anyone-can-pay lock script(notice here the lock script we refer to include public key hash, meaning if a transaction contains 2 cells using the same anyone-can-pay lock code, but different public key hash, they will be treated as different lock script, and each will perform the script unlock rule checking independently), if 2 input cells are using the same type script, or are both missing type scripts, the lock returns with an error state

    2.b. It loops through all output cells using the current anyone-can-pay lock script, if 2 output cells are using the same type script, or are both missing type scripts, the lock returns with an error state

    2.c. It loops through all input cells and output cells using the current anyone-can-pay lock script, if there is a cell that is missing type script, but has cell data set, it returns with an error state.

    2.d. It loops through all input cells and output cells using the current anyone-can-pay lock script, if there is a cell that has type script, but a cell data part with less than 16 bytes of data, it returns with an error state.

    2.e. It then pairs input cells and output cells with matching type scripts(input cell without type script will match with output cell without type script). If there is an input cell without matching output cell, or if there is an output cell without matching input cell, it returns with an error state.

    2.f. It loops through all pairs of input & output cells, if there is a pair in which the input cell has more CKBytes than the output cell; or if the pair of cells both have type script and cell data part, but the input cell has more UDT than the output cell, it returns with an error state.

    2.g. If CKByte minimum or UDT minimum is set, it loops through all pairs of input & output cells. If it could not find a pair of input & output cells in which the output amount is equal to or more than the input amount plus the set minimum, it returns with an error state. Note only one minimum needs to be matched if both CKByte minimum and UDT minimum are set.

The reason of limiting one input cell and one output cell for each lock/type script combination, is that the lock script should prevent attackers from merging or splitting cells:

* Allowing merging anyone-can-pay cells can result in less cells being available, resulting in usability problems. For example, an exchange might create hundreds of anyone-can-pay cells to perform sharding so deposit transactions are less likely to conflict with each other.
* Allowing splitting anyone-can-pay cells has 2 problems: 1) it increases CKByte usage on chain, putting unwanted pressure on miners; 2) it might result in fee increase when later the owner wants to claim tokens in anyone-can-pay cells, since more input cells than expect would result in both transaction size increase, and validation cycle increase

Giving those considerations, anyone-can-pay lock script here forbids merging or splitting anyone-can-pay cells from non-owners, as allowing more than one input/output anyone-can-pay cell in each lock/type combination would only complicate lock validation rules without significant gains.

## 例子

Here we describe useful transaction examples involving anyone-can-pay lock.

### 创建一个 Anyone-can-pay Cell

```
Inputs:
    Normal Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash A>
Outputs:
    Anyone-can-pay Cell:
        Capacity: 999.99 CKBytes
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash B> <CKByte minimum: 9> <UDT minimum: 5>
        Data:
            Amount: 0 UDT
Witnesses:
    <valid signature for public key hash A>
```

Note here we assume 0.01 CKByte is paid as the transaction fee, in production one should calculate the fee based on factors including transaction size, running cycles as well as network status. 0.01 CKByte will be used in all examples as fees for simplicity. The new anyone-can-pay cell created by this transaction impose a minimum transfer value of 10^9 shannons (10 CKBytes) and 10^5 UDT base units respectively.

### 通过签名进行解锁

```
Inputs:
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 2>
Outputs:
    Normal Cell:
        Capacity: 999.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
Witnesses:
    <valid signature for public key hash A>
```

When a signature is provided, the cell can be unlocked in anyway the owner wants, anyone-can-pay lock here just behaves as a normal cell. In this example an anyone-can-pay cell is converted back to a normal cell.

### 没有类型脚本的 cells 通过 CKB 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 2>
Outputs:
    Deposit Change Cell:
        Capacity: 479.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
    Anyone-can-pay Cell:
        Capacity: 1020 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
Witnesses:
    <valid signature for public key hash B>
```

Here the transaction doesnt contain signature for the anyone-can-pay cell, yet the anyone-can-pay lock succeeds the validation when it detects that someone deposits 20 CKBytes into itself. Note this use case does not involve in UDT at all, anyone-can-pay lock is used to overcome the 61 CKBytes requirement of plain transfer.

### 通过 UDT 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Outputs:
    Deposit Change Cell:
        Capacity: 499.99 CKB
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 199999 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3001 UDT
Witnesses:
    <valid signature for public key hash B>
```

Here we are depositing 1 UDT to the anyone-can-pay cell. Because theres no extra arguments in the anyone-can-pay lock script except a public key hash, the cell enforces no minimum on the CKByte or UDT one can transfer, a transfer of 1 UDT will be accepted here.

### 有最小值的情况下，通过 CKB 支付进行解锁

```
Inputs:
    Deposit Normal Cell:
        Capacity: 500 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1000 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A> <CKByte minimum: 9> <UDT minimum: 5>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Outputs:
    Deposit Change Cell:
        Capacity: 489.99 CKBytes
        Lock:
            code_hash: secp256k1_blake2b lock
            args: <public key hash B>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 200000 UDT
    Anyone-can-pay Cell:
        Capacity: 1010 CKBytes
        Lock:
            code_hash: anyone-can-pay lock
            args: <public key hash A>
        Type:
            code_hash: simple udt lock
            args: <owner lock C>
        Data:
            Amount: 3000 UDT
Witnesses:
    <valid signature for public key hash B>
```

Here CKByte minimum is set to 9, which means in each transaction, one must at least transfers `10^9` shannons, or 10 CKBytes into the anyone-can-pay cell. Note that even though UDT minimum is set to 5, meaning one should at least transfer 100000 UDT base units to the anyone-can-pay cell, satisfying the CKByte minimal transfer minimum alone already satisfy the validation rules, allowing CKB to accept the transaction. Likewise, a different transaction might only send 100000 UDT base units to the anyone-can-pay cell without sending any CKBytes, this will also satisfy the validation rules of anyone-can-pay cell here.

## 注意

An implementation of the anyone-can-pay lock spec above has been deployed to Lina CKB mainnet at [here](https://explorer.nervos.org/transaction/0xd032647ee7b5e7e28e73688d80ffc5fba306ee216ca43be4a762ec7e989a3daa). A cell in the dep group format containing both the anyone-can-pay lock, and the required secp256k1 data cell, is also deployed at [here](https://explorer.nervos.org/transaction/0xa05f28c9b867f8c5682039c10d8e864cf661685252aa74a008d255c33813bb81).

Reproducible build is supported to verify the deploy script. To bulid the deployed anyone-can-pay lock script above, one can use the following steps:

```bash
$ git clone https://github.com/nervosnetwork/ckb-anyone-can-pay
$ cd ckb-anyone-can-pay
$ git checkout deac6801a95596d74e2da8f2f1a6727309d36100
$ git submodule update --init
$ make all-via-docker
```

Now you can compare the simple udt script generated at `spec/cells/anyone_can_pay` with the one deployed to CKB, they should be identical.

A draft of this specification has already been released, reviewed, and discussed in the community at [here](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438) for quite some time.
