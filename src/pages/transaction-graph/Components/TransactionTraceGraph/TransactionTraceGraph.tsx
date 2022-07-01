import { InfoCircleOutlined } from '@ant-design/icons';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin, { Behaviors, EdgeStyle, GraphinData } from '@antv/graphin';
import { Tooltip } from 'antd';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { AnalysisLoading } from '@/components/AnalysisLoading';
import {
  AmountFlowAddressNode,
  CenterTxNode,
  DefaultTxNode
} from '@/components/GraphinNodes';
import {
  generateTxGraphData,
  ITxGraphData
} from '@/services/mockData/transactionGraph';
import { waitTime } from '@/utils/common';

import styles from '../../TransactionGraph.module.less';
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

  const [{ loading }, handleChangeData] = useAsyncFn(
    async (data: ITxGraphData, setLoading?: boolean) => {
      if (setLoading) {
        await waitTime(800);
      }

      setTxGraphData(data);
      return data;
    },
    []
  );

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

    void handleChangeData(randomData, true);
  }, [handleChangeData, queryHash, tokenUnit]);

  return (
    <div className="relative h-full w-full">
      {loading && <AnalysisLoading />}
      <div className="absolute top-4 left-5 z-50 text-lg">
        <Tooltip title="右键点击节点进行展开">
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      <div
        id="TxTraceGraphContainer"
        className={cn(styles.canvasBg, 'absolute inset-0')}
      >
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
            changeData={handleChangeData}
          />
          <MouseBehavior queryHash={queryHash} handleClick={handleClick} />
        </Graphin>
      </div>
    </div>
  );
}
