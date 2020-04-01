---
id: neuron-overview
title: Neuron 概述
sidebar_label: Neuron 概述
---

## 关于 Neuron

Neuron 钱包目前由 Nervos 核心开发团队进行开发及维护。Neuron 是 Nervos CKB 默认的桌面钱包，它的主要功能将是 Token 转账和 Nervos DAO 的操作，其它功能和应用将由社区和开发团队共同实现。

目前 Neuron 钱包应用程序中已经成功内置了 CKB 全节点，用户无需自行运行节点或者通过命令行运行节点，即可使用 Neuron 钱包。

<<<<<<< HEAD:docs/docs/neuron/neuron-overview.md
2. Choose the correct file based on your device operating system

<img src="../assets/neuron-key-manager/download.png" width = "600"/>
=======
Neuron：https://github.com/nervosnetwork/neuron
>>>>>>> 8aadfd88cf260428bc045bb6f36703a59584157f:docs/docs/Clients/client-neuron.md

## 安装和导入

### 下载

请下载最新版本的 Neuron 钱包，并根据您的电脑系统选择正确的安装包

* 国内用户，建议使用国内镜像进行下载：
    * Windows：https://releases.nervos.org/Neuron-latest.exe 
    * macOS：https://releases.nervos.org/Neuron-latest.dmg 
    * Linxu：https://releases.nervos.org/Neuron-latest.AppImage 

* Github 下载：https://github.com/nervosnetwork/neuron/releases/latest

|系统|Arch|对应安装包后缀|
|---|-----|------------|
|Windows|x64|.exe|
|macOS  |x64|.zip|
|macOS  |x64|.dmg|
|Linux  |x64|.AppImage|

### 安装和进入

* 双击对应的安装包，依次点击 **安装**，进入安装进度读条，点击 **完成** 即可。
* 双击桌面上的 Neuron 图标，即可进入 Neuron 钱包。

### 创建和导入钱包

#### 创建钱包

* 进入 Neuron 钱包，选择创建钱包，Neuron 将为您创建一个新的 CKB 钱包。
* 您将获得一个由 12 个单词组成的钱包助记词，请务必谨慎地保存助记词！
* 点击 **下一步**，输入您刚刚保存好的助记词，再点击 **下一步**，然后为钱包命名，并设置使用密码。最后点击 **下一步**，恭喜您，您已经成功创建了一个 CKB 钱包！
* 您可以在工具栏的 “钱包” 标签下，选择 **备份当前钱包**，输入密码，将在您的本地保存一个 json 文件，您之后可以需要导入钱包时，除了直接导入助记词外，也可以选择导入 Keystore 文件，就是我们刚刚保存的 json 文件，然后配合你设置的密码，从而实现钱包的导入。

#### 导入钱包

* 如果你先前创建过 CKB 钱包，您可以在开始界面处，选择导入助记词或者导入 Keystore 文件。
* 在您在进入钱包后，也可以在工具栏的 “钱包” 标签下，选择当前钱包或者选择添加新的钱包。

> 注：目前 Neuron 暂不支持私钥导入，你可以在 ABC Wallet 中导入私钥，然后通过转账的形式转入您新创建的 CKB 钱包。

## 使用 Neuron 钱包

### 钱包页面介绍

* **总览**：查看钱包地址内余额，链状态和最近收支
* **转账**：进行 CKB 转账，可以实现一对多的转账，可以设置转账手续费
* **收款**：显示您的收款地址
* **交易历史**：显示您的交易历史
* **Nervos DAO**：进行 Nervos DAO 的锁定，查看该地址下正锁定在 NervosDAO 中的 CKB 的信息。
* **地址管理**：显示您这个 HD 钱包下，创建出来的的收款地址和找零地址

### 使用准备

#### 区块同步、数据加载

* Neuron 是全节点钱包，内置运行 CKB 节点，因此每次使用 Neuron 钱包，都需要等待内置全节点运行同步至当前最高区块高度，Neuron 读取并运行完对应的历史数据。
* 不同电脑配置所需时间不同，目前从零开始同步区块和读取历史数据，大约耗时 1-2 个小时。

#### 数据加载过慢

我们为您准备好的一份 CKB 的链数据：https://releases.nervos.org/ckb-data.zip ，块高度是 #1,156,900 。（海外用户可以使用这个地址 https://www.dropbox.com/s/5jusv76olh7ozw1/data.zip?dl=0 ）

只要解压出 data 目录，放置到指定位置，就能大幅加速初次下载区块数据的速度。

* Win PC: C:\Users(YOUR USER NAME)\AppData\Roaming\Neuron\chains\mainnet\
* Mac:~/Library/Application/Support/Neuron/chains/mainnet

#### 链状态

在**总览**页面，您可以看到当前钱包的名称、余额、最近收支等信息，在余额右边还会有一个**链状态**的按钮

<<<<<<< HEAD:docs/docs/neuron/neuron-overview.md
There are 3 ways to generate a wallet:
- Start from scratch
- Recover wallet
- Import from keystore file
=======
**链状态**内包含有：**链 ID**，**区块高度**，**Epoch**，**难度** 等信息。
>>>>>>> 8aadfd88cf260428bc045bb6f36703a59584157f:docs/docs/Clients/client-neuron.md

* **链 ID**：标识您当前所连的区块链网络，"ckb" 指您当前连接的是 CKB 主网，"ckt" 指您当前连接的是 CKB 测试网
* **区块高度**：当前已经同步到的区块高度
* **Epoch**：当前已经同步到的 Epoch 高度
* **难度**：当前已同步到的 Epoch 高度的挖矿难度

#### 同步提示

在 Neuron 钱包的左下角会显示当前链上数据在 Neuron 内的同步状态：

* **同步尚未开始**：检查**链状态**，查看其中的**区块高度**一项，如果**区块高度**为 0 或者长时间保持不变，说明此时 Neuron 钱包未启动内置的 CKB 节点，请您检查电脑配置、Neuron 版本，并尝试重启 Neuron，若还是存在问题，建议您前往社区，咨询相关问题。
* **区块同步中**：说明此时区块正在同步，请耐心等待
* **同步完成**：区块同步已完成，您可以进行转账、存 Nervos DAO 等操作。

### 收款

显示您的收款地址，为了保护隐私，Neuron 会自动选择一个新的地址，如果您想使用旧地址，您可以前往地址管理页面进行设置。（关于您为什么每次都有一个新地址，你可以查看下方[关于 Neuron 的问题]）

您还可以进行复制地址、复制图片、将图片保存到本地等操作。

### 转账

Neuron 钱包目前支持一对多、自定义交易手续费等转账功能。

#### 一对一转账

输入对应的收款地址，输入您要转账的金额，点击发送即可

<<<<<<< HEAD:docs/docs/neuron/neuron-overview.md
The password is used for security-related actions, eg:
- backup wallet
- delete wallet
=======
#### 一对多转账
>>>>>>> 8aadfd88cf260428bc045bb6f36703a59584157f:docs/docs/Clients/client-neuron.md

您可以输入完一笔转账后，点击右方的加号，再添加多笔转账。一笔交易内可以有多个输出，这可能会造成您需要额外多支出一点点的手续费，但实际影响应该是非常非常小的。

<<<<<<< HEAD:docs/docs/neuron/neuron-overview.md
#### Step 5: Address generated
=======
#### 自定义交易手续费
>>>>>>> 8aadfd88cf260428bc045bb6f36703a59584157f:docs/docs/Clients/client-neuron.md

您可以点击下方**交易费高级设置**，进行自定义手续费，手续费单位为 shannons/kB（1 CKB = 10^8 shannon）。

#### 添加备注

您可以为这笔交易添加备注。


### 查看历史交易

在这里您可以查看历史交易。

#### 搜索
* 页面顶部提供搜索框，您可以使用交易哈希、地址、日期等进行搜索

#### 历史交易
* 标注有：交易时间，交易内容，交易状态和确认次数

<<<<<<< HEAD:docs/docs/neuron/neuron-overview.md
### 2. Recover wallet
=======
#### 单击-交易信息
* 交易类型：转账、Nervos DAO 等
* 交易哈希
* 备注功能
>>>>>>> 8aadfd88cf260428bc045bb6f36703a59584157f:docs/docs/Clients/client-neuron.md

#### 右击-交易信息
* 详情：会弹出一个关于该笔交易的详细信息的弹框，记录有：交易哈希，区块高度，时间，输入，输出等信息
* 复制交易哈希
* 在浏览器中查看

### Nervos DAO

建议您在 [Nervos DAO] - [如何将 CKB 存入 Nervos DAO] 中查看更多内容

### 地址管理

Neuron 是 HD 钱包，在钱包创建的时候，会在地址管理页面默认为您生成 20 个收款地址和 10 个找零地址，当您用完这些地址后，还会为您继续生成额外的地址。

* **类型**：标记为 **收款地址** 和 **找零地址**
* **地址**：地址
* **备注**：您可以为每个地址添加备注标识
* **余额**：显示该地址内的余额
* **交易总数**：显示该地址的交易总数

**右击地址**：
* **复制地址**：复制当前地址
* **请求支付**：将当前地址设置成收款地址，并跳转收款页面
* **在浏览器中查看**：在浏览器中打开该地址

### 设置

#### 通用

您可以在此检查更新、清空缓存