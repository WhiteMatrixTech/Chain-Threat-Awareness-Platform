/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-30 11:15:05
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 16:43:35
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { MenuProps } from 'antd';
import { cloneDeep } from 'lodash';

import NabLogo1 from '@/assets/navLogo1.png';
import NabLogo2 from '@/assets/navLogo2.png';
import NabLogo3 from '@/assets/navLogo3.png';
import NabLogo4 from '@/assets/navLogo4.png';
import { flatTreeData, ITree } from '@/utils/common';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type MenuItem = Required<MenuProps>['items'][number];

export const MenuList: any[] = [
  {
    label: '数据仓库',
    key: '/data-store',
    src: NabLogo1
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '威胁感知',
    key: '/threat-detection',
    src: NabLogo2,

    children: [
      {
        label: '智能合约漏洞检测',
        key: '/threat-detection/contract-detection'
      },
      {
        label: '自私挖矿检测',
        key: '/threat-detection/detection-privacy'
      },
      {
        label: '抢跑攻击检测',
        key: '/threat-detection/detection-attack'
      },
      {
        label: '钓鱼地址检测',
        key: '/threat-detection/detection-fish'
      }
      // {
      //   label: '查看报表',
      //   key: '/threat-detection/detection-chart'
      // }
    ]
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '威胁取证',
    key: '/threat-evidence',
    src: NabLogo3,

    children: [
      {
        label: '地址分析',
        key: '/threat-evidence/address-analysis'
      },
      {
        label: '交易图谱',
        key: '/threat-evidence/transaction-graph'
      },
      {
        label: '身份推断',
        key: '/threat-evidence/identity-inference'
      },
      {
        label: '少样本身份推断',
        key: '/threat-evidence/fewidentity-inference'
      },
      {
        label: '恶意交易检测',
        key: '/threat-evidence/malicious-transaction'
      },
      {
        label: '跨链查询取证',
        key: '/threat-evidence/cross-chain'
      },
      {
        label: '链码漏洞检测',
        key: '/threat-evidence/chaincodevulnerability-detection'
      },
      {
        label: '比特币混币检测',
        key: '/threat-evidence/bitcoinmixedcoin-detection'
      }
    ]
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '数据大屏',
    key: '/data-screens',
    src: NabLogo4
  }
];

export const flatMenuList = flatTreeData(cloneDeep(MenuList) as ITree[]);
