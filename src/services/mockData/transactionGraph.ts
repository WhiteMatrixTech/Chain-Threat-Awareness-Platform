import { EdgeConfig, NodeConfig } from '@antv/g6-core';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { randomNum } from '@/utils/common';

enum TxGraphMenuItemKeys {
  EXPAND_LEFT_SIDES = 'expand-left-side', // 向左展开
  EXPAND_RIGHT_SIDES = 'expand-right-side', // 向右展开
  COLLAPSE_TO_CENTER = 'collapse-to-center', // 向中心收缩
  COLLAPSE_BOTH_SIDES = 'collapse-both-sides' // 收起左侧或右侧
}
interface ITxGraphNode extends NodeConfig {
  id: string;
  type: 'DefaultTxNode' | 'CenterTxNode' | 'AmountFlowAddressNode' | string;
  isSelected?: boolean;
  tokenUnit?: string;
  tokenAmount?: string | number;
  flowType?: 'inflow' | 'outflow';
}

interface ITxGraphEdge extends EdgeConfig {
  id: string;
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
  tokenUnit = 'ETH'
): [ITxGraphNode[], ITxGraphEdge[]] => {
  const addresses = [
    `${uuidv4().replaceAll('-', '')}`
    // `${uuidv4().replaceAll('-', '')}`
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
      tokenAmount,
      tokenUnit,
      flowType
    };
    // const node2: ITxGraphNode = {
    //   id: transactions[index],
    //   type: 'DefaultTxNode',
    //   tokenAmount: Number(tokenAmount).toFixed(0),
    //   tokenUnit,
    //   flowType
    // };

    nodes.push(node1);
    // nodes.push(node2);

    let edge1: ITxGraphEdge;
    // let edge2: ITxGraphEdge;
    if (flowType === 'inflow') {
      edge1 = {
        id: `${uuidv4().replaceAll('-', '')}`,
        source: address,
        target: txHash
      };
      // edge2 = {
      //   id: `${uuidv4().replaceAll('-', '')}`,
      //   source: address,
      //   target: txHash
      // };
    } else {
      edge1 = {
        id: `${uuidv4().replaceAll('-', '')}`,
        source: txHash,
        target: address
      };
      // edge2 = {
      //   id: `${uuidv4().replaceAll('-', '')}`,
      //   source: address,
      //   target: transactions[index]
      // };
    }
    edges.push(edge1);
    // edges.push(edge2);
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

// 收起左侧或右侧时，找到所有移除的边
const getShouldRemoveEdges = (
  txHash: string,
  txGraphData: ITxGraphData,
  flowType: 'inflow' | 'outflow' | ''
) => {
  const preGraphData = cloneDeep(txGraphData);
  let shouldRemoveEdges: ITxGraphEdge[] = [];
  if (flowType === 'inflow') {
    const allParent = preGraphData.edges.filter(
      (edge) => edge.target === txHash
    );

    allParent.forEach((parentNode) => {
      const edges = getShouldRemoveEdges(
        parentNode.source,
        preGraphData,
        flowType
      );
      shouldRemoveEdges = shouldRemoveEdges.concat(edges);
    });

    shouldRemoveEdges = shouldRemoveEdges.concat(allParent);
  } else if (flowType === 'outflow') {
    const allChildren = preGraphData.edges.filter(
      (edge) => edge.source === txHash
    );

    allChildren.forEach((childrenNode) => {
      const edges = getShouldRemoveEdges(
        childrenNode.target,
        preGraphData,
        flowType
      );
      shouldRemoveEdges = shouldRemoveEdges.concat(edges);
    });

    shouldRemoveEdges = shouldRemoveEdges.concat(allChildren);
  }

  return shouldRemoveEdges;
};

// 向中心收起时，当前节点指向的下(上)一个交易直接的边也应移除
const getRestShouldRemoveEdges = (
  txHash: string,
  txGraphData: ITxGraphData,
  flowType: 'inflow' | 'outflow' | ''
) => {
  let lastNodeId = '';
  const preGraphData = cloneDeep(txGraphData);
  const shouldRemoveEdges: ITxGraphEdge[] = [];
  if (flowType === 'inflow') {
    const edge1 = preGraphData.edges.find((edge) => edge.source === txHash);
    const edge2 = preGraphData.edges.find(
      (edge) => edge.source === edge1?.target
    );
    lastNodeId = edge2?.target ?? '';
    edge1 && shouldRemoveEdges.push(edge1);
    edge2 && shouldRemoveEdges.push(edge2);
  } else if (flowType === 'outflow') {
    const edge1 = preGraphData.edges.find((edge) => edge.target === txHash);
    const edge2 = preGraphData.edges.find(
      (edge) => edge.target === edge1?.source
    );
    lastNodeId = edge2?.source ?? '';
    edge1 && shouldRemoveEdges.push(edge1);
    edge2 && shouldRemoveEdges.push(edge2);
  }

  return { shouldRemoveEdges, lastNodeId };
};

const removeDataFromGraph = (
  txHash: string,
  txGraphData: ITxGraphData,
  flowType: 'inflow' | 'outflow' | '',
  isCollapseToCenter?: boolean
): [ITxGraphNode[], ITxGraphEdge[]] => {
  let lastNodeId = txHash;
  let shouldRemoveEdges = getShouldRemoveEdges(txHash, txGraphData, flowType);

  if (isCollapseToCenter) {
    const data = getRestShouldRemoveEdges(txHash, txGraphData, flowType);
    lastNodeId = data.lastNodeId;
    shouldRemoveEdges = [...shouldRemoveEdges, ...data.shouldRemoveEdges];
  }

  const removeEdgeIdMap: Map<string, string> = new Map();
  const removeNodeMap: Map<string, string> = new Map();
  shouldRemoveEdges.forEach((edge) => {
    removeEdgeIdMap.set(edge.id, edge.id);
    removeNodeMap.set(edge.source, edge.source);
    removeNodeMap.set(edge.target, edge.target);
  });
  removeNodeMap.delete(lastNodeId);

  removeNodeMap.set(txHash, txHash);
  if (flowType === 'inflow') {
    const ede = txGraphData.edges.find((item) => item.source === txHash);
    ede && removeEdgeIdMap.set(ede.id, ede.id);
  }

  if (flowType === 'outflow') {
    const ede = txGraphData.edges.find((item) => item.target === txHash);
    ede && removeEdgeIdMap.set(ede.id, ede.id);
  }

  const nodes: ITxGraphNode[] = [];
  const edges: ITxGraphEdge[] = [];
  txGraphData.nodes.forEach((node) => {
    if (!removeNodeMap.has(node.id)) {
      nodes.push(node);
    }
  });
  txGraphData.edges.forEach((edge) => {
    if (!removeEdgeIdMap.has(edge.id)) {
      edges.push(edge);
    }
  });

  return [nodes, edges];
};

export {
  generateTxGraphData,
  getShouldRemoveEdges,
  randomAddressData,
  randomTxDetailData,
  removeDataFromGraph,
  TxGraphMenuItemKeys
};

export type {
  IAddressDetailData,
  ITransactionDetailData,
  ITxGraphData,
  ITxGraphEdge,
  ITxGraphNode
};
