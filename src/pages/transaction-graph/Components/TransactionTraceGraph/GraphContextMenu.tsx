/* eslint-disable no-case-declarations */
import { Components, ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import { cloneDeep } from 'lodash';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  // generateTxGraphData,
  ITxGraphData,
  ITxGraphEdge,
  ITxGraphNode,
  removeDataFromGraph,
  TxGraphMenuItemKeys
} from '@/services/mockData/transactionGraph';
import {
  getInAddressTransaction,
  getOutAddressTransaction
} from '@/services/transaction';

const { ContextMenu } = Components;

const getMenuItem = (
  id: string,
  flowType: string,
  txGraphData: ITxGraphData
) => {
  const items = [
    {
      label: flowType === 'inflow' ? '展开左侧' : '展开右侧',
      key:
        flowType === 'inflow'
          ? TxGraphMenuItemKeys.EXPAND_LEFT_SIDES
          : TxGraphMenuItemKeys.EXPAND_RIGHT_SIDES
    }
    /* {
      label: flowType === 'inflow' ? '向右收起' : '向左收起',
      key: TxGraphMenuItemKeys.COLLAPSE_BOTH_SIDES
    } */
  ];

  const haveRelativeNode = txGraphData.edges.find((edge) => {
    return flowType === 'inflow' ? edge.target === id : edge.source === id;
  });

  if (!haveRelativeNode) {
    return items;
  }

  return items.concat([
    {
      label: flowType === 'inflow' ? '收起左侧' : '收起右侧',
      key: TxGraphMenuItemKeys.COLLAPSE_BOTH_SIDES
    }
  ]);
};

const getGraphData = async (data: {
  menuKey: TxGraphMenuItemKeys;
  txHash: string;
  txGraphData: ITxGraphData;
  flowType: 'inflow' | 'outflow' | '';
}) => {
  const { menuKey, txHash, txGraphData, flowType } = data;

  const preGraphData = cloneDeep(txGraphData);
  let nodes: ITxGraphNode[] = [];
  let edges: ITxGraphEdge[] = [];

  const nodeItem: ITxGraphNode[] = [];
  const edgeItem: ITxGraphEdge[] = [];

  switch (menuKey) {
    case TxGraphMenuItemKeys.EXPAND_LEFT_SIDES:
      const inData = await getInAddressTransaction({
        address: txHash,
        fromBlock: '0',
        toBlock: 'latest',
        count: 5
      });

      inData.splice(0, 5).forEach((item) => {
        nodeItem.push({
          id: item.address,
          type: 'AmountFlowAddressNode',
          tokenAmount: item.value,
          tokenUnit: 'ETH',
          flowType: 'inflow'
        });
        const txNumber = item.count;
        const txAmount = Number(item.value) / 1e18;
        edgeItem.push({
          id: `${uuidv4().replaceAll('-', '')}`,
          source: item.address,
          target: txHash,
          style: {
            type: 'poly',
            label: {
              value: `${txAmount}ETH - ${txNumber}笔`,
              offset: [0, 0]
            }
          }
        });
      });
      // [nodes, edges] = generateTxGraphData(txHash, 'inflow');

      nodes = preGraphData.nodes.concat(nodeItem);
      edges = preGraphData.edges.concat(edgeItem);
      break;
    case TxGraphMenuItemKeys.EXPAND_RIGHT_SIDES:
      // eslint-disable-next-line no-case-declarations
      const outData = await getOutAddressTransaction({
        address: txHash,
        fromBlock: '0',
        toBlock: 'latest',
        count: 5
      });

      outData.splice(0, 5).forEach((item) => {
        const txNumber = item.count;
        const txAmount = Number(item.value) / 1e18;
        nodeItem.push({
          id: item.address,
          type: 'AmountFlowAddressNode',
          tokenAmount: item.value,
          tokenUnit: 'ETH',
          flowType: 'outflow'
        });

        edgeItem.push({
          id: `${uuidv4().replaceAll('-', '')}`,
          source: txHash,
          target: item.address,
          style: {
            type: 'poly',
            label: {
              value: `${txAmount}ETH - ${txNumber}笔`,
              offset: [0, 0]
            }
          }
        });
      });

      // [nodes, edges] = generateTxGraphData(txHash, 'outflow');

      nodes = preGraphData.nodes.concat(nodeItem);
      edges = preGraphData.edges.concat(edgeItem);

      break;
    case TxGraphMenuItemKeys.COLLAPSE_TO_CENTER:
      // 向中心收缩，具体流向由flowType决定
      [nodes, edges] = removeDataFromGraph(
        txHash,
        preGraphData,
        flowType,
        true
      );
      break;
    case TxGraphMenuItemKeys.COLLAPSE_BOTH_SIDES:
      // 收起左侧或右侧，具体流向由flowType决定
      [nodes, edges] = removeDataFromGraph(txHash, preGraphData, flowType);
      break;
    default:
      break;
  }

  return { nodes, edges };
};

export const MenuContent = (props: {
  value: ContextMenuValue;
  txGraphData: ITxGraphData;
  changeData: (
    data: ITxGraphData,
    setLoading?: boolean
  ) => Promise<ITxGraphData | undefined>;
}) => {
  const { value, txGraphData, changeData } = props;
  const { id, item, onClose } = value;
  const { type, flowType = '' } = item?.getModel() as ITxGraphNode;

  const handleClick = async (e: { key: string }) => {
    const nextGraphData = await getGraphData({
      menuKey: e.key as TxGraphMenuItemKeys,
      txHash: id,
      flowType,
      txGraphData
    });

    const setLoading = ![
      TxGraphMenuItemKeys.COLLAPSE_TO_CENTER,
      TxGraphMenuItemKeys.COLLAPSE_BOTH_SIDES
    ].includes(e.key as TxGraphMenuItemKeys);

    await changeData(nextGraphData, setLoading);

    onClose();
  };

  const menuItems = useMemo(() => {
    if (type === 'AmountFlowAddressNode') {
      const items = getMenuItem(id, flowType, txGraphData);

      return items;
    }
    // return [
    //   { label: '展开左侧', key: TxGraphMenuItemKeys.EXPAND_LEFT_SIDES },
    //   { label: '展开右侧', key: TxGraphMenuItemKeys.EXPAND_RIGHT_SIDES }
    // ];
  }, [id, type, flowType, txGraphData]);

  if (type === 'CenterTxNode') {
    return null;
  }

  return <Menu onClick={(e) => void handleClick(e)} items={menuItems} />;
};

export const GraphContextMenu = ({
  txGraphData,
  changeData
}: {
  txGraphData: ITxGraphData;
  changeData: (
    data: ITxGraphData,
    setLoading?: boolean
  ) => Promise<ITxGraphData | undefined>;
}) => {
  return (
    <ContextMenu style={{ background: '#fff' }} bindType="node">
      {(value) => {
        return (
          <MenuContent
            value={value}
            changeData={changeData}
            txGraphData={txGraphData}
          />
        );
      }}
    </ContextMenu>
  );
};
