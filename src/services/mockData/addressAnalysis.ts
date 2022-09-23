import Graphin, { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';
import IconLoader from '@antv/graphin-icons';
import dayjs from 'dayjs';
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

interface ITxDetail {
  from: string;
  to: string;
  txNumber: number;
  txAmount: number;
  firstTxTimestamp: string;
  recentTxTimestamp: string;
}

export interface IEdgeData {
  type: EdgeType;
  txNumber: number;
  txAmount: number | string;
  firstTransactionTimestamp: number | string;
  lastTransactionTimestamp: number | string;
}

interface labelType {
  value: string;
  fill: string;
  fontSize: number;
}

interface keyshapeType {
  stroke: string;
  endArrow: {
    path: string;
    fill: string;
  };
}

interface IEdgeStyle {
  label: labelType;
  keyshape: keyshapeType;
}
export interface IEdge {
  source: string;
  target: string;
  id: string;
  data: IEdgeData;
  style: IEdgeStyle;
}

const setEdge = (data: {
  hash: string;
  source: string;
  target: string;
  type: EdgeType;
  txNumber: number;
  txAmount: number | string;
  firstTransactionTimestamp: number | string;
  lastTransactionTimestamp: number | string;
}) => {
  const {
    hash,
    source,
    target,
    type,
    txNumber,
    txAmount,
    firstTransactionTimestamp,
    lastTransactionTimestamp
  } = data;
  const text = `${txAmount}ETH - ${txNumber}笔`;

  return {
    source,
    target,
    id: hash,
    data: {
      txAmount,
      txNumber,
      firstTransactionTimestamp,
      lastTransactionTimestamp,
      type
    },
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
        value: icons.question as string
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
  addressHealth: 1,
  healthTags: [
    HealthTag.IRREGULARS_TRANSACTION,
    HealthTag.LARGE_TRANSACTION,
    HealthTag.FREQUENT_TRANSACTION
  ]
};

const generateGraphData = (address: string, type: EdgeType): GraphinData => {
  const nodeNumber = randomNum(1, 3);
  const nodes: IUserNode[] = [];
  const edges: IUserEdge[] = [];

  for (let i = 0; i < nodeNumber; i++) {
    const id = `0x${uuidv4().replaceAll('-', '')}`;

    const hash = `0x${uuidv4()}${uuidv4()}`.replaceAll('-', '');
    const txNumber = randomNum(1, 3);
    const txAmount = Math.random().toFixed(3);
    const firstTransactionTimestamp = dayjs()
      .subtract(randomNum(1, 20), 'second')
      .format('YYYY-MM-DD hh:mm:ss');

    const lastTransactionTimestamp = dayjs()
      .subtract(randomNum(1, 20), 'second')
      .format('YYYY-MM-DD hh:mm:ss');

    const source = type === EdgeType.SOURCE ? id : address;
    const target = type === EdgeType.SOURCE ? address : id;

    nodes.push(setNode(id));
    edges.push(
      setEdge({
        hash,
        source,
        target,
        type,
        txAmount,
        firstTransactionTimestamp,
        lastTransactionTimestamp,
        txNumber
      })
    );
  }

  return {
    nodes,
    edges
  };
};

const generateAddressData = (address: string): IAddressAnalysisDetail => {
  const transferInMatchAmount = randomNum(10, 200);
  const transferOutMatchAmount = randomNum(10, 200);
  const balance = Number((Math.random() * 100).toFixed(3));
  const firstTxTimestamp = dayjs()
    .subtract(randomNum(1, 20), 'second')
    .format('YYYY-MM-DD hh:mm:ss');
  const txNumber = randomNum(10, 1000);
  const maxTxAmount = randomNum(10, 10000);
  const allReceivedAmount = Number((Math.random() * 1000).toFixed(4));
  const allSendedAmount = Number((Math.random() * 1000).toFixed(4));
  const addressHealth = Number(Math.random().toFixed(1));
  const healthTags = [
    HealthTag.IRREGULARS_TRANSACTION,
    HealthTag.LARGE_TRANSACTION,
    HealthTag.FREQUENT_TRANSACTION
  ];

  return {
    address,
    transferInMatchAmount,
    transferOutMatchAmount,
    balance,
    txNumber,
    maxTxAmount,
    firstTxTimestamp,
    allReceivedAmount,
    allSendedAmount,
    addressHealth,
    healthTags
  };
};

const generateEdgeTxData = (
  edge: IUserEdge & {
    data: {
      txNumber: number;
      txAmount: number;
    };
  }
): ITxDetail => {
  const randomDate = randomNum(1, 20);
  const firstTxTimestamp = dayjs()
    .subtract(randomNum(2, 20), 'second')
    .format('YYYY-MM-DD hh:mm:ss');
  const recentTxTimestamp = dayjs()
    .subtract(randomNum(1, randomDate), 'second')
    .format('YYYY-MM-DD hh:mm:ss');

  const txNumber = edge.data.txNumber;
  const txAmount = Number(edge.data.txAmount);

  return {
    from: edge.source ?? '',
    to: edge.target ?? '',
    txNumber,
    txAmount,
    firstTxTimestamp,
    recentTxTimestamp
  };
};

export {
  AddressDetailData,
  EdgeType,
  generateAddressData,
  generateEdgeTxData,
  generateGraphData,
  initGraphData,
  initQueryAddress,
  setEdge,
  setNode
};

export type { IAddressAnalysisDetail, ITxDetail };
