/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  someSidebar: {
    Docusaurus: ['doc1', 'doc2', 'doc3'],
    Features: ['mdx'],
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
        items:['qa/nervos/doc1']
      },
      {
        type: 'category',
        label:'关于 CKB',
        items:['qa/ckb/doc1']
      },
      {
        type: 'category',
        label:'关于 Nervos DAO',
        items:['qa/nervosdao/doc1']
      }
    ],
    导航:[
      'qa/guide/grants',
    ],
  }
};
