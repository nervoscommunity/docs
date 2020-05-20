---
id: about-explorer
title: 官方区块浏览器的介绍与使用
sidebar_label: 官方区块浏览器
---

Nervos 官方区块浏览器：https://explorer.nervos.org/

## 基本信息

目前官方区块浏览器主要包含以下内容：

* 链信息
* 图表
* Nervos DAO
* 链版本
    * CKB 主网 Lina
    * CKB 测试网 Aggron
* 语言
    * 简体中文
    * English

## 区块浏览器的使用

### 链信息

![explorer-info](/img/docs/explorer/explorer-info.png)

链信息页面顶部表格包含有：
* 最高块：当前最高区块高度
* 平均出块时间
* 挖矿算力
* 每分钟交易数
* Epoch：Eopch 数和当前 Epoch 进度
* 预计 Epoch 时间：在 CKB 主网设置中，一个 Epoch 的时间趋近于 4 小时，但实际 Epoch 时间会上下波动
* 挖矿难度
* 最近 24 小时交易数

链信息页面主体包含有两个部分：
* 最新区块
* 最新交易

### 区块信息

![block-info](/img/docs/explorer/block-info.png)

* 最上方为：区块哈希
* 概况内包含：
    * 区块高度，交易笔数，提案交易，矿工奖励，挖矿难度，Nonce 随机数，交易根
    * 矿工，Epoch 高度，本 Epoch 开始区块高度，区块序号，时间戳，叔块数
* 下方为交易详情，包括：
    * 交易哈希
    * 输入
    * 输出
    * 挖矿收益，由 Cellbase 发出
        * 基础奖励
        * 二级奖励
        * 提交奖励
        * 提案奖励
        * 注：关于挖矿奖励更详细的说明请参见[CKB 挖矿]部分

### 交易信息

![tx-info](/img/docs/explorer/tx-info.png)

* 最上方为：交易哈希
* 参数内包含：
    * 区块高度，交易手续费
    * 时间戳，状态（区块确认数）
    * 更多交易参数：CellDeps，HaderDeps，Witness
* 下方为交易详情，包括：
    * 输入
        * Lock Script
        * Type Script
        * Data
    * 输出
        * Lock Script
        * Type Script
        * Data


### 搜索功能

目前支持：区块高度/交易哈希/地址/锁定脚本哈希的搜索

### 图表

主要包含了：挖矿难度，挖矿算力，叔块率，交易数量，地址数量，Cell 数量，Nervos DAO 锁定量，账户余额排名等图表

### Nervos DAO 页

![dao-info](/img/docs/explorer/dao-info.png)

* 信息栏左侧：
    * 当前 Nervos DAO 锁定总额（今日增加量，北京时间零点重新计算）
    * 存入 Nervos DAO 的地址数量
    * 未领取补贴的 CKB 数量
    * 已领取补贴的 CKB 数量
    * 平均锁定时间
    * 预估 APC：当前存入 Nervos DAO 的预计年化收益率
* 信息栏右侧：
    * 二级发行饼图
        * 挖矿奖励
        * 锁定 Nervos DAO 的补贴
        * 销毁的二级发行

* 下方为 Nervos DAO 相关的存取交易列表和 Nervos DAO 锁定地址金额排序

![dao-info2](/img/docs/explorer/dao-info2.png)






