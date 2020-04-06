---
id: script-minimal
title: 最简合约
sidebar_label: 最简合约
---

首先，我们从最简化的CKB Script开始，了解并尝试整个流程，让我们开始吧.

### 编写合约


理论上，CKB底层是Risc-V，任何可以编译的语言都可以使用，这里我们使用了C来写一个简单的Demo：

```C
int main(int argc, char* argv[])
{
  if (argc == 3) {
    return -2;
  } else if (argc == 5 ) {
   return -3;
  } else {
   return 0;
  }
}
```

简单描述下，合约接受参数，如果参数数量 = 3 ，就返回-2，如果参数数量等于5，就返回-3，其他任意参数都可以返回0.

保存合约，命名为`simple.c` 

### 编译合约

首先，我们需要编译上面写的源码。因为GCC已经有了RISC-V的上游支持，当然你可以使用官方的GCC来构建你的脚本代码。或者你也可以使用我们准备的[docker](https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain)镜像，省去了编译GCC的麻烦。

```shell

$ ls
simple.c
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
root@dc2c0c209dcd:/# cd /code
root@dc2c0c209dcd:/code# riscv64-unknown-elf-gcc -Os simple.c -o simple
root@dc2c0c209dcd:/code# exit
exit
$ ls
simple*  simple.c 
```

得到编译后的可执行文件simple.o

```shell
$ ll -h  
total 8.0K
-rw-rw-rw- 1 root root  140 Apr  6 14:37 simple.c
-rwxrwxrwx 1 root root 5.8K Apr  6 14:46 simple*
```

就这样，CKB可以直接将GCC编译后的可执行文件作为脚本在链上使用，不用进行进一步的处理。现在我们就可以在链上部署了。

### 部署合约

这里我使用的是Aragon测试网部署合约，首先，您需要去 [水龙头](https://faucet.nervos.org/)领10000CKB. 因为每3个小时能领5000CKB,所以我用了2个账号领取，并将它们归集到了一起。

> 如果您启用了本地`DevChain`的话，就可以跳过上述步骤。

**注意，我将使用CKB的Ruby SDK。具体的设置方法请参考[文档](/docs/docs/client/start/connect-client) 和 官方的 [README](https://github.com/nervosnetwork/ckb-sdk-ruby/blob/develop/README.md).**

```js
pry(main)> wallet.get_balance
=> 999700000000
pry(main)> wallet.address
=> "ckt1qyq9y848cp8dunfmnzpzudd49t2lxl2xatfqx2jys7"

//simple文件在rubySDK的同级目录下

pry(main)> data = File.read("simple")

pry(main)> data.bytesize
=> 5872

```
为了将脚本部署到CKB中，我们只需新建一个 Cell ，将 Script 代码作为 Cell 的数据部分。

```js
pry(main)> simple_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(6000), CKB::Utils.bin_to_hex(data),fee:6336)
=> "0xf7454ee2e0f78dc3d263d1e4998845f383247200d60acb36083793eee29584d7"
```
在这里，我简单地通过向自己发送 CKB 来创建一个新的 Cell ，并拥有足够的容量。现在我们可以创建一个 Cell 包含 Simple 代码的Type Script了。

```js

pry(main)> simple_data_hash = CKB::Blake2b.hexdigest(data)
=> "0xcba8ca27dad8a5fdf5c27a762a32204132146a865f84a0b38e51fe09bd3bc965"

pry(main)> simple_type_script = CKB::Types::Script.new(code_hash: simple_data_hash, args: "0x")
=> #<CKB::Types::Script:0x00007fffe8603ef8
 @args="0x",
 @code_hash="0xcba8ca27dad8a5fdf5c27a762a32204132146a865f84a0b38e51fe09bd3bc965",
 @hash_type="data">
```

回顾一下Script数据结构:

```rust
pub struct Script {
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    pub args: JsonBytes,
}
```

我们可以看到，我们没有直接将Script代码嵌入到Script数据结构中，而是只包含了代码哈希，也就是实际Script二进制代码的Blake2b哈希。由于 Simple 脚本**会验证参数数量**，所以首先我们使用**空字节**作为args部分。

注意我在这里还是忽略了`hash_type`，我们将在以后的开发中看到不同的`hash_tpye`, 现在，让我们在这里忽略它。

要运行 Simple 脚本，我们需要创建一个新的TX，并设置 Simple 作为其中一个 Output的Type Script。

```js 
pry(main)> tx = wallet.generate_tx(wallet.address, CKB::Utils.byte_to_shannon(1000), fee: 5000)

pry(main)> tx.outputs[0].type = simple_type_script.dup
```

还有一个步骤：为了让CKB定位 Simple Scirpt，我们需要在TX deps中引用包含 Simple Script 的 Cell。

```js
pry(main)> simple_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: simple_tx_hash, index: 0))
pry(main)> tx.cell_deps << simple_cell_dep.dup

```

现在我们已经准备好了，可以签名并发送交易了。

```js
pry(main)> tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(tx)
=> "0xf7454ee2e0f78dc3d263d1e4998845f383247200d60acb36083793eee29584d7"
```

由于我们给的Args数量满足要求，所以这笔交易可以成功发送。

接下来，你可以动手尝试下发送不同数量Args的交易，看一下能否签名成功？ 

答案很有可能是接下来这样的:

```js
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"InvalidTx(ScriptFailure(ValidationFailure(-3)))"}
```

### 总结

所以总结一下，要部署和运行一个脚本作为Type Script，我们需要做的是:

1. 将脚本编译成RISC-V可执行二进制文件
2. 在 Cell 的数据部分部署二进制数据
3. 建一个`Type Script `数据结构，用二进制的blake2b的哈希值作为代码哈希值，在args部分创建脚本代码的任何必要参数
4. 创建一个新的TX ，并将`Type Script` 设置在生成的 Cell 中。
5. 将包含`Type Script`的 Cell 作为交易的`OutPut` 之一


这就是部署一个合约，你所需要做的一切! Well Done！


### 注意事项

虽然我们在这里只谈Type Script，但Lock Script的工作原理是一样的。唯一需要记住的一点是，当你创建一个有特定Lock Script的Cell时，Lock Script不会在这里运行。它只在你花费该Cell时才会运行。因此，当你创建Cell时，Type Script可以用来创建运行的逻辑，而Lock Script是用来创花费Cell时运行的逻辑。考虑到这一点，请确保你的Lock Script是正确的，否则你可能会在以下情况下丢失CKB:

· 你的Lock Script有一个错误，即别人可以解锁你的Cell。
· 你的Lock Script有一个错误，没有人（包括你在内）可以解锁你的Cell。

>小建议：在你的交易中，始终把你的Script 作为一个Type Script放到你的Output Cell，这样当错误发生时，你会立即知道，你的CKB才可以保证安全。
