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
    label: '威胁感知',
    key: '/threat-detection',
    children: [
      {
        label: '合约检测',
        key: '/threat-detection/contract-detection'
      }
    ]
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
  }
];

export const flatMenuList = flatTreeData(cloneDeep(MenuList) as ITree[]);
