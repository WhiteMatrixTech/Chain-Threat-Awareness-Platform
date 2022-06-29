import { Components, ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import { cloneDeep } from 'lodash';
import { useMemo } from 'react';

import {
  generateTxGraphData,
  ITxGraphData,
  ITxGraphEdge,
  ITxGraphNode,
  removeDataFromGraph,
  TxGraphMenuItemKeys
} from '@/services/mockData/transactionGraph';

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
    },
    {
      label: flowType === 'inflow' ? '向右收起' : '向左收起',
      key: TxGraphMenuItemKeys.COLLAPSE_TO_CENTER
    }
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

const getGraphData = (data: {
  menuKey: TxGraphMenuItemKeys;
  txHash: string;
  txGraphData: ITxGraphData;
  flowType: 'inflow' | 'outflow' | '';
}) => {
  const { menuKey, txHash, txGraphData, flowType } = data;

  const preGraphData = cloneDeep(txGraphData);
  let nodes: ITxGraphNode[] = [];
  let edges: ITxGraphEdge[] = [];

  switch (menuKey) {
    case TxGraphMenuItemKeys.EXPAND_LEFT_SIDES:
      [nodes, edges] = generateTxGraphData(txHash, 'inflow');
      nodes = preGraphData.nodes.concat(nodes);
      edges = preGraphData.edges.concat(edges);
      break;
    case TxGraphMenuItemKeys.EXPAND_RIGHT_SIDES:
      [nodes, edges] = generateTxGraphData(txHash, 'outflow');
      nodes = preGraphData.nodes.concat(nodes);
      edges = preGraphData.edges.concat(edges);
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

  const handleClick = (e: { key: string }) => {
    const nextGraphData = getGraphData({
      menuKey: e.key as TxGraphMenuItemKeys,
      txHash: id,
      flowType,
      txGraphData
    });

    const setLoading = ![
      TxGraphMenuItemKeys.COLLAPSE_TO_CENTER,
      TxGraphMenuItemKeys.COLLAPSE_BOTH_SIDES
    ].includes(e.key as TxGraphMenuItemKeys);
    void changeData(nextGraphData, setLoading);

    onClose();
  };

  const menuItems = useMemo(() => {
    if (type === 'DefaultTxNode') {
      const items = getMenuItem(id, flowType, txGraphData);

      return items;
    }
    return [
      { label: '展开左侧', key: TxGraphMenuItemKeys.EXPAND_LEFT_SIDES },
      { label: '展开右侧', key: TxGraphMenuItemKeys.EXPAND_RIGHT_SIDES }
    ];
  }, [id, type, flowType, txGraphData]);

  if (type === 'AmountFlowAddressNode') {
    return null;
  }

  return <Menu onClick={handleClick} items={menuItems} />;
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
