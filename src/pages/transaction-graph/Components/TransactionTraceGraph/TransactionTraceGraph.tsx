import { InfoCircleOutlined } from '@ant-design/icons';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin, { Behaviors, GraphinContext, GraphinData } from '@antv/graphin';
import { Tooltip } from 'antd';
import cn from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import { AnalysisLoading } from '@/components/AnalysisLoading';
import {
  AmountFlowAddressNode,
  CenterTxNode,
  DefaultTxNode
} from '@/components/GraphinNodes';
import {
  generateTxGraphData,
  ITxGraphData,
  ITxGraphEdge,
  ITxGraphNode
} from '@/services/mockData/transactionGraph';
import { getTransactionBaseInfo } from '@/services/transaction';
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
Graphin.registerNode(
  'CenterTxNode',
  createNodeFromReact(AmountFlowAddressNode)
);
Graphin.registerNode(
  'AmountFlowAddressNode',
  createNodeFromReact(DefaultTxNode)
);

const graphinDefaultConfig = {
  layout: {
    type: 'dagre',
    rankdir: 'LR' // 可选，默认为图的中心,
  },
  theme: { background: '#e5e8ee33' }
};

export function TransactionTraceGraph(props: ITransactionTraceGraphProps) {
  const { queryHash, tokenUnit, handleClick } = props;

  const graphRef = useRef<Graphin | null>(null);
  const { graph } = useContext(GraphinContext);
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
      // eslint-disable-next-line @typescript-eslint/unbound-method
      return data;
    },
    []
  );

  useEffect(() => {
    getTransactionBaseInfo(queryHash)
      .then((data) => {
        const initNode = {
          id: queryHash,
          type: 'CenterTxNode',
          isSelected: true,
          tokenAmount: (Number(data.value) / 1e18).toFixed(4).toString(),
          tokenUnit
        };

        const inflowNodes: ITxGraphNode = {
          id: data.from,
          type: 'AmountFlowAddressNode',
          tokenAmount: (Math.random() * 1000).toFixed(4),
          tokenUnit,
          flowType: 'inflow'
        };
        const outflowNodes: ITxGraphNode = {
          id: data.to,
          type: 'AmountFlowAddressNode',
          tokenAmount: (Math.random() * 1000).toFixed(4),
          tokenUnit,
          flowType: 'outflow'
        };
        const inflowEdges: ITxGraphEdge = {
          id: `${uuidv4().replaceAll('-', '')}`,
          source: data.from,
          target: queryHash
        };
        const outflowEdges: ITxGraphEdge = {
          id: `${uuidv4().replaceAll('-', '')}`,
          source: queryHash,
          target: data.to
        };
        const randomData = {
          nodes: [initNode, inflowNodes, outflowNodes],
          edges: [inflowEdges, outflowEdges]
        };
        void handleChangeData(randomData, true);
      })
      .catch((e) => console.log('e', e));

    // const [inflowNodes, inflowEdges] = generateTxGraphData(
    //   queryHash,
    //   'inflow',
    //   tokenUnit
    // );
    // const [outflowNodes, outflowEdges] = generateTxGraphData(
    //   queryHash,
    //   'outflow',
    //   tokenUnit
    // );
    // const randomData = {
    //   nodes: [initNode, ...inflowNodes, ...outflowNodes],
    //   edges: [...inflowEdges, ...outflowEdges]
    // };
    // // console.log({ randomData });

    // void handleChangeData(randomData, true);
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
          {/* <ZoomCanvas />
          <FontPaint /> */}
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
