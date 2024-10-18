/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  DefaultTxNode,
  DiyNode
} from '@/components/GraphinNodes';
import {
  generateTxGraphData,
  ITxGraphData,
  ITxGraphEdge,
  ITxGraphNode
} from '@/services/mockData/transactionGraph';
import { waitTime } from '@/utils/common';

import styles from '../../TransactionGraph.module.less';
import { GraphContextMenu } from './GraphContextMenu';
import { MouseBehavior } from './MouseBehavior';

const { ZoomCanvas, DragNode, Hoverable, FontPaint } = Behaviors;

export interface ITransactionTraceGraphProps {
  queryHash: string;
  tokenUnit?: string;
  // transactionData: any;
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
Graphin.registerNode('DiyNode', createNodeFromReact(DiyNode));

const graphinDefaultConfig = {
  layout: {
    // type: 'forceLayout',
    // linkDistance: 100, // 设置节点间的距离
    // type: 'random',
    // preventOverlap: true // 防止节点重叠
    // nodeSize: 200 // 节点的尺寸
    // size: [300, 300], // 布局区域大小
    // minDistance: 100
    type: 'graphin-force'
    // type: 'random',
    // type: 'circular',
    // rankdir: 'LR' // 可选，默认为图的中心,
    // controlPoints: true,
  },
  theme: { background: '#e5e8ee33' }
  // fitCenter: true
};

export function TransactionTraceGraph(props: any) {
  const { queryHash, tokenUnit, handleClick, transactionData, loadingPage } =
    props;

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
      graphRef.current?.graph.render();
      return data;
    },
    []
  );

  useEffect(() => {
    console.log('loading>>>', loading);
  }, [loading]);
  useEffect(() => {
    console.log('transactionData>>>变化', transactionData);
    if (!transactionData) return;
    const data = { ...transactionData };

    const initNode = {
      id: queryHash,
      type: 'CenterTxNode',
      isSelected: true,
      tokenAmount: (Number(data.value) / 1e18).toFixed(4).toString(),
      tokenUnit,
      style: {
        zIndex: 100
      }
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
      target: queryHash,
      style: {
        keyshape: {
          stroke: '#333333',
          lineWidth: 1.5
        }
      }
    };
    const outflowEdges: ITxGraphEdge = {
      id: `${uuidv4().replaceAll('-', '')}`,
      source: queryHash,
      target: data.to,
      style: {
        keyshape: {
          stroke: '#333333',
          lineWidth: 1.5
        }
      }
    };

    const randomData = {
      nodes: [initNode, inflowNodes, outflowNodes],
      edges: [inflowEdges, outflowEdges]
    };
    if (data.toTransactions && data.toTransactions.length) {
      data.toTransactions.slice(0, 50).forEach((item: any) => {
        const newNode: ITxGraphNode = {
          id: item.hash,
          type: 'DiyNode',
          tokenAmount: (Number(item.value) / 1e18).toFixed(4).toString(),
          tokenUnit
          // isSelected: queryHash === item.hash
        };
        randomData.nodes.push(newNode);
        const newEdges: ITxGraphEdge = {
          id: `${uuidv4().replaceAll('-', '')}`,
          source: item.hash,
          target: data.to,
          style: {
            keyshape: {
              stroke: '#333333',
              lineWidth: 1.5
            }
          }
        };
        randomData.edges.push(newEdges);
      });
    }

    void handleChangeData(randomData, true);
  }, [transactionData]);

  return (
    <div className="relative h-full w-full">
      {(loading || loadingPage) && <AnalysisLoading />}
      <div
        id="TxTraceGraphContainer"
        className={cn(styles.canvasBg, 'absolute inset-0')}
      >
        <Graphin
          data={txGraphData as GraphinData}
          ref={graphRef}
          {...graphinDefaultConfig}
        >
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
