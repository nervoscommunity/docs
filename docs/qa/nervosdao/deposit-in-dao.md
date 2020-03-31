---
id: deposit-in-dao
title: 如何将 CKB 存入 Nervos DAO
sidebar_label: 如何将 CKB 存入 Nervos DAO
---

## 介绍

截至目前，只能通过 Neuron 官方钱包，将 CKB 存入 Nervos DAO。在您将 CKB 存入 Nervos DAO 之前，建议您先了解 Nervos DAO 的[相关信息]()和[使用须知]()。

您可以下载最新版本的 Neuron 钱包，完成钱包安装，然后在页面栏选择 Nervos DAO 页，根据提示步骤，将 CKB 存入 Nervos DAO，具体操作流程可以参考下方教程。

未来一定会有更多的轻钱包和 dApp 等轻量级的形式，支持 Nervos DAO 的存取，本文会持续更新。

## 通过 Neuron 官方钱包

### 下载安装最新版 Neuron 钱包

1. 下载

    国内下载地址：

    * macOS：https://releases.nervos.org/Neuron-latest.dmg 
    * Windows：https://releases.nervos.org/Neuron-latest.exe 
    * Linxu：https://releases.nervos.org/Neuron-latest.AppImage 

    Github 下载：https://github.com/nervosnetwork/neuron/releases/latest

2. 安装：

* 双击对应的安装包，依次点击 **安装**，进入安装进度读条，点击 **完成** 即可。
* 双击桌面上的 Neuron 图标，即可进入 Neuron 钱包。

3. 数据同步：

如果您是首次下载使用 Neuron，可能会面临数据同步较慢的问题。我们为您准备好的一份 CKB 的链数据：https://releases.nervos.org/ckb-data.zip ，块高度是 #1,156,900 。

（海外用户可以使用地址：https://www.dropbox.com/s/5jusv76olh7ozw1/data.zip?dl=0 ）

只要解压出 data 目录，放置到指定位置，就能大幅加速初次下载区块数据的速度。

* Win PC: C:\Users(YOUR USER NAME)\AppData\Roaming\Neuron\chains\mainnet\
* Mac: ~/Library/Application/Support/Neuron/chains/mainnet

### 创建和导入钱包

1. 创建钱包

* 进入 Neuron 钱包，选择创建钱包，Neuron 将为您创建一个新的 CKB 钱包。
* 您将获得一个由 12 个单词组成的钱包助记词，请务必谨慎地保存助记词！
* 点击 **下一步**，输入您刚刚保存好的助记词，再点击 **下一步**，然后为钱包命名，并设置使用密码。最后点击 **下一步**，恭喜您，您已经成功创建了一个 CKB 钱包！
* 您可以在工具栏的 “钱包” 标签下，选择 **备份当前钱包**，输入密码，将在您的本地保存一个 json 文件，您之后可以需要导入钱包时，除了直接导入助记词外，也可以选择导入 Keystore 文件，就是我们刚刚保存的 json 文件，然后配合你设置的密码，从而实现钱包的导入。

2. 导入钱包

* 如果你先前创建过 CKB 钱包，您可以在开始界面处，选择导入助记词或者导入 Keystore 文件。
* 在您在进入钱包后，也可以在工具栏的 “钱包” 标签下，选择当前钱包或者选择添加新的钱包。

> 注：目前 Neuron 暂不支持私钥导入，你可以在 ABC Wallet 中导入私钥，然后通过转账的形式转入您新创建的 CKB 钱包。

### 使用 Neuron 钱包

1. 钱包页面介绍

* `总览`：查看钱包地址内余额，链状态和最近收支
* `转账`：进行 CKB 转账，可以实现一对多的转账，可以设置转账手续费
* `收款`：显示您的收款地址
* `交易历史`：显示您的交易历史
* `Nervos DAO`：进行 Nervos DAO 的锁定，查看该地址下正锁定在 NervosDAO 中的 CKB 的信息。
* `地址管理`：显示您这个 HD 钱包下，创建出来的的收款地址和找零地址

2. 区块同步、数据加载

* Neuron 是全节点钱包，内置运行 CKB 节点，因此每次使用 Neuron 钱包，都需要等待内置全节点运行同步至当前最高区块高度，Neuron 读取运行完对应的历史数据。
* 不同电脑配置所需时间不同，目前同步区块和读取历史数据的过程，大约耗时 1-2 个小时。

3. 使用 Neuron 钱包

* 在数据同步完成后，您可以通过 Neuron 钱包进行转账、收款等操作。

> 目前 Neuron 只提供电脑端钱包，暂不提供手机端钱包。
>
> 关于 Neuron 钱包的更多问题欢迎查看：[关于 Neuron](../wallet/about-neuron)

### 将 CKB 存入 Nervos DAO

1. 在所有区块同步完成后，即：

> 钱包显示的链状态中的`区块高度` = 区块浏览器显示的`区块高度`，且 Neuron 钱包左下角的数据同步进度条，显示 **同步完成**。

2. 切换至 Nervos DAO 分页，点击 **存入** ，然后会弹出一个提示框，上半部分填写您需要存入 Nervos DAO 的 CKB 数量，提示您需要支付的手续费；下半部分提醒您，根据 Nervos DAO 协议，您需要等待至少 180 个 epoch 才能取出您的存款。（按照设计 1个 epoch 大约是 4 个小时，因此 180 个 epoch 约为 1 个月）

> 注意：每次存入 Nervos DAO 的 CKB 数量需大于等于 102 个

3. 我们选择存入一定数量的 CKB，点击继续，输入密码，再点击确认。


4. 等待交易打包完成，稍后在存款记录处，会显示刚刚存入的交易记录，并开始计算利息！

> 关于 Nervos DAO 的收益情况和具体收益计算规则，您可以查看 [Nervos DAO 的收益](../nervosdao/revenue-of-dao)


### 从 Nervos DAO 将 CKB 取出

1. 当您需要从 Nervos DAO 中将锁定的 CKB 取出时，在 Nervos DAO 界面的存入记录处，点击右边的 Withdraw 按钮，这时 Neuron 钱包会，提示你此笔存入的 CKB 数量，获得的利息，以及你需要等待多少个 epochs 之后才能完成最终取款。也就是说即使你现在发起了提现，但是 CKB 的提现，并不能直接完成，你没有办法立即获得你的存款和利息，你需要等到存款周期满之后，才能提出对应的存款和利息。

> 注意：从你发起提现这一笔交易开始，到你最终完成提现，中间的这一段时间内，你是无法获得利息的。

2. 继续输入密码，即可进行提现，在锁定周期满足要求，达到 180 epoch 的整数倍后，再发起最后的提现交易，即可将 CKB 从 Nervos DAO 取出。


## 通过其他钱包

目前暂无，等待更新