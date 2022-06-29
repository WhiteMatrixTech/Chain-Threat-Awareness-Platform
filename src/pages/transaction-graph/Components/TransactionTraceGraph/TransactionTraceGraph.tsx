import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin, { Behaviors, EdgeStyle, G6, GraphinData } from '@antv/graphin';
import { Alert } from 'antd';
import { useEffect, useRef, useState } from 'react';

import {
  AmountFlowAddressNode,
  CenterTxNode,
  DefaultTxNode
} from '@/components/GraphinNodes';
import {
  generateTxGraphData,
  ITxGraphData
} from '@/services/mockData/transactionGraph';

import { GraphContextMenu } from './GraphContextMenu';
import { MouseBehavior } from './MouseBehavior';

const { ZoomCanvas, DragNode, Hoverable, FontPaint } = Behaviors;

export interface ITransactionTraceGraphProps {
  queryHash: string;
  tokenUnit?: string;
  handleClick: (hexString: string) => void;
}

// 自定义三种节点
Graphin.registerNode('DefaultTxNode', createNodeFromReact(DefaultTxNode));
Graphin.registerNode('CenterTxNode', createNodeFromReact(CenterTxNode));
Graphin.registerNode(
  'AmountFlowAddressNode',
  createNodeFromReact(AmountFlowAddressNode)
);

const graphinDefaultConfig = {
  layout: {
    type: 'dagre',
    rankdir: 'LR', // 可选，默认为图的中心,
    controlPoints: true
  },
  defaultEdge: {
    type: 'cubic-horizontal' as 'graphin-line',
    style: {
      endArrow: true
    } as unknown as EdgeStyle
  },
  theme: { background: '#e5e8ee33' },
  fitCenter: true,
  fitView: true
};

export function TransactionTraceGraph(props: ITransactionTraceGraphProps) {
  const { queryHash, tokenUnit, handleClick } = props;

  const graphRef = useRef<Graphin | null>(null);
  const [txGraphData, setTxGraphData] = useState<ITxGraphData>({
    nodes: [],
    edges: []
  });

  const [tipVisible, setTipVisible] = useState(true);
  const handleClose = () => {
    setTipVisible(false);
  };

  useEffect(() => {
    const initNode = {
      id: queryHash,
      type: 'CenterTxNode',
      isSelected: true
    };
    const [inflowNodes, inflowEdges] = generateTxGraphData(
      queryHash,
      'inflow',
      tokenUnit
    );
    const [outflowNodes, outflowEdges] = generateTxGraphData(
      queryHash,
      'outflow',
      tokenUnit
    );
    const randomData = {
      nodes: [initNode, ...inflowNodes, ...outflowNodes],
      edges: [...inflowEdges, ...outflowEdges]
    };

    setTxGraphData(randomData);
  }, [queryHash, tokenUnit]);

  return (
    <div id="AddressTxGraphContainer" className="relative h-full w-full">
      {tipVisible && (
        <Alert
          message="右键点击节点进行展开"
          afterClose={handleClose}
          closable={true}
          type="info"
        />
      )}
      <Graphin
        data={txGraphData as GraphinData}
        ref={graphRef}
        {...graphinDefaultConfig}
      >
        <ZoomCanvas />
        <FontPaint />
        <DragNode />
        <Hoverable bindType="node" />
        <GraphContextMenu
          txGraphData={txGraphData}
          changeData={setTxGraphData}
        />
        <MouseBehavior queryHash={queryHash} handleClick={handleClick} />
      </Graphin>
    </div>
  );
}
