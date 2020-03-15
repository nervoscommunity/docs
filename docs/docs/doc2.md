---
id: doc2
title: "[初稿]自定义代币"
sidebar_label: 自定义代币
---

## UDT文件

```js

if (CKB.ARGV.length !== 1) {
  throw "Requires only one argument!";
}

var input_index = 0;
var input_coins = 0;
var buffer = new ArrayBuffer(4);
var ret = CKB.CODE.INDEX_OUT_OF_BOUND;

while (true) {
  ret = CKB.raw_load_cell_data(buffer, 0, input_index, CKB.SOURCE.GROUP_INPUT);
  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
    break;
  }
  if (ret !== 4) {
    throw "Invalid input cell!";
  }
  var view = new DataView(buffer);
  input_coins += view.getUint32(0, true);
  input_index += 1;
}

var output_index = 0;
var output_coins = 0;

while (true) {
  ret = CKB.raw_load_cell_data(buffer, 0, output_index, CKB.SOURCE.GROUP_OUTPUT);
  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
    break;
  }
  if (ret !== 4) {
    throw "Invalid output cell!";
  }
  var view = new DataView(buffer);
  output_coins += view.getUint32(0, true);
  output_index += 1;
}

if (input_coins !== output_coins) {
  if (!((input_index === 0) && (output_index === 1))) {
    throw "Invalid token issuing mode!";
  }
  var first_input = CKB.load_input(0, 0, CKB.SOURCE.INPUT);
  if (typeof first_input === "number") {
    throw "Cannot fetch the first input";
  }
  var hex_input = Array.prototype.map.call(
    new Uint8Array(first_input),
    function(x) { return ('00' + x.toString(16)).slice(-2); }).join('');
  if (CKB.ARGV[0] != hex_input) {
    throw "Invalid creation argument!";
  }
}
```

为了能在 CKB 上运行 JavaScript，让我们首先在 CKB 上部署 duktape：

```ruby live
# ruby code

api = CKB::API.new

miner = CKB::Wallet.from_hex(api, "0x3df087b48f8b646e3725a95323ec27536b17a8960a8774aeb52ef21d22f721df") # 由矿工私钥得到账户

puts miner.get_balance # 查看余额

wallet = CKB::Wallet.from_hex(api, CKB::Key.random_private_key) # 新钱包
wallet2 = CKB::Wallet.from_hex(api, CKB::Key.random_private_key) # 新钱包

miner.send_capacity(wallet.address, 10000*(10**8), fee: 1000) # 转账

duktape_data = File.read("ckb-duktape/build/duktape")
duktape_data.bytesize

duktape_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(300000), CKB::Utils.bin_to_hex(duktape_data), fee: 5000)

duktape_data_hash = CKB::Blake2b.hexdigest(duktape_data)
duktape_out_point = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_tx_hash, index: 0))

# 首先，让我们创建一个包含 1000000 tokens 的 UDT：

tx = wallet.generate_tx(wallet.address, CKB::Utils.byte_to_shannon(20000), fee: 5000)
tx.cell_deps.push(duktape_out_point.dup)

# arg = CKB::Utils.bin_to_hex(CKB::Serializers::InputSerializer.new(tx.inputs[0]).serialize)

duktape_udt_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex(File.read("udt.js")) )

tx.outputs[0].type = duktape_udt_script

tx.outputs_data[0] = CKB::Utils.bin_to_hex([1000000].pack("L<"))

signed_tx = tx.sign(wallet.key)

root_udt_tx_hash = api.send_transaction(signed_tx)

# 如果我们再次尝试提交相同的交易，则双花将阻止我们伪造相同的 token：

api.send_transaction(signed_tx)

# CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"UnresolvableTransaction(Dead(OutPoint(0x0b607e9599f23a8140d428bd24880e5079de1f0ee931618b2f84decf2600383601000000)))"}

```

无论我们如何尝试，我们都无法创建另一个想要伪造相同 UDT token 的 cell 。

现在我们可以尝试将 UDTs 转移到另一个帐户。首先让我们尝试创建一个输出 UDTs 比输入 UDTs 更多的交易：

```ruby
udt_out_point = CKB::Types::OutPoint.new(tx_hash: root_udt_tx_hash, index: 0)

tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(20000), fee: 5000)

tx.cell_deps.push(duktape_out_point.dup)

tx.witnesses.push(CKB::Types::Witness.new ) # 不能这么改

tx.outputs[0].type = duktape_udt_script

tx.outputs_data[0] = CKB::Utils.bin_to_hex([1000000].pack("L<"))

tx.inputs.push(CKB::Types::Input.new(previous_output: udt_out_point, since: 0))

tx.outputs.push(tx.outputs[1].dup)

tx.outputs[2].capacity = CKB::Utils::byte_to_shannon(20000)
tx.outputs[2].type = duktape_udt_script

tx.outputs_data.push(CKB::Utils.bin_to_hex([1000000].pack("L<")))

signed_tx = tx.sign(wallet.key)
api.send_transaction(signed_tx)

# CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"InvalidTx(ScriptFailure(ValidationFailure(-2)))"}

```

在这里，我们尝试发送另一个用户 1000000 UDTs，同时为发送者本身保留 1000000 UDTs，当然这应该会触发错误，因为我们正在尝试伪造更多 token。但稍作修改，我们可以证明，如果你遵守总和验证规则，UDT 转移交易是有效的：

```ruby
tx.outputs_data[0] = CKB::Utils.bin_to_hex([900000].pack("L<"))
tx.outputs_data[2] = CKB::Utils.bin_to_hex([100000].pack("L<"))

signed_tx = tx.sign(wallet.key)

api.send_transaction(signed_tx)
```