/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docsSidebar: {
    Docusaurus: ['docs/doc1', 'docs/doc2', 'docs/doc3'],
    Features: ['docs/mdx'],
  },

  rfcsSidebar:{
    Introduction:['rfcs/introduction'],
    Information:['rfcs/0001-positioning/0001-positioning'],
  },

  qaSidebar:{
    介绍:['qa/welcome','qa/contribute'],
    常见问题:[
      {
        type: 'category',
        label:'关于 Nervos',
        items:['qa/nervos/nervos1'],
      },
      {
        type: 'category',
        label:'关于 CKB',
        items:['qa/ckb/ckb1'],
      },
      {
        type: 'category',
        label:'关于 Nervos DAO',
        items:['qa/nervosdao/dao1'],
      }
    ],
    导航:[
      'qa/guide/grants',
    ],
  }
};
