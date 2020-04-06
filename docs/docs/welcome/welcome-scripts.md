---
id: welcome-scripts
title: 常用链上脚本
sidebar_label: 常用链上脚本
---

## CKB 主网

### `lock`：Secp256k1_blake160_sighash_all

源代码：[secp256k1_blake160_sighash_all.c](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c)

```js
Lock {
    Code_hash: 0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c
    OutPoint.Index: 0
    DepType: dep_group
}
```

### `type`：Nervos DAO

源代码：[dao.c](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/dao.c)

```js
Type {
    Code_hash: 0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c
    OutPoint.Index: 2
    DepType: code
}
```

---

## CKB 测试网

### `lock`：Secp256k1_blake160_sighash_all

源代码：[secp256k1_blake160_sighash_all.c](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c)

```js
Lock {
    Code_hash: 0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e
    OutPoint.Index: 0
    DepType: dep_group
}
```

### `lock`：Secp256k1_blake160_multisig_all

源代码：[secp256k1_blake160_multisig_all.c](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c)

```js
Lock {
    Code_hash: 0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e
    OutPoint.Index: 1
    DepType: dep_group
}
```

### `type`：Nervos DAO

源代码：[dao.c](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/dao.c)

```js
Type {
    Code_hash: 0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0x96fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d
    OutPoint.Index: 2
    DepType: code
}
```

### `type`：simple_udt

源代码：[simple_udt.c](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c)

```js
Type {
    Code_hash: 0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212,
    Hash_type: data
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0xa18868d6dc6bd7b1a40a515dd801709baec6f64fdf9455e3f9f4c6393b9e8477
    OutPoint.Index: 0
    DepType: code
}
```

### `lock`：anyone-can-pay

源代码：[anyone_can_pay.c](https://github.com/nervosnetwork/ckb-anyone-can-pay/blob/master/c/anyone_can_pay.c)

```js
Lock {
    Code_hash: 0x6a3982f9d018be7e7228f9e0b765f28ceff6d36e634490856d2b186acf78e79b,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps {
    OutPoint.TxHash: 0x9af66408df4703763acb10871365e4a21f2c3d3bdc06b0ae634a3ad9f18a6525
    OutPoint.Index: 0
    DepType: dep_group
}
```

### `lock`：secp256k1_keccak256_sighash_all.c

此脚本来自于 [Lay2 团队](https://lay2.dev/)，源代码：[secp256k1_keccak256_sighash_all.c](https://github.com/lay2dev/pw-lock/blob/master/c/secp256k1_keccak256_sighash_all.c)

```js
Lock {
    Code_hash: 0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08,
    Hash_type: type
}

//////////////////////////////////////////////////////////////////////////////////

Deps{
    OutPoint.TxHash: 0x25635bf587adacf95c9ad302113648f89ecddc2acfe1ea358ea99f715219c4c5
    OutPoint.Index: 0
    DepType: code
}
```

