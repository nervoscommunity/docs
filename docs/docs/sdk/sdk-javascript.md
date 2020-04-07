---
id: sdk-javascript
title: JavaScript SDK
sidebar_label: JavaScript SDK
---

## SDK 介绍

`@nervosnetwork/ckb-sdk-core` 是用于与 [Nervos CKB](https://github.com/nervosnetwork/ckb) 交互的 JavaScript SDK，目前支持：

本地钱包管理、数字身份管理、数字资产管理、智能合约部署和调用以及资产转账等等。未来还将支持更丰富的功能和应用。

## 主要功能
* 钱包文件规范
* 数字身份及可信声明
* 数字资产
* 智能合约的部署和调用
* 错误码

## 安装

```shell
$ yarn add @nervosnetwork/ckb-sdk-core # install the SDK into your project
```

## Modules

JS SDK 包含以下几个模块:

### RPC

[RPC Code](https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-sdk-rpc)

RPC 模块用于与 Nervos RPC 进行交互，完整 RPC 列表可在 [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs) 找到。

接口在该模块 `DefaultRPC` 类中。

### Utils

[Utils Code](https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-sdk-utils)

Utils 模块提供了 SDK 的常用功能。

### Types

[Types Code](https://github.com/nervosnetwork/ckb-sdk-js/tree/develop/packages/ckb-types)

Types 模块用于根据 [CKB Project](https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs) 项目提供 CKB 组件的类型定义.

CKB Project 编译为 snake case 形式，在 RPC 模块中的 type/CKB_RPC 中列出。

TypeScript 编译为 PascalCase 形式，在此模块中列出。

## 与节点进行长链接

请添加 `httpAgent` 或 `httpsAgent` 来开启长连接。

如果 SDK 是运行在 `NodeJS` 环境中，请参考如下示例:

```javascript
// HTTP Agent
const http = require('http')
const httpAgent = new http.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpAgent })

// HTTPS Agent
const https = require('https')
const httpsAgent = new https.Agent({ keepAlive: true })
ckb.rpc.setNode({ httpsAgent })
```

## 示例

### 发送交易

[源代码](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendSimpleTransaction.js)

<details>
<summary>点击直接查看示例代码</summary>

```js
/* eslint-disable */
const CKB = require('../lib').default

const bootstrap = async () => {
  const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url
  const privateKey = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
  const blockAssemblerCodeHash = '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2' // transcribe the block_assembler.code_hash in the ckb.toml from the ckb project

  const ckb = new CKB(nodeUrl) // instantiate the JS SDK with provided node url

  const secp256k1Dep = await ckb.loadSecp256k1Dep() // load the dependencies of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  /**
   * to see the public key
   */
  // console.log(`Public key: ${publicKey}`)

  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`
  /**
   * to see the public key hash
   */
  // console.log(`Public key hash: ${publicKeyHash}`)

  const addresses = {
    mainnetAddress: ckb.utils.pubkeyToAddress(publicKey, {
      prefix: 'ckb'
    }),
    testnetAddress: ckb.utils.pubkeyToAddress(publicKey, {
      prefix: 'ckt'
    })
  }

  /**
   * to see the addresses
   */
  // console.log(JSON.stringify(addresses, null, 2))

  /**
   * calculate the lockHash by the address publicKeyHash
   * 1. the publicKeyHash of the address is required in the args field of lock script
   * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
   * 3. calculate the hash of lock script via ckb.utils.scriptToHash method
   */

  const lockScript = {
    hashType: "type",
    codeHash: blockAssemblerCodeHash,
    args: publicKeyHash,
  }
  /**
   * to see the lock script
   */
  // console.log(JSON.stringify(lockScript, null, 2))

  const lockHash = ckb.utils.scriptToHash(lockScript)
  /**
   * to see the lock hash
   */
  // console.log(lockHash)

  // method to fetch all unspent cells by lock hash
  const unspentCells = await ckb.loadCells({
    lockHash
  })

  /**
   * to see the unspent cells
   */
  // console.log(unspentCells)

  /**
   * send transaction
   */
  const toAddress = ckb.utils.privateKeyToAddress("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", {
    prefix: 'ckt'
  })

  const rawTransaction = ckb.generateRawTransaction({
    fromAddress: addresses.testnetAddress,
    toAddress,
    capacity: BigInt(600000000000),
    fee: BigInt(100000),
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
  })

  rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x')
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: ''
  }

  const signedTx = ckb.signTransaction(privateKey)(rawTransaction)
  /**
   * to see the signed transaction
   */
  // console.log(JSON.stringify(signedTx, null, 2))

  const realTxHash = await ckb.rpc.sendTransaction(signedTx)
  /**
   * to see the real transaction hash
   */
  console.log(`The real transaction hash is: ${realTxHash}`)
}

bootstrap()
```
</details>

### 发送所有余额

[源代码](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendAllBalance.js)

<details>
<summary>点击直接查看示例代码</summary>

```js
/* eslint-disable */
const CKB = require("../lib").default
const nodeUrl = process.env.NODE_URL || "http://localhost:8114" // example node url
const ckb = new CKB(nodeUrl)

const privateKey =
  process.env.PRIV_KEY ||
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // example private key

const address = ckb.utils.privateKeyToAddress(privateKey)

const unspentCells = [
  {
    blockHash:
      "0x8810cc8f199ea0167ea592071f61b9b5b66f915ea982f30a96a95a59df7f15ca",
    lock: {
      codeHash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hashType: "type",
      args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6",
    },
    outPoint: {
      txHash:
        "0xdf45112919d4af12b10fed94a93798ae6ddd8c89a11d90980022dcf695babca9",
      index: "0x0",
    },
    capacity: "0x2540be400",

    dataHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    status: "live",
    type: null,
  },
  {
    blockHash:
      "0x8810cc8f199ea0167ea592071f61b9b5b66f915ea982f30a96a95a59df7f15ca",
    lock: {
      codeHash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hashType: "type",
      args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6",
    },
    outPoint: {
      txHash:
        "0xdf45112919d4af12b10fed94a93798ae6ddd8c89a11d90980022dcf695babca9",
      index: "0x1",
    },
    capacity: "0x2540be400",
    dataHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    status: "live",
    type: null,
  },
]

const generateRawTransaction = async () => {
  await ckb.loadSecp256k1Dep()
  const rawTx = ckb.generateRawTransaction({
    fromAddress: address,
    toAddress: address,
    capacity: BigInt(19999999900),
    fee: BigInt(100),
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
    changeThreshold: BigInt(0),
  })
  console.group("generate raw tx")
  // console.info(`raw transaction: ${JSON.stringify(rawTx, null, 2)}`)
  console.info(
    `inputs capacity:
    ${rawTx.inputs
      .map(
        input =>
          unspentCells.find(
            cell =>
              cell.outPoint.txHash === input.previousOutput.txHash &&
              cell.outPoint.index === input.previousOutput.index,
          ).capacity,
      )
      .map(capacity => BigInt(capacity))}
    `,
  )
  console.info(
    `outputs capacity: ${rawTx.outputs.map(output => BigInt(output.capacity))}`,
  )
  console.groupEnd()
  return rawTx
}

const sendAllBalance = async () => {
  const rawTx = await generateRawTransaction()
  rawTx.witnesses = rawTx.inputs.map(() => "0x")
  rawTx.witnesses[0] = {
    lock: "",
    inputType: "",
    outputType: "",
  }
  const signedTx = ckb.signTransaction(privateKey)(rawTx)
  // console.group('sign and send tx')
  // console.info(`signed tx: ${JSON.stringify(signedTx, null, 2)}`)
  // const realTxHash = await ckb.rpc.sendTransaction(signedTx)
  // console.info(`real tx hash: ${realTxHash}`)
  // return realTxHash
  // console.groupEnd()
}

sendAllBalance()
```
</details>

### 使用多个私钥发送交易

[源代码](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransactionWithMultiplePrivateKey.js)

<details>
<summary>点击直接查看示例代码</summary>

```js
/* eslint-disable */
const CKB = require('../lib').default
const ckb = new CKB('http://localhost:8114')

const sk1 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // exmaple private key
const sk2 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' // example private key

const loadCells = async () => {
  await ckb.loadSecp256k1Dep()
  const lockScript1 = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk1), 'hex')}`
  }

  const lockScript2 = {
    codeHash: ckb.config.secp256k1Dep.codeHash,
    hashType: ckb.config.secp256k1Dep.hashType,
    args: `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk2), 'hex')}`
  }

  const lockHash1 = ckb.utils.scriptToHash(lockScript1)
  const lockHash2 = ckb.utils.scriptToHash(lockScript2)

  await ckb.loadCells({
    lockHash: lockHash1,
    start: BigInt(16),
    end: BigInt(16),
    save: true
  })

  await ckb.loadCells({
    lockHash: lockHash2,
    start: BigInt(17),
    end: BigInt(17),
    save: true
  })

  const cell1 = ckb.cells.get(lockHash1)
  const cell2 = ckb.cells.get(lockHash2)
}

const generateTransaction = async () => {
  await loadCells()

  const addr1 = ckb.utils.privateKeyToAddress(sk1)
  const addr2 = ckb.utils.privateKeyToAddress(sk2)

  await ckb.loadSecp256k1Dep()

  const rawTransaction = ckb.generateRawTransaction({
    fromAddresses: [addr1, addr2],
    receivePairs: [{
      address: addr2,
      capacity: BigInt(30621362931463)
    }],
    fee: BigInt(10000),
    deps: ckb.config.secp256k1Dep,
  })

  const keys = new Map([sk1, sk2].map(sk => ([
    ckb.generateLockHash(`0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk), 'hex')}`), sk
  ])))
  rawTransaction.witnesses = rawTransaction.inputs.map(() => ({
    lock: '',
    inputType: '',
    outputType: ''
  }))
  const cells = [...ckb.cells.values()].flat()
  const signedTransaction = ckb.signTransaction(keys)(rawTransaction, cells)
  return signedTransaction
}

const sendTransaction = async () => {
  const signedTx = await generateTransaction()
  const txHash = await ckb.rpc.sendTransaction(signedTx)
  console.log(`tx hash: ${txHash}`)
}

// loadCells()
// generateTransaction()
sendTransaction()
```
</details>

### 存取 Nervos Dao

[源代码](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/nervosDAO.js)

<details>
<summary>点击直接查看示例代码</summary>

```js
/* eslint-disable */
const CKB = require('../lib').default
const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url

const ckb = new CKB(nodeUrl)

const sk = process.env.PRIV_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // example private key
const pk = ckb.utils.privateKeyToPublicKey(sk)

const pkh = `0x${ckb.utils.blake160(pk, 'hex')}`
const addr = ckb.utils.privateKeyToAddress(sk)

const loadCells = async () => {
  await ckb.loadSecp256k1Dep()
  const lockHash = ckb.generateLockHash(
    pkh
  )
  await ckb.loadCells({
    lockHash,
    start: BigInt(0),
    end: BigInt(1000),
    save: true
  })
}

const deposit = async () => {
  await loadCells()
  await ckb.loadDaoDep()
  const depositTx = ckb.generateDaoDepositTransaction({
    fromAddress: addr,
    capacity: BigInt(10200000000),
    fee: BigInt(100000)
  })
  const signed = ckb.signTransaction(sk)(depositTx)

  const txHash = await ckb.rpc.sendTransaction(signed)
  const depositOutPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const depositOutPoint = ${JSON.stringify(depositOutPoint)}`)
}

const depositOutPoint = {
  "txHash": "0x40e1d58cf8576d5206d55d242284a28f64cb114d0b9a8292582e7596082e5bda",
  "index": "0x0"
}

const logDepositEpoch = async () => {
  const tx = await ckb.rpc.getTransaction(depositOutPoint.txHash)
  if (tx.txStatus.blockHash) {
    const b = await ckb.rpc.getBlock(tx.txStatus.blockHash)
    const epoch = b.header.epoch
    console.log(`const depositEpoch = ${JSON.stringify(ckb.utils.parseEpoch(epoch), null, 2)}`)
  } else {
    console.log('not committed')
  }
}

const depositEpoch = {
  "length": "0xa",
  "index": "0x0",
  "number": "0x69"
}

const starWithdrawing = async () => {
  await loadCells()
  await ckb.loadDaoDep()
  const tx = await ckb.generateDaoWithdrawStartTransaction({
    outPoint: depositOutPoint,
    fee: 10000n
  })
  const signed = ckb.signTransaction(sk)(tx)
  const txHash = await ckb.rpc.sendTransaction(signed)
  const outPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const startWithDrawOutPoint = ${JSON.stringify(outPoint, null, 2)}`)
}

const startWithDrawOutPoint = {
  "txHash": "0xc8ad01deb8b25c56169992598398ad7d539314ada90c84bff12fa7fc69095076",
  "index": "0x0"
}

const logStartWithdrawingEpoch = async () => {
  const tx = await ckb.rpc.getTransaction(startWithDrawOutPoint.txHash)
  if (tx.txStatus.blockHash) {
    const b = await ckb.rpc.getBlock(tx.txStatus.blockHash)
    const epoch = b.header.epoch
    console.log(`const startWithdrawingEpoch = ${JSON.stringify(ckb.utils.parseEpoch(epoch), null, 2)}`)
  } else {
    console.log('not committed')
  }
}

const startWithdrawingEpoch = {
  "length": "0xa",
  "index": "0x0",
  "number": "0xbe"
}

const logCurrentEpoch = async () => {
  ckb.rpc.getTipHeader().then(h => console.log(ckb.utils.parseEpoch(h.epoch)))
}

const withdraw = async () => {
  await ckb.loadDaoDep()
  await ckb.loadSecp256k1Dep()
  await loadCells()
  const tx = await ckb.generateDaoWithdrawTransaction({
    depositOutPoint,
    withdrawOutPoint: startWithDrawOutPoint,
    fee: BigInt(100000)
  })
  const signed = ckb.signTransaction(sk)(tx)
  const txHash = await ckb.rpc.sendTransaction(signed)
  const outPoint = {
    txHash,
    index: '0x0'
  }
  console.log(`const withdrawOutPoint = ${JSON.stringify(outPoint, null, 2)}`)
}

const withDrawOutPoint = {
  "txHash": "0xb1ee185a4e811247b1705a52df487c3ce839bfa2f72e4c7a74b6fc6b0ea4cfa7",
  "index": "0x0"
}


// deposit()
// logDepositEpoch()
// starWithdrawing()
// logStartWithdrawingEpoch()
// logCurrentEpoch()
// withdraw()

// setInterval(logCurrentEpoch, 1000)
```
</details>