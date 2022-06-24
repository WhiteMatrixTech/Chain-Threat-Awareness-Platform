import Graphin, { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';
import IconLoader from '@antv/graphin-icons';
import { v4 as uuidv4 } from 'uuid';

import { randomNum, transformAddress } from '@/utils/common';

const icons = Graphin.registerFontFamily(IconLoader);

enum HealthTag {
  LARGE_TRANSACTION = '大额交易',
  IRREGULARS_TRANSACTION = '非常规交易',
  FREQUENT_TRANSACTION = '频繁交易'
}

enum EdgeType {
  SOURCE = 'SOURCE', // 来源
  PLACE = 'PLACE', // 去向
  TARGET = 'TARGET' // 交易对象
}

const edgeStrokeColors = {
  [EdgeType.SOURCE]: '#009f6a',
  [EdgeType.PLACE]: '#cf1322',
  [EdgeType.TARGET]: '#929292'
};

interface IAddressAnalysisDetail {
  address: string;
  transferInMatchAmount: number;
  transferOutMatchAmount: number;
  balance: number;
  firstTxTimestamp: string;
  txNumber: number;
  maxTxAmount: number;
  allReceivedAmount: number;
  allSendedAmount: number;
  addressHealth: number;
  healthTags: HealthTag[];
}

const setEdge = (data: {
  source: string;
  target: string;
  text: string;
  type: EdgeType;
}) => {
  const { source, target, text, type } = data;
  return {
    source,
    target,
    style: {
      label: {
        value: text,
        fill: '#929292',
        fontSize: 12
      },
      keyshape: {
        stroke: edgeStrokeColors[type],
        endArrow: {
          path: 'M 0,0 L 8,4 L 8,-4 Z',
          fill: edgeStrokeColors[type]
        }
      }
    }
  };
};

const setNode = (address: string) => {
  return {
    id: address,
    style: {
      keyshape: {
        size: 35
      },
      label: {
        value: transformAddress(address)
      },
      icon: {
        fontFamily: 'graphin',
        type: 'font' as 'font' | 'text' | 'image',
        value: icons.home as string
      }
    }
  };
};

const initQueryAddress = '0x30c919b3499B02709875Dd427fC51FDc5615e849';
const initGraphData = {
  edges: [],
  nodes: [setNode(initQueryAddress)]
};

const AddressDetailData: IAddressAnalysisDetail = {
  address: '0x30c919b3499B02709875Dd427fC51FDc5615e849',
  transferInMatchAmount: 102,
  transferOutMatchAmount: 397,
  balance: 51.7075951,
  firstTxTimestamp: '2015-09-09 20:11:14',
  txNumber: 819,
  maxTxAmount: 499999,
  allReceivedAmount: 916202.32195907,
  allSendedAmount: 916146.62730697,
  addressHealth: 5.3,
  healthTags: [
    HealthTag.IRREGULARS_TRANSACTION,
    HealthTag.LARGE_TRANSACTION,
    HealthTag.FREQUENT_TRANSACTION
  ]
};

const generateData = (address: string, type: EdgeType): GraphinData => {
  const nodeNumber = randomNum(1, 3);
  const nodes: IUserNode[] = [];
  const edges: IUserEdge[] = [];

  for (let i = 0; i < nodeNumber; i++) {
    const id = `0x${uuidv4()}`;
    const txNumber = randomNum(1, 3);
    const txAmount = Math.random().toFixed(3);

    const text = `${txAmount}ETH - ${txNumber}笔`;
    const source = type === EdgeType.SOURCE ? id : address;
    const target = type === EdgeType.SOURCE ? address : id;

    nodes.push(setNode(id));
    edges.push(setEdge({ source, target, text, type }));
  }

  return {
    nodes,
    edges
  };
};

export {
  AddressDetailData,
  EdgeType,
  generateData,
  initGraphData,
  initQueryAddress,
  setEdge,
  setNode
};

export type { IAddressAnalysisDetail };
