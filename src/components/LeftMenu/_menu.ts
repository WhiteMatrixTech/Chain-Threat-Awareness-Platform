/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { MenuProps } from 'antd';
import { cloneDeep } from 'lodash';

import { flatTreeData, ITree } from '@/utils/common';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type MenuItem = Required<MenuProps>['items'][number];

export const MenuList: MenuItem[] = [
  {
    label: '数据仓库',
    key: '/data-store'
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '威胁感知',
    key: '/threat-detection',
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
      },
      {
        label: '查看报表',
        key: '/threat-detection/detection-chart'
      }
    ]
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '威胁取证',
    key: '/threat-evidence',
    children: [
      {
        label: '地址分析',
        key: '/threat-evidence/address-analysis'
      },
      {
        label: '交易图谱',
        key: '/threat-evidence/transaction-graph'
      }
    ]
  },
  {
    label: 'split',
    key: ''
  },
  {
    label: '数据大屏',
    key: '/data-screens'
  }
];

export const flatMenuList = flatTreeData(cloneDeep(MenuList) as ITree[]);
