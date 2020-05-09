---
id: rust-contract-01
sidebar_label: blog
title: "Rust 合约[1]：使用 Rust 写 CKB 合约"
author: Jinyang Jiang
author_title: Nervos Core Team
author_url: https://github.com/jjyr
author_image_url: https://avatars2.githubusercontent.com/u/1695400?s=400&u=3c20ef997a5db2437a649715615ca56d65cf4294&v=4
tags: [Script_Programming, jjy, Rust]
---

据我所知，目前在 CKB 上部署合约最流行的方式是用 C 代码。在创世块中有 3 个默认的合约 `secp256k1 lock`、`secp256k1 multisig lock`、`Deposited DAO`，基本上每个使用 CKB 的人都在使用这些合约。

作为一个 Rust 语言爱好者，我们都想在任何场景下使用 Rust。有个好消息，CKB 虚拟机支持 RISC-V 指令集，最近在 Rust 中也增加对 RISC-V 的支持，这意味着我们可以直接将 Rust 代码编译成 RISC-V。然而，坏消息是 RISC-V 目前还不支持 std 库，这意味着你还不能像日常那样去使用 Rust。

本系列文章将向你展示了如何用 Rust 编写 CKB 合约并部署它。我们会发现，`no_std` Rust 其实比我们一开始想的要好很多。

<!--truncate-->

本文假设你熟悉 Rust 并对 CKB 有一定的基础知识。你应该要了解 CKB 的交易结构，并理解 `type script` 和 `lock script`。在本文中，我们用合约（`contract`）来泛指 `type script` 和 `lock script`。

## 设置 Rust 环境

### 创建项目

让我们先初始化一个项目模版。首先，我们将创建 2 个项目 `ckb-rust-demo` 和 `contract`。`ckb-rust-demo` 是用来放测试代码的，`contract` 用来放合约代码。

```shell
cargo new --lib ckb-rust-demo
cd ckb-rust-demo
cargo new contract
```

### 安装 `riscv64imac-unknown-none-elf`

我们选择 nightly Rust，因为会需要几个不稳定的功能，然后我们安装 RISC-V 平台。

```shell
# use nightly version rust
echo "nightly" > rust-toolchain
cargo version # -> cargo 1.41.0-nightly (626f0f40e 2019-12-03)
rustup target add riscv64imac-unknown-none-elf
```

## 编译我们的第一个合约

让我们试着来编译这个合约，然后看会发生什么：

```
cd contract
cargo build --target riscv64imac-unknown-none-elf
```

编译失败了，因为 `riscv64imac-unknown-none-elf` 不支持 `std`。

让我们修改 `src/main.rs` 添加 `no_std` 标记。

```rust
#![no_std]
#![no_main]
#![feature(start)]
#![feature(lang_items)]

#[no_mangle]
#[start]
pub fn start(_argc: isize, _argv: *const *const u8) -> isize {
    0
}

#[panic_handler]
fn panic_handler(_: &core::panic::PanicInfo) -> ! {
    loop {}
}

#[lang = "eh_personality"]
extern "C" fn eh_personality() {}
```

上面的代码是一个标准的 `no_std` main，现在让我们重新编译代码：

为了避免每次使用 `--target`，我们在配置文件 `contract/.cargo/config` 中更新以下内容：

```
[build]
target = "riscv64imac-unknown-none-elf"
```

进行编译：

```shell
cargo build
file target/riscv64imac-unknown-none-elf/debug/contract
# -> target/riscv64imac-unknown-none-elf/debug/contract: ELF 64-bit LSB executable, UCB RISC-V, version 1 (SYSV), statically linked, with debug_info, not stripped
```

## 测试合约

这个合约唯一做的就是返回 `0`。这是一个“完美”的 `lock script`（因为任何人都可以解锁它，当然在主网上它就不那么完美了，所以请不要在主网上进行这样的尝试）。

编写测试代码的基本思路是使用我们的合约作为 cell 的 lock script，然后合约返回 `0`，这意味着任何人都可以花费这个 cell。

首先，我们使用合约作为 lock script 来模拟一个 cell。构造一笔交易使用这个 cell，如果交易验证成功，则意味着我们部署的 lock script 成功了。

添加 ckb-tool 作为依赖：

```
[dependencies]
ckb-tool = { git = "https://github.com/jjyr/ckb-tool.git" }
```

ckb-tool 包含几个辅助方法。

把测试代码放在 `ckb-rust-demo/src/lib.rs` 中，如下所示：

```rust
#[test]
fn it_works() {
    // load contract code
    let mut code = Vec::new();
    File::open("contract/target/riscv64imac-unknown-none-elf/debug/contract").unwrap().read_to_end(&mut code).expect("read code");
    let code = Bytes::from(code);

    // build contract context
    let mut context = Context::default();
    context.deploy_contract(code.clone());
    let tx = TxBuilder::default().lock_bin(code).inject_and_build(&mut context).expect("build tx");

    // do the verification
    let max_cycles = 50_000u64;
    let verify_result = context.verify_tx(&tx, max_cycles);
    verify_result.expect("pass test");
}
```

q. 加载合约代码
2. 建立上下文环境。`TxBuilder` 帮助我们将模拟的 cell 注入到文本中，并将合约作为 cell 的 lock script，然后构造一笔交易来花费这个 cell。
3. 验证

让我们来试一下：

```shell
cargo test
# ->
---- tests::it_works stdout ----
thread 'tests::it_works' panicked at 'pass test: Error { kind: InternalError { kind: Compat { error: ErrorMessage { msg: "OutOfBound" } } VM }

Internal }', src/libcore/result.rs:1188:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace.
```

不用慌张，这个错误告诉我们，程序访问内存越界。

`riscv64imac-unknown-none-elf` 在处理入口点上有一点不同，使用 `riscv64-unknown-elf-objdump -D <binary>` 进行反汇编，可以发现没有 `.text` 部分，我们必须找到除使用 `#[start]` 之外的其他方法，来指示入口点。

## 定义入口点和 main

让我们删除整个 `#[start]` 函数，而是定义一个名为 `_start` 的函数作为入口点:

```
#[no_mangle]
pub fn _start() -> ! {
    loop{}
}
```

`_start` 的返回值是!，这意味着这个函数永远不会返回；如果试图从该函数返回，则会得到一个 `InvalidPermission` 的错误，因为入口点没有地方可以返回。

编译它:

```shell
cargo build

# -> rust-lld: error: undefined symbol: abort
```

我们定义一个 `abort` 函数来传递编译。

```
#[no_mangle]
pub fn abort() -> ! {
    panic!("abort!")
}
```

编译，然后再运行一次测试：

```
cargo build
cd ..
cargo tests
# ->
---- tests::it_works stdout ----
thread 'tests::it_works' panicked at 'pass test: Error { kind: ExceededMaximumCycles

Script }', src/libcore/result.rs:1188:5
```

当脚本周期超过最大周期限制时，会发生 `ExceededMaximumCycles` 错误。

为了退出程序，我们需要调用 `exit` syscall。

## CKB-VM syscall

CKB 环境支持多个 [syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)。

我们需要调用 `exit` syscall 来退出程序，并返回一个退出码：

```
#[no_mangle]
pub fn _start() -> ! {
    exit(0)
}
```

为了从 Rust 中调用 `exit`，我们需要写一些“有趣”的代码：

```rust
#![feature(asm)]

...

/// Exit syscall
/// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md
pub fn exit(_code: i8) -> ! {
    unsafe {
        // a0 is _code
        asm!("li a7, 93");
        asm!("ecall");
    }
    loop {}
}
```

`a0` 寄存器包含我们的第一个参数 `_code`，`a7` 寄存器表示 `syscall` 的号码，`93` 正是 `exit` 的 syscall 号码。

编译并再次重新运行测试。

这最后的工作了!

现在，你可以尝试搜索我们使用的每个不稳定的 `feature`，并尝试找出它的含义。尝试修改退出代码和 `_start` 函数，重新运行测试看看发生了什么。

## 总结

这个 demo 的展示了如何使用 Rust 从底层的角度编写 CKB 合约。Rust 的真正力量是语言的抽象能力和它的工具链，这在本文中我们没有涉及。

例如，对于 `cargo`，我们可以将库抽象到 crates 中；如果我们可以导入一个 syscalls crate，而不是自己编写，我们就可以得到一个更好的开发体验。更多的人在 CKB 上使用 Rust，我们就可以使用更多的 crates。

使用 Rust 的另一个好处是，在 CKB 中合约只进行验证。除了链上合约外，我们还需要编写一个链下程序来生成交易数据。如果我们在合约和链下程序中使用不同的语言，那么我们可能需要编写重复的代码，但是如果使用 Rust，我们可以使用相同的库来编写合约和生成器。

用 Rust 写一个 CKB 合约可能看起来有点复杂；你可能会想，如果选择 C，事情会变得更简单，你是对的，但只是就现在而言!

在下一篇文章中，我将向展示如何使用 `ckb-std` 库重写合约；你将会发现这其实非常简单！

我们还将在以后的文章中讨论更多关于合约的问题。

* [CKB contract in Rust - part 2](https://justjjy.com/CKB-contract-in-Rust-part-2-Rewrite-contract-with-ckb)
* [ckb-rust-demo repository](https://github.com/jjyr/ckb-rust-demo)
* [ckb-std repository](https://github.com/jjyr/ckb-std)
* [CKB data structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)
* [CKB syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)

[原文链接](https://justjjy.com/Build-CKB-contract-with-Rust-part-1)