---
id: 0017-tx-valid-since.zh
title: 交易有效字段 —— since
sidebar_label: 17：交易有效字段 —— since
---

|  Number   |  Category |   Status  |   Author  |Organization| Created  |
| --------- | --------- | --------- | --------- | --------- | --------- |
| 0017 | Standards Track | Proposal | Jinyang Jiang |Nervos Foundation|2019-03-11|

# 交易有效字段 —— since


&nbsp;
## 摘要

这个 RFC 建议通过添加一个新的共识规则，来防止在某个特定的区块时间戳或者区块号之前使用某个 cell。

&nbsp;
## 概要

交易输入中加入一个新的 `u64`（无符号 64 位整数）类型的字段 `since`，用来防止这笔交易在一个绝对或者相对的时间之前被挖出来（被执行）。

`since` 的前八位是 `flags`，剩余的 `56` 位代表 `value`，`flags` 允许我们决定以下行为：

* `flags & (1 << 7)` 代表 `relative_flag`。
* `flags & (1 << 6)` 和 `flags & (1 << 5)` 一同代表 `metric_flag`。
   * 如果 `metric_flag` 为 `00`，`since` 使用一个基于区块的锁定期，`value` 可以解释为一个区块号（block number）或者一个相对区块号。
   * 如果 `metric_flag` 为 `01`，`since` 使用一个基于区块的锁定期，`value` 可以解释为一个周期号（epoch number）或者一个相对周期号。
   * 如果  `metric_flag` 为 `10`，`since` 使用一个基于时间的锁定期，`value` 可以解释为一个区块链时间戳（unix time）或者一个相对秒数。
   * `metric_flag` 为 `11` 时，无效。
* `flags` 其余 5 位， 留作它用。

共识中确认这一字段描述如下：
* 迭代输入，并通过以下规则验证每一个输入。
* 如果 `since` 的 64 位都是 0，则忽略这个验证规则。
* 检查 `metric_flag` 的 flag：
   * 如果 `metric_flag` 为 `00`，`since` 的后 56 位，代表的是区块号。
   * 如果 `metric_flag` 为 `01`，`since` 的后 56 位，代表的是周期号。
   * 如果 `metric_flag` 为 `10`，`since` 的后 56 位，代表的是区块时间戳。
* 检查 `relative_flag`：
   * 如果 `relative_flag` 为 `0`，将字段视为绝对锁定时间。
      * 如果提示的区块号、周期号或者区块时间戳小于 `since` 字段，则验证失败。
   * 如果 `relative_flag` 为 `1`，将字段视为相对锁定时间。
      * 查找生成这个 input cell 的区块，根据 `metric_flag` 的 flag 获取区块号或周期号或区块时间戳。
      * 如果提示所需的区块号或周期号或时间戳减去找到区块的区块号或周期号或时间戳，小于 `since` 字段，则验证失败。
* 否则，验证应该继续。

一个 cell 的锁脚本可以检查输入的 `since` 字段，当 `since` 不满足条件时返回无效，从而间接防止该 cell 被花费使用。

这实现构造一个对资金进行基于时间锁定的脚本的能力：

```ruby
# absolute time lock
# cell only can be spent when block number greater than 10000.
def unlock?
  input = CKB.load_current_input
  # fail if it is relative lock
  return false if input.since[63] == 1
  # fail if metric_flag is not block_number
  return false (input.since & 0x6000_0000_0000_0000) != (0b0000_0000 << 56)
  input.since > 10000
end
```

```ruby
# relative time lock
# cell only can be spent after 3 days after block that produced this cell get confirmed
def unlock?
  input = CKB.load_current_input
  # fail if it is absolute lock
  return false if input.since[63].zero?
  # fail if metric_flag is not timestamp
  return false (input.since & 0x6000_0000_0000_0000) != (0b0100_0000 << 56)
  # extract lower 56 bits and convert to seconds
  time = since & 0x00ffffffffffffff
  # check time must greater than 3 days
  time > 3 * 24 * 3600
end
```

```ruby
# relative time lock with epoch number
# cell only can be spent in next epoch
def unlock?
  input = CKB.load_current_input
  # fail if it is absolute lock
  return false if input.since[63].zero?
  # fail if metric_flag is not epoch number
  return false (input.since & 0x6000_0000_0000_0000) != (0b0010_0000 << 56)
  # extract lower 56 bits and convert to value
  epoch_number = since & 0x00ffffffffffffff
  # enforce only can unlock in next or further epochs
  epoch_number >= 1
end
```

&nbsp;
## 详细说明

`since` 应该使用过去的 11 个区块的时间戳的中位数来进行验证，而不是 `metrice flag` 为 10 时使用的区块时间戳，这样可以防止在时间戳上撒谎，因为矿工可能会通过在一个区块中包含更多不成熟的交易来赚取更多的手续费。

从过去的 11 个区块时间戳（在区块的父块中）中计算出区块时间的中位数，如果区块数不够且为奇数，我们选择较老的时间戳作为中位数，详细的行为定义见如下代码：

```rust
pub trait BlockMedianTimeContext {
    fn median_block_count(&self) -> u64;

    /// Return timestamp and block_number of the corresponding bloch_hash, and hash of parent block
    fn timestamp_and_parent(&self, block_hash: &H256) -> (u64, BlockNumber, H256);

    /// Return past block median time, **including the timestamp of the given one**
    fn block_median_time(&self, block_hash: &H256) -> u64 {
        let median_time_span = self.median_block_count();
        let mut timestamps: Vec<u64> = Vec::with_capacity(median_time_span as usize);
        let mut block_hash = block_hash.to_owned();
        for _ in 0..median_time_span {
            let (timestamp, block_number, parent_hash) = self.timestamp_and_parent(&block_hash);
            timestamps.push(timestamp);
            block_hash = parent_hash;

            if block_number == 0 {
                break;
            }
        }

        // return greater one if count is even.
        timestamps.sort();
        timestamps[timestamps.len() >> 1]
    }
}
```

`since` 交易的验证，定义如下代码：


```rust
const LOCK_TYPE_FLAG: u64 = 1 << 63;
const METRIC_TYPE_FLAG_MASK: u64 = 0x6000_0000_0000_0000;
const VALUE_MASK: u64 = 0x00ff_ffff_ffff_ffff;
const REMAIN_FLAGS_BITS: u64 = 0x1f00_0000_0000_0000;

enum SinceMetric {
    BlockNumber(u64),
    EpochNumber(u64),
    Timestamp(u64),
}

/// RFC 0017
#[derive(Copy, Clone, Debug)]
pub(crate) struct Since(pub(crate) u64);

impl Since {
    pub fn is_absolute(self) -> bool {
        self.0 & LOCK_TYPE_FLAG == 0
    }

    #[inline]
    pub fn is_relative(self) -> bool {
        !self.is_absolute()
    }

    pub fn flags_is_valid(self) -> bool {
        (self.0 & REMAIN_FLAGS_BITS == 0)
            && ((self.0 & METRIC_TYPE_FLAG_MASK) != METRIC_TYPE_FLAG_MASK)
    }

    fn extract_metric(self) -> Option<SinceMetric> {
        let value = self.0 & VALUE_MASK;
        match self.0 & METRIC_TYPE_FLAG_MASK {
            //0b0000_0000
            0x0000_0000_0000_0000 => Some(SinceMetric::BlockNumber(value)),
            //0b0010_0000
            0x2000_0000_0000_0000 => Some(SinceMetric::EpochNumber(value)),
            //0b0100_0000
            0x4000_0000_0000_0000 => Some(SinceMetric::Timestamp(value * 1000)),
            _ => None,
        }
    }
}

/// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md#detailed-specification
pub struct SinceVerifier<'a, M> {
    rtx: &'a ResolvedTransaction<'a>,
    block_median_time_context: &'a M,
    block_number: BlockNumber,
    epoch_number: EpochNumber,
    parent_hash: &'a H256,
    median_timestamps_cache: RefCell<LruCache<H256, u64>>,
}

impl<'a, M> SinceVerifier<'a, M>
where
    M: BlockMedianTimeContext,
{
    pub fn new(
        rtx: &'a ResolvedTransaction,
        block_median_time_context: &'a M,
        block_number: BlockNumber,
        epoch_number: BlockNumber,
        parent_hash: &'a H256,
    ) -> Self {
        let median_timestamps_cache = RefCell::new(LruCache::new(rtx.resolved_inputs.len()));
        SinceVerifier {
            rtx,
            block_median_time_context,
            block_number,
            epoch_number,
            parent_hash,
            median_timestamps_cache,
        }
    }

    fn parent_median_time(&self, block_hash: &H256) -> u64 {
        let (_, _, parent_hash) = self
            .block_median_time_context
            .timestamp_and_parent(block_hash);
        self.block_median_time(&parent_hash)
    }

    fn block_median_time(&self, block_hash: &H256) -> u64 {
        if let Some(median_time) = self.median_timestamps_cache.borrow().get(block_hash) {
            return *median_time;
        }

        let median_time = self.block_median_time_context.block_median_time(block_hash);
        self.median_timestamps_cache
            .borrow_mut()
            .insert(block_hash.clone(), median_time);
        median_time
    }

    fn verify_absolute_lock(&self, since: Since) -> Result<(), TransactionError> {
        if since.is_absolute() {
            match since.extract_metric() {
                Some(SinceMetric::BlockNumber(block_number)) => {
                    if self.block_number < block_number {
                        return Err(TransactionError::Immature);
                    }
                }
                Some(SinceMetric::EpochNumber(epoch_number)) => {
                    if self.epoch_number < epoch_number {
                        return Err(TransactionError::Immature);
                    }
                }
                Some(SinceMetric::Timestamp(timestamp)) => {
                    let tip_timestamp = self.block_median_time(self.parent_hash);
                    if tip_timestamp < timestamp {
                        return Err(TransactionError::Immature);
                    }
                }
                None => {
                    return Err(TransactionError::InvalidSince);
                }
            }
        }
        Ok(())
    }

    fn verify_relative_lock(
        &self,
        since: Since,
        cell_meta: &CellMeta,
    ) -> Result<(), TransactionError> {
        if since.is_relative() {
            let cell = match cell_meta.block_info {
                Some(ref block_info) => block_info,
                None => return Err(TransactionError::Immature),
            };
            match since.extract_metric() {
                Some(SinceMetric::BlockNumber(block_number)) => {
                    if self.block_number < cell.number + block_number {
                        return Err(TransactionError::Immature);
                    }
                }
                Some(SinceMetric::EpochNumber(epoch_number)) => {
                    if self.epoch_number < cell.epoch + epoch_number {
                        return Err(TransactionError::Immature);
                    }
                }
                Some(SinceMetric::Timestamp(timestamp)) => {
                    // pass_median_time(current_block) starts with tip block, which is the
                    // parent of current block.
                    // pass_median_time(input_cell's block) starts with cell_block_number - 1,
                    // which is the parent of input_cell's block
                    let cell_median_timestamp = self.parent_median_time(&cell.hash);
                    let current_median_time = self.block_median_time(self.parent_hash);
                    if current_median_time < cell_median_timestamp + timestamp {
                        return Err(TransactionError::Immature);
                    }
                }
                None => {
                    return Err(TransactionError::InvalidSince);
                }
            }
        }
        Ok(())
    }

    pub fn verify(&self) -> Result<(), TransactionError> {
        for (resolved_out_point, input) in self
            .rtx
            .resolved_inputs
            .iter()
            .zip(self.rtx.transaction.inputs())
        {
            if resolved_out_point.cell().is_none() {
                continue;
            }
            let cell_meta = resolved_out_point.cell().unwrap();
            // ignore empty since
            if input.since == 0 {
                continue;
            }
            let since = Since(input.since);
            // check remain flags
            if !since.flags_is_valid() {
                return Err(TransactionError::InvalidSince);
            }

            // verify time lock
            self.verify_absolute_lock(since)?;
            self.verify_relative_lock(since, cell_meta)?;
        }
        Ok(())
    }
}
```
