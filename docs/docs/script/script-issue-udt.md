---
id: script-issue-udt
title: 发行 UDT
sidebar_label: 发行 UDT
---

> 你已经读到这个文档最有意思的部分了（我认为）。 **让我们开始吧**

## 发行 UDT

### 下载编译合约

首先，我们先下载 simple UDT 的源码:

```shell
git clone https://github.com/nervosnetwork/ckb-miscellaneous-scripts.git
cd ckb-miscellaneous-scripts/
```
> 这里面包含了很多有趣的合约，但是这一次我们只用到了 UDT。

和最简合约一样，我们也使用 Docker 来编译：

> 注意，你需要先安装 `Rust`。

```shell

$ make install-tools  #安装依赖

$ make all-via-docker #使用docker编译

$ cd build/ && ll -h | grep simple_udt
-rwxr-xr-x 1 root   root   1.7K Apr  6 14:04 simple_udt*
-rwxr-xr-x 1 root   root   145K Apr  6 14:04 simple_udt.debug*
```

### 部署合约

这里我使用的是 Aggron 测试网部署合约，首先，您需要去[水龙头](https://faucet.nervos.org/)领 5000 CKB。

> 如果您启用了本地 `DevChain` 的话，就可以跳过上述步骤。

**注意，我将使用 CKB 的 Ruby SDK。具体的设置方法请参考[文档](/docs/docs/client/start/connect-client)和官方 Ruby SDK 的 [README](https://github.com/nervosnetwork/ckb-sdk-ruby/blob/develop/README.md).**

```js
pry(main)> api = CKB::API.new
=> #<API@http://localhost:8114>
pry(main)> new_key = CKB::Key.random_private_key
=> "0xc5e72c391909d695fb02a9ee40e55f0ffcd5188591373f6fe0013ad4b89a5342"
pry(main)> wallet = CKB::Wallet.from_hex(api, new_key)
=> #<CKB::Wallet:0x00007fffe3ea57a0
 @addr=
  #<CKB::Address:0x00007fffe3ea4f08
   @mode="testnet",
   @prefix="ckt",
   @script=#<CKB::Types::Script:0x00007fffe3ea4fd0 @args="0xa596693ee95b3901a59a83fa60b1247511d2d4dd", @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", @hash_type="type">>,
 @address="ckt1qyq2t9nf8m54kwgp5kdg87nqkyj82ywj6nwsl67j63",
 @api=#<API@http://localhost:8114>,
 @blake160="0xa596693ee95b3901a59a83fa60b1247511d2d4dd",
 @hash_type="type",
 @key=#<CKB::Key:0x00007fffe3ea7b68 @privkey="0xc5e72c391909d695fb02a9ee40e55f0ffcd5188591373f6fe0013ad4b89a5342", @pubkey="0x02ce875d7dd28539e5d6d74a1ba2743082be36e5465df1181292436ca0dac1dae6">,
 @pubkey="0x02ce875d7dd28539e5d6d74a1ba2743082be36e5465df1181292436ca0dac1dae6",
 @skip_data_and_type=true>

pry(main)> wallet.get_balance
=> 500000000000
pry(main)> data = File.read("simple_udt")

pry(main)> data.bytesize
=> 1688
```

我们需要新建一个 cell，将 script 代码作为 cell 的 `data` 部分：

```js
pry(main)> udt_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(2000), CKB::Utils.bin_to_hex(data),fee:2153)
=> "0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161"
```

现在我们可以发行一个 UDT 了！(包含 simple_udt 代码作为 `type Script` )。

```js
pry(main)> udt_data_hash = CKB::Blake2b.hexdigest(data)
=> "0x5f50913c8afb6ddb5d5189207d6e4e4f5b213fc35cb3fdea57629cb3452d295b"

pry(main)> udt_type_script = CKB::Types::Script.new(code_hash: udt_data_hash, args: wallet.lock_hash)
=> #<CKB::Types::Script:0x00007fffe466a670
@args="0xfc3304c0c378d127c1b2454395928a6ae975cb395a67f3cb1c63e0bed6863198", //我们使用了创建者的Lock Hash作为解锁秘钥，请参考上一小节关于权限控制的叙述
@code_hash="0x5f50913c8afb6ddb5d5189207d6e4e4f5b213fc35cb3fdea57629cb3452d295b",
@hash_type="data">

//生成交易

pry(main)> tx = wallet.generate_tx(wallet.address, CKB::Utils.byte_to_shannon(1000), CKB::Utils.to_hex(1000*(10**8)),fee: 5000)
=> #<CKB::Types::Transaction:0x00007fffe3b41578
 @cell_deps=[#<CKB::Types::CellDep:0x00007fffe3e50818 @dep_type="dep_group", @out_point=#<CKB::Types::OutPoint:0x00007fffe3b9b398 @index=0, @tx_hash="0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e">>],    @hash="0xd0a8b08bd1879f0dc6e871b543369bad431ee58a24c731f019981757265e8f79",
 @header_deps=[],
 @inputs=[#<CKB::Types::Input:0x00007fffe3e54710 @previous_output=#<CKB::Types::OutPoint:0x00007fffe3fa71f8 @index=1, @tx_hash="0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161">, @since=0>],
 @outputs=
  [#<CKB::Types::Output:0x00007fffe4109b90
    @capacity=100000000000,
    @lock=#<CKB::Types::Script:0x00007fffe4110120 @args="0xa596693ee95b3901a59a83fa60b1247511d2d4dd", @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", @hash_type="type">,
    @type=nil>,
   #<CKB::Types::Output:0x00007fffe4109370
    @capacity=199999992847,
    @lock=#<CKB::Types::Script:0x00007fffe41095c8 @args="0xa596693ee95b3901a59a83fa60b1247511d2d4dd", @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", @hash_type="type">,
    @type=nil>],
 @outputs_data=["0x174876e800", "0x"],
 @version=0,
 @witnesses=
  [#<CKB::Types::Witness:0x00007fffe3e54198 @input_type="", @lock="0xd248e6ef4f961948dc26b3dd25d90a40986cad09817293f9eb32ab64dedbf98914e62648b483f54a07c1db4df0fa93bd4fe6eee48caa848d6276b7939ec8593500", @output_type="">]>


pry(main)> tx.outputs[0].type = udt_type_script.dup
=> #<CKB::Types::Script:0x00007fffe42bb060 @args="0xfc3304c0c378d127c1b2454395928a6ae975cb395a67f3cb1c63e0bed6863198", @code_hash="0x5f50913c8afb6ddb5d5189207d6e4e4f5b213fc35cb3fdea57629cb3452d295b", @hash_type="data">

```
我们需要在 TX deps 中引用包含 UDT script 的 cell：

```js

pry(main)>  udt_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: udt_tx_hash, index: 0))
=> #<CKB::Types::CellDep:0x00007fffe41b78f8 @dep_type="code", @out_point=#<CKB::Types::OutPoint:0x00007fffe41b79e8 @index=0, @tx_hash="0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161">>

pry(main)> tx.cell_deps << udt_cell_dep.dup
=> [#<CKB::Types::CellDep:0x00007fffe4703140 @dep_type="dep_group", @out_point=#<CKB::Types::OutPoint:0x00007fffe3b9b398 @index=0, @tx_hash="0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e">>,
 #<CKB::Types::CellDep:0x00007fffe3ea6f60 @dep_type="code", @out_point=#<CKB::Types::OutPoint:0x00007fffe41b79e8 @index=0, @tx_hash="0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161">>]

```

现在我们已经准备好了，可以签名并发送交易了：

```js
pry(main)> tx = tx.sign(wallet.key)
=> #<CKB::Types::Transaction:0x00007fffe46a88f8
 @cell_deps=
  [#<CKB::Types::CellDep:0x00007fffe4703140 @dep_type="dep_group", @out_point=#<CKB::Types::OutPoint:0x00007fffe3b9b398 @index=0, @tx_hash="0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e">>,
   #<CKB::Types::CellDep:0x00007fffe3ea6f60 @dep_type="code", @out_point=#<CKB::Types::OutPoint:0x00007fffe41b79e8 @index=0, @tx_hash="0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161">>],
 @hash="0x9344ceebef5c587a829059c7d4434e0984f1810d707248b22eef18cafbad0747",
 @header_deps=[],
 @inputs=[#<CKB::Types::Input:0x00007fffe4703dc0 @previous_output=#<CKB::Types::OutPoint:0x00007fffe472db20 @index=1, @tx_hash="0xafe5ddf2972bb25aabb8bb454a3e6cabe736fe8dddc56bb393d6393fea6b1161">, @since=0>],
 @outputs=
  [#<CKB::Types::Output:0x00007fffe4804490
    @capacity=100000000000,
    @lock=#<CKB::Types::Script:0x00007fffe48049e0 @args="0xa596693ee95b3901a59a83fa60b1247511d2d4dd", @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", @hash_type="type">,
    @type=
     #<CKB::Types::Script:0x00007fffe42bb060 @args="0xfc3304c0c378d127c1b2454395928a6ae975cb395a67f3cb1c63e0bed6863198", @code_hash="0x5f50913c8afb6ddb5d5189207d6e4e4f5b213fc35cb3fdea57629cb3452d295b", @hash_type="data">>,     #<CKB::Types::Output:0x00007fffe4804378
    @capacity=199999992847,
    @lock=#<CKB::Types::Script:0x00007fffe48043f0 @args="0xa596693ee95b3901a59a83fa60b1247511d2d4dd", @code_hash="0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", @hash_type="type">,
    @type=nil>],
 @outputs_data=["0x174876e800", "0x"],
 @version=0,
 @witnesses=
  [#<CKB::Types::Witness:0x00007fffe4703d48 @input_type="", @lock="0xcee8b1114b717ce791318472964d3768fae95cfd7ebf8256843a7cde4451829d694e0f64391f150e2211fbef24d0705940d4615413ef8688b01c5cb9f183cece01", @output_type="">]>

pry(main)> api.send_transaction(tx)
=> "0x9344ceebef5c587a829059c7d4434e0984f1810d707248b22eef18cafbad0747"
```
> 看到这里，你已经成功完成了 UDT 的发行！Congratulations~！

