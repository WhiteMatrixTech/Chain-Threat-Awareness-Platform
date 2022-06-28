import { EdgeConfig, NodeConfig } from '@antv/g6-core';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { randomNum } from '@/utils/common';
interface ITxGraphNode extends NodeConfig {
  id: string;
  type: 'DefaultTxNode' | 'CenterTxNode' | 'AmountFlowAddressNode' | string;
  isSelected: boolean;
  tokenUnit?: string;
  tokenAmount?: string | number;
  flowType?: 'inflow' | 'outflow';
}

interface ITxGraphEdge extends EdgeConfig {
  source: string;
  target: string;
}

interface ITxGraphData {
  nodes: ITxGraphNode[];
  edges: ITxGraphEdge[];
}

interface ITransactionDetailData {
  transactionHash: string;
  type: string;
  gas: number;
  timestamp: string;
  inputValue: number;
  outputValue: number;
  inputAddressNumber: number;
  outputAddressNumber: number;
  inputTxNumber: number;
  outputTxNumber: number;
}

interface IAddressDetailData {
  address: string;
  balance: number;
  inflowAmount: number;
  outflowAmount: number;
}

const generateTxGraphData = (
  txHash: string,
  flowType: 'inflow' | 'outflow',
  tokenUnit = 'BTC'
): [ITxGraphNode[], ITxGraphEdge[]] => {
  const addresses = [
    `${uuidv4().replaceAll('-', '')}`,
    `${uuidv4().replaceAll('-', '')}`
  ];
  const transactions = [`${uuidv4()}${uuidv4()}`, `${uuidv4()}${uuidv4()}`].map(
    (tx) => tx.replaceAll('-', '')
  );
  const nodes: ITxGraphNode[] = [];
  const edges: ITxGraphEdge[] = [];
  addresses.forEach((address, index) => {
    const tokenAmount = (Math.random() * 1000).toFixed(4);
    const node1: ITxGraphNode = {
      id: address,
      type: 'AmountFlowAddressNode',
      isSelected: false,
      tokenAmount,
      tokenUnit,
      flowType
    };
    const node2: ITxGraphNode = {
      id: transactions[index],
      type: 'DefaultTxNode',
      isSelected: false,
      tokenAmount: Number(tokenAmount).toFixed(0),
      tokenUnit,
      flowType
    };

    nodes.push(node1);
    nodes.push(node2);

    let edge1: ITxGraphEdge;
    let edge2: ITxGraphEdge;
    if (flowType === 'inflow') {
      edge1 = {
        source: transactions[index],
        target: address
      };
      edge2 = {
        source: address,
        target: txHash
      };
    } else {
      edge1 = {
        source: txHash,
        target: address
      };
      edge2 = {
        source: address,
        target: transactions[index]
      };
    }
    edges.push(edge1);
    edges.push(edge2);
  });

  return [nodes, edges];
};

const txType = ['转账', '混币'];
const randomTxDetailData = (
  transactionHash: string
): ITransactionDetailData => {
  const typeIndex = randomNum(0, 1);
  const gas = Math.random() / 100;
  const timestamp = dayjs()
    .subtract(randomNum(1, 20), 'second')
    .format('YYYY-MM-DD hh:mm:ss');
  const inputValue = Math.random() * 1000;
  const outputValue = inputValue - gas;
  const inputAddressNumber = randomNum(1, 20);
  const outputAddressNumber = randomNum(1, 20);
  const inputTxNumber = randomNum(1, 50);
  const outputTxNumber = randomNum(1, 10);

  return {
    transactionHash,
    type: txType[typeIndex],
    gas,
    timestamp,
    inputValue,
    outputValue,
    inputAddressNumber,
    outputAddressNumber,
    inputTxNumber,
    outputTxNumber
  };
};

const randomAddressData = (address: string): IAddressDetailData => {
  return {
    address,
    balance: Math.random() * randomNum(0, 100),
    inflowAmount: Math.random() * randomNum(100, 1000),
    outflowAmount: Math.random() * randomNum(100, 1000)
  };
};

export { generateTxGraphData, randomAddressData, randomTxDetailData };

export type { IAddressDetailData, ITransactionDetailData, ITxGraphData };
