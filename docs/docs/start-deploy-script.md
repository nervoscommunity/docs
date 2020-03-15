---
id: start-deploy-script
title: 在 CKB 的 dev 链上部署代码脚本
sidebar_label: 在 CKB 的 dev 链上部署代码脚本
---

在上一章，介绍了如何启动 CKB 的 dev 链，这一篇我们要向大家展示如何将脚本代码真正部署到 CKB 网络上去。


## 一个最小的 CKB 脚本代码

CKB VM 是基于开源的 RISC-V 指令集编写的。 你在vm上可以用任何语言编写任何你想写的逻辑。在这里，我们展示的前面几个例子将会用 C 语言编写，以保持简单性（我是说工具链中的简单性，而不是语言），之后我们还会切换到基于 JavaScript 的脚本代码。

来个`carrot.c`的

```c
#include <memory.h>
#include "ckb_syscalls.h"

int main(int argc, char* argv[]) {
  int ret;
  size_t index = 0;
  uint64_t len = 0; /* (1) */
  unsigned char buffer[6];

  while (1) {
    len = 6;
    memset(buffer, 0, 6);
    ret = ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT); /* (2) */
    if (ret == CKB_INDEX_OUT_OF_BOUND) {               /* (3) */
      break;
    }

    if (memcmp(buffer, "carrot", 6) == 0) {
      return -1;
    }

    index++;
  }

  return 0;
}
```


## 将脚本部署到 CKB 上

### 头文件

`mkdir carrot && cd carrot`

我们还需要下载2个头文件 `ckb_consts.h` `ckb_syscalls.h`

https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/ckb_consts.h
https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/ckb_syscalls.h

### docker

使用 docker 快速编译环境

https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain

```shell
docker pull nervos/ckb-riscv-gnu-toolchain:xenial-full-20191209 #下载docker镜像

docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash # 将本地路径映射到code

cd code

ls
# carrot.c  ckb_consts.h  ckb_syscalls.h

riscv64-unknown-elf-gcc -Os carrot.c -o carrot # 将c代码编译为 RISC-V架构的执行文件

ls
# carrot carrot.c  ckb_consts.h  ckb_syscalls.h

file carrot
# carrot: ELF 64-bit LSB executable, UCB RISC-V, version 1 (SYSV), statically linked

exit # 退出docker环境
```

### 启动链

### 运行ruby sdk

```shell
git clone https://github.com/nervosnetwork/ckb-sdk-ruby && cd ckb-sdk-ruby

./bin/console
```

### 代码上链

```ruby
# ruby code

api = CKB::API.new

miner = CKB::Wallet.from_hex(api, "0x3df087b48f8b646e3725a95323ec27536b17a8960a8774aeb52ef21d22f721df") # 由矿工私钥得到账户

puts miner.get_balance # 查看余额

wallet = CKB::Wallet.from_hex(api, CKB::Key.random_private_key) # 新钱包
wallet2 = CKB::Wallet.from_hex(api, CKB::Key.random_private_key) # 新钱包

miner.send_capacity(wallet.address, 10000*(10**8), fee: 1000) # 转账

data = File.read("carrot")

data.bytesize # 此处字节长度是 7765，字符串的长度，以字节为单位

carrot_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(8000), CKB::Utils.bin_to_hex(data), fee: 10**6)
# 如果提示 CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"transaction fee rate lower than min_fee_rate: 1000 shannons/KB, min fee for current tx: 8276"}
# 请适当提高fee

```

由于该交易的 cell 中没有任何一个的 cell data 包含 carrot，因此 type 脚本将验证成功。

```ruby
carrot_data_hash = CKB::Blake2b.hexdigest(data)
carrot_type_script = CKB::Types::Script.new(code_hash: carrot_data_hash, args: "0x")

tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(100), fee: 5000)
tx.outputs[0].type = carrot_type_script.dup

carrot_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: carrot_tx_hash, index: 0))
tx.cell_deps << carrot_cell_dep.dup

tx = tx.sign(wallet.key)

api.send_transaction(tx)
# => "0xd7b0fea7c1527cde27cc4e7a2e055e494690a384db14cc35cd2e51ec6f078163"
```

现在让我们尝试一个不同的交易，它含有一个以 carrot 开头的 cell：

```ruby
tx2 = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(100), fee: 5000)
tx2.cell_deps.push(carrot_cell_dep.dup)
tx2.outputs[0].type = carrot_type_script.dup
tx2.outputs_data[0] = CKB::Utils.bin_to_hex("carrot123")
tx2 = tx2.sign(wallet.key)
api.send_transaction(tx2)
# 提示=> CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"Script: ValidationFailure(-1)"}
# 如果提示{:code=>-3, :message=>"Transaction: InsufficientCellCapacity"} 是空间不足
```

## Duktape

我们可以用 C 语言写合约，这挺好，但是 C 语言的表现力很弱，而且，它很危险。有更好的方法吗？
我们在这里做的一件事是，使用 JavaScript 编写 CKB 脚本代码。

这是如何做到的呢？由于我们有 C 编译器，我们只需为嵌入式系统使用一个 JavaScript 实现。

duktape 将它从 C 编译成 RISC-V 二进制文件，把它放在链上，我们就可以在 CKB 上运行 JavaScript 了！
我们可以通过 duktape 在 CKB 上使用 JavaScript，我们也可以通过 mruby 在 ckb 上使用 Ruby， 我们甚至可以将比特币脚本或 EVM 放到链上，我们只需要编译他们的虚拟机，并把它放在链上。

要在 CKB 上使用 duktape，首先需要将 duktape 本身编译成 RISC-V 可执行二进制文件:


### 编译

```shell
git clone https://github.com/xxuejie/ckb-duktape && cd ckb-duktape
git submodule init
git submodule update

docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial-full-20191209 bash

cd /code && make

ls build/
# duktape   duktape.o entry.o   load0     load0.o   repl      repl.o    repl0     repl0.o

file build/duktape
# build/duktape: ELF 64-bit LSB executable, UCB RISC-V, version 1 (SYSV), statically linked

exit
```

### ruby

```ruby
duktape_data = File.read("./ckb-duktape/build/duktape")

duktape_data.bytesize
# => 269064

duktape_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(280000), CKB::Utils.bin_to_hex(duktape_data), fee: 5000)

duktape_data_hash = CKB::Blake2b.hexdigest(duktape_data)

duktape_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_tx_hash, index: 0))

```

```ruby
duktape_hello_type_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex("CKB.debug(\"I'm running in JS!\")"))


tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(200), fee: 5000)
tx.cell_deps.push(duktape_cell_dep.dup)
tx.outputs[0].type = duktape_hello_type_script.dup
tx = tx.sign(wallet.key)
api.send_transaction(tx)
# => "0x2e4d3aab4284bc52fc6f07df66e7c8fc0e236916b8a8b8417abb2a2c60824028"
```

我们可以看到脚本执行成功，如果在`ckb.toml` 文件中将 ckb-script 日志模块的级别设置为 debug，你可以看到以下日志：
`http.worker8 DEBUG ckb-script script group: c35b9fed5fc0dd6eaef5a918cd7a4e4b77ea93398bece4d4572b67a474874641 DEBUG OUTPUT: I'm running in JS!`
