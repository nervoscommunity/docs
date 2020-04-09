---
id: welcome-programming-model
title: CKB 编程模型介绍
sidebar_label: CKB 编程模型介绍
---

Nervos CKB 是一个以状态为中心的 Layer 1 底层架构，其中交易表示状态的更改和迁移。CKB 提供了一种独特的基于 CKB VM 和 Cell 模型的有状态的图灵完备编程模型。 在本文中，我们将会介绍：

* CKB 的编程模型
    * Cell 模型：通用化的 UTXO 模型
* CKB 的交易：状态生成
* CKB VM：状态验证

期望通过本文，大家能够对 CKB 的编程模型有个基本了解，提前说明一下文章简化了许多细节，非常建议想要了解更多的朋友访问：
* [理解 CKB 的 Cell 模型](https://talk.nervos.org/t/ckb-cell/1562)；
* RFC：[Nervos CKB 加密经济共同知识库](../../rfcs/0002-ckb/0002-ckb.zh)；
* RFC：[CKB 交易结构](../../rfcs/0022-transaction-structure/0022-transaction-structure.zh)
* CKB 核心开发者 xuejie 编写的[开发文档](https://xuejie.space/).

## CKB 编程模型

编程模型弥合了底层硬件体系结构与应用程序可用的软件支持层之间的鸿沟。具体来说，编程模型是底层计算机系统的抽象化，它允许算法和数据结构的表达。如果您想要在 CKB 上进行开发，那么您首先应该要理解它的编程模型。CKB 中的状态是一等公民（First-Class Citizen），状态包含在交易和区块中，它们直接同步在节点之间。CKB 的编程模型由三部分组成：

* 状态生成（链下）
* 状态存储（Cell 模型）
* 状态验证（CKB VM）

在这个模型中，去中心化的应用逻辑被分为两个部分（生成和验证），分别在不同的地方运行。状态生成发生在客户端的链下，新的状态被打包成交易并广播到整个网络；状态验证发生在链上，它会确保状态转换的有效性并创建一个去信任的系统（trustless system）。

CKB 交易的 inputs 包括对之前 outputs的引用，以及能够解锁它们的证明。客户端将生成的新状态作为交易 outputs，在 CKB 中称为 cell。因此，cell 和交易输出的表述是可以互换的。**Cell 是 CKB 中的主要状态存储单元，资产所有权归用户所有，并且必须遵循脚本指定的相关应用程序逻辑。**

我们在 CKB VM 中执行脚本（后文将做具体介绍）并验证交易输入中包含的证明，以确保用户可以使用这些引用的 cell，并且在指定的应用程序逻辑下状态转换是有效的。通过这种方式，网络中的所有节点都可以验证新状态是有效的，并保留这些状态。

## Cell 模型：通用化的 UTXO 模型

### UTXO

Bitcoin 把整个账本分割保存在了一个个 UTXO 里面，UTXO 是未花费交易输出（Unspent Transaction Output）的简写，它被锁定在特定的所有者手中，记录在区块链上，并被整个网络识别为货币单位。它的数据结构非常简单，只包含两个字段：

```
class TxOut
    {
    public:
        Amount Value;
        Script scriptPubKey;
    ...
    }
```

每一个 TxOut 代表了一个硬币并且有自己的命名，这是由 Value 定义的，scriptPubKey 是一段表示这个硬币的所有者是谁的脚本（通常包含了所有者的公钥），只有能提供正确的参数使这个脚本运行成功的人，才能把这个硬币「转让」给另外一个人。

为什么要给「转让」打引号？因为在转让的时候，并不是简单的把硬币中的scriptPubKey修改或是替换掉，而是会销毁和创造新的硬币（毕竟在数字的世界中销毁和创造虚拟硬币的成本很低）。每一个 Bitcoin 交易，都会销毁一批硬币，同时又创造一批硬币，新创造的硬币会有新的面值和新的所有者，但是被销毁的总面值总是大于等于新创造的总面值，以保证没有人可以随意增发。交易表示的是账本状态的变化。

这样一个模型的特点是：

1. 硬币（资产）是第一性的；
2. 所有者是硬币的属性，每一枚硬币有且仅有一个所有者；
3. 硬币不断的被销毁和创建；

是不是很简单？如果你觉得自己已经理解了 Bitcoin 和 UTXO，恭喜你，你也已经理解了 CKB 和 Cell！

### Cell

Layer 1 的关注重点在状态，以 Layer 1 为设计目标的 CKB 设计的关注点很自然就是状态。CKB 想要验证和长久保存的状态，不仅仅是像在比特币中那样简单的数字（Value)，而是任何人们认为有价值的、经过共识的数据。Bitcoin 的交易输出结构满足不了这个需求，但是它已经给了我们足够的启发：只需要将 Value 一般化，把它从一个存放整数的空间变成一个可以存放任意数据的空间，我们就得到了一个更加一般化的「Value」或者叫 Cell：

```
pub struct CellOutput {
    pub capacity: Capacity,
    pub data: Vec<u8>,
    pub lock: Script,
    pub type_: Option<Script>,
}
```

在 Cell 里面，Value 变成了 capacity 和 data 两个字段，这两个字段共同表示一块存储空间，capacity 不仅仅只是存储 Token 的数量，也能表示 cell 可以存储数据数量的限制，这就是名字的由来，它是 cell 能够存储的容量限制，data 则是保存状态的地方，可以写入任意的一段字节。在工程实现上，数据结构中 cell 的 data 调整为 outputs_data 如果您想了解 Cell 的更多细节，请参考 RFC：[CKB 数据结构](../../rfcs/0019-data-structures/0019-data-structures.zh)。

Cell 模型还引入了 lock script 的概念，表示这块共识空间的所有者是谁，与 scriptPubKey  类似 ，只有能提供参数（例如签名）使得 lock script 成功执行的人，才能「更新」这个 Cell 中的状态。在交易中，整个 CellOutput 占用的字节数必须小于等于交易输入 cell 的 capacity 总和。

CKB 中存在着许许多多的 Cell，所有这些 Cell 的集合形成了 CKB 完整的当前状态，在 CKB 的当前状态中存储的不再仅仅是某一种数字货币，还存储任意的共同知识（对于创建应用程序的逻辑，我们将在后面介绍 type script）。

在 CKB 中，交易依然表示状态的变化/迁移。状态的变化，或者说 Cell 内容的「更新」实际上也是通过销毁和创建来完成的（并不是真的去修改原有 Cell 中的内容）。每一笔交易实际上都会销毁一批 Cell，同时创建一批新的 Cell。新创造的 Cell 会有新的所有者，也会存放新的数据，但是被销毁的 capacity 总和总是大于等于新创建的 capacity 总和，由此保证没有人可以随便增发 capacity。

capacity 是 CKB 网络中的原生资产，拥有 capacity 等于拥有相应数量的共识状态空间，capacity 只能按照预先定义的固定公式发行：[CKB Issuance Schedule](https://docs.nervos.org/basic-concepts/economics-of-ckb.html#ckbyte-issuance-schedule)。Cell 的销毁只是把它标记为「已销毁」，类似 Bitcoin 的 UTXO 从未花费变为已花费，并不是从区块链上删掉。每一个 Cell 只能被销毁一次，就像每一个 UTXO 只能被花费一次。

这样一个模型的特点是：

1. 状态是第一性的；
2. 所有者是状态的属性，每一份状态只有一个所有者；
3. 状态不断的被销毁和创建；

所以说，Cell 是 UTXO 的一般化（generalized）版本。

## CKB 交易：状态生成

如下图所示，CKB 交易被分为两个部分： inputs 和 outputs。交易销毁了 inputs 中的 Cell，同时创建了在 outputs 中的 Cell。一个可用（Live）的 Cell 会以输出而非输入的形式出现。一个被销毁（Dead）的 Cell 代表它是以输入的形式在其它较早的交易中被使用过。一个交易只能以可用的 Cell 作为输入，因此生成交易的第一步是收集可用的 Cell。

![](/img/docs/model-transaction.png)

您会发现这样的结构类似于比特币，但缺少用于保护交易输出所有权的锁定脚本。CKB 确实有这个特性，所以让我们关注一下 cell 数据结构中的两个实体：`lock` 和 `type`。

### 脚本

我们在上面介绍了 cell 的数据结构，如您所见，Cell 中有两个字段的类型是 Script。CKB VM 会运行所有输入 Cell 中的 lock 脚本，并且还会运行所有输入和输出 Cell 中的 type 脚本。该脚本不直接包含代码，请参阅下面的脚本结构。

![](/img/docs/model-script.png)

当 CKB-VM 需要运行一个脚本时，它必须要先找到它的代码。字段 code_hash 和 hash_type 就是用来查看代码的。在 CKB 中，脚本代码会被编译成 RISC-V 二进制文件。这个二进制文件是以数据的形式存储在 Cell 中的。当 hash_type 是「Data」时，脚本会被定位在一个数据哈希和脚本的 code_hash 相等的 Cell 中。顾名思义，Cell 数据哈希是从 Cell 的数据中算出来的。在交易中的范围有限。

如果你想在 CKB 中使用脚本，那么应该遵循代码定位的规则：

* 把你的代码编译成 RISC-V 二进制文件。你可以在建构系统 Cell 代码的仓库中找到一些案例：
    _https://github.com/nervosnetwork/ckb-system-scripts_
* 通过一笔交易，创建一个将二进制文件作为数据的 cell，并将交易发到链上。
* 建构一个脚本结构，其 hash_type 是「Data」，code_hash 只是
    构建二进制文件的哈希
* 使用脚本作为 Cell 中的一种形态或锁定脚本。


现在您已经对 CKB 中的脚本有了基本的了解，接下来我们将讨论如何在交易中使用脚本来锁定 cell，并在 cell 上建立智能合约。

### 锁定脚本 `lock script`

每个 Cell 都有一个锁定脚本。当交易中的 Cell 被以输入的形式使用时，锁定脚本必须执行。交易只有在所有的输入中锁定脚本都正常（执行并）退出时（没有例外）才有效。因为脚本在输入上运行，所以它可以扮演锁的角色来控制谁可以解锁或者销毁 Cell，以及花费储存在 Cell 中的容量。

以下是一个总是可以正常（执行并）退出的锁脚本的代码示例。如果使用这段代码作为锁脚本，那么任何人都可以销毁这个 Cell。

```
int main(int argc, char *argv[]) {
  return 0;
}
```

最主流的锁定数字资产的方式是用非对称加密创建的数字签名。

这个签名演算法有两个要求：

* Cell 必须要包含公钥的信息，所以只有真正的私钥可以创建有效的签名；
* 交易必须包含签名，而且通常以整个交易作为消息去签名。


### 类型脚本 `type script`

类型脚本和锁定脚本很相似，但有两点不同：

* 类型脚本是可选的；
* 在任一交易中，CKB 必须在输入和输出端都运行类型脚本。

虽然我们只能在 Cell 中维持一种脚本，但我们不会想要在一个单一的脚本中扰乱（脚本）不同的职责。锁定脚本只为输出执行，所以他的首要任务是保护 Cell。只有所有者可以以输入的形式使用 Cell，以及花费储存于其中的通证。

类型脚本的目的是在 Cell 上建立合约。当你得到一个特殊类型的合约时，你可以确定 Cell 已经在特定代码中通过验证。同时这个代码也会在 Cell 被销毁时被执行。典型的类型脚本场景是用户自定义 Token，这种类型脚本必须在输出上运行，所以通证的发行必须被授权。

在输入上运行类型脚本对合约而言非常重要，例如一个让用户可以在线下抵押 CKB 来租用资产的合约，如果这个类型脚本没有在输入上运行，用户可以在不受权限的情况下从合约中取回 CKB，只需销毁这个 Cell 并将容量转移到一个没有类型脚本的新 Cell 上即可。

这个运行类型脚本的步骤和锁定脚本也很相似，除了：

1. 没有类型脚本的 Cell 会被忽略
2. 脚本群组包含输入与输出

## CKB VM：状态验证器

CKB 使用的是 [RISC-V](https://riscv.org/) ISA 来实现 VM 层，CKB VM 用于执行一系列验证规则，通过执行 type script 和 lock script 来确定交易的输入和输出是否有效。规则总结如下：

* 在 Input Cell 中的 lock 脚本会被收集和去重，每个单独的 lock 脚本会被执行一次，并且只执行一次。
* Input 和 Output Cell 中的 type 脚本（如果存在的话）会被收集在一起并去重，每个单独的 type 脚本都会被执行一次，并且只执行一次。
* 任何脚本失败，则整个交易验证失败。

CKB 通过动态链接库的方式，依赖 syscall 来实现链上运算所需的其他功能，比如读取 Cell 的内容，或是其他与 block 相关的普通运算及加密运算。任何支持 RV64I 的编译器（如 [riscv-gcc](https://github.com/riscv/riscv-gcc)，[riscv-llvm](https://github.com/lowRISC/riscv-llvm)，[Rust](https://github.com/rust-embedded/wg/issues/218)）生成的可执行文件均可以作为 CKB VM 中的 script 来运行。

CKB 核心只定义了底层的虚拟机模型，理论上任何提供了 RISC-V 后端的语言均可以用来开发 CKB 合约:

* CKB 可以直接使用标准的 riscv-gcc、riscv-llvm，甚至更高级的 gcc/llvm 以 C/C++ 语言来进行开发。编译后的可执行文件可以直接作为 CKB 的合约来使用
* 与此相应的，可以将 C 实现的 Bitcoin 以及 Ethereum VM 编译成 RISC-V 二进制代码，保存在公共 Cell 中，然后在合约中引用公共 Cell 来运行 Bitcoin 或者 Ethereum 的合约
* 其他的高级语言 VM 如 [duktape](http://duktape.org/) 及 [mruby](https://github.com/mruby/mruby) 在编译后，也可以用来相应的运行 JavaScript 或者 Ruby 编写的合约
* 相应的也可以使用 [Rust](https://github.com/riscv-rust/rust) 作为实现语言来编写合约

那么以上就是 CKB 编程模型的概览，总而言之，与其他公链不同，CKB 的状态生成和状态验证进行了分离，各自的灵活性和扩展性都得到了提高。数据处理的方式更灵活，工具更多样。
