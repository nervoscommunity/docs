/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docsSidebar: {
    认识CKB: [
      {
        type: 'category',
        label: '开发入门',
        items: [
          'docs/start-build-dev',
          'docs/start-deploy-script',
          'docs/ckb-cli',
          'docs/testnet',
        ]
      },
    ],
    CKB客户端:[
      'docs/Clients/client-overview',
      'docs/Clients/client-ckb',
      'docs/Clients/client-ckb-cli',
      'docs/Clients/client-neuron',
    ],
    HTTPRPC:[
      'docs/HTTPRPC/interface-specification',
      'docs/HTTPRPC/rpc-specification'
    ],
    智能合约指南:[

    ],
    Dapp开发指南:[],
    SDKs:[
      'docs/SDKs/sdk-overview',
      'docs/SDKs/sdk-javascript',
      'docs/SDKs/sdk-ruby',
      'docs/SDKs/sdk-java',
    ],
    智能合约IDE:[],
    生态工具: ['docs/tools/ckb-studio'],
    常见问题:[]
  },

  rfcsSidebar:{
    Introduction:['rfcs/introduction'],
    Standards_Track:[
      'rfcs/0004-ckb-block-sync/0004-ckb-block-sync',
      'rfcs/0006-merkle-tree/0006-merkle-tree',
      'rfcs/0007-scoring-system-and-network-security/0007-scoring-system-and-network-security',
      'rfcs/0008-serialization/0008-serialization',
      'rfcs/0009-vm-syscalls/0009-vm-syscalls',
      'rfcs/0010-eaglesong/0010-eaglesong',
      'rfcs/0011-transaction-filter-protocol/0011-transaction-filter-protocol',
      'rfcs/0012-node-discovery/0012-node-discovery',
      'rfcs/0013-get-block-template/0013-get-block-template',
      'rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits',
      'rfcs/0017-tx-valid-since/0017-tx-valid-since',
      'rfcs/0021-ckb-address-format/0021-ckb-address-format',
      'rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw',
    ],
    Information:[
      'rfcs/0001-positioning/0001-positioning',
      'rfcs/0002-ckb/0002-ckb',
      'rfcs/0003-ckb-vm/0003-ckb-vm',
      'rfcs/0005-priviledged-mode/0005-priviledged-mode',
      'rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics',
      'rfcs/0019-data-structures/0019-data-structures',
      'rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol',
      'rfcs/0022-transaction-structure/0022-transaction-structure',
    ],
    简介_Introduction:['rfcs/introduction.zh'],
    标准_Standards_Track:[
      'rfcs/0004-ckb-block-sync/0004-ckb-block-sync.zh',
      'rfcs/0006-merkle-tree/0006-merkle-tree.zh',
      'rfcs/0007-scoring-system-and-network-security/0007-scoring-system-and-network-security.zh',
      'rfcs/0008-serialization/0008-serialization.zh',
      'rfcs/0009-vm-syscalls/0009-vm-syscalls.zh',
      'rfcs/0010-eaglesong/0010-eaglesong.zh',
      'rfcs/0011-transaction-filter-protocol/0011-transaction-filter-protocol.zh',
      'rfcs/0012-node-discovery/0012-node-discovery.zh',
      'rfcs/0013-get-block-template/0013-get-block-template.zh',
      'rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.zh',
      'rfcs/0017-tx-valid-since/0017-tx-valid-since.zh',
      'rfcs/0021-ckb-address-format/0021-ckb-address-format.zh',
      'rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.zh',
    ],
    信息_Information:[
      'rfcs/0001-positioning/0001-positioning.zh',
      'rfcs/0002-ckb/0002-ckb.zh',
      'rfcs/0003-ckb-vm/0003-ckb-vm.zh',
      'rfcs/0005-priviledged-mode/0005-priviledged-mode.zh',
      'rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh',
      'rfcs/0019-data-structures/0019-data-structures.zh',
      'rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.zh',
      'rfcs/0022-transaction-structure/0022-transaction-structure.zh',
    ],
  },

  qaSidebar:{
    介绍:[
      'qa/welcome',
      'qa/contribute',
    ],
    "关于 Nervos":[
      'qa/nervos/about-nervos',
//      'qa/nervos/nervos-innovations',
      'qa/nervos/compare-to-other',
    ],
    "关于 CKB":[
      'qa/ckb/about-ckb',
      'qa/ckb/ckb-solve-problems',
      'qa/ckb/about-cell',
      'qa/ckb/cell-ckb-vm',
    ],
    "关于 Layer2":[
      'qa/layer2/about-muta',
    ],
    "Nervos DAO":[
      'qa/nervosdao/about-dao',
      'qa/nervosdao/revenue-of-dao',
      'qa/nervosdao/deposit-in-dao',
      'qa/nervosdao/rule-of-dao',
    ],
    "CKB 钱包":[
      'qa/wallet/about-neuron',
      'qa/wallet/support-wallet',
    ],
    "关于 CKB 挖矿":[
      'qa/mine/about-mine-ckb',
      'qa/mine/pool-machine',
      'qa/mine/about-pow',
    ],
    区块浏览器:[
      'qa/explorer/about-explorer',
    ],
    "Grants 项目":[
      'qa/grants/introduction',
      'qa/grants/wishlist',
      'qa/grants/projects',
    ],
  }
};
