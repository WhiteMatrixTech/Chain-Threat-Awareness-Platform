/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IAbstractGraph } from '@antv/g6-core';
import {
  appenAutoShapeListener,
  createNodeFromReact
} from '@antv/g6-react-node';
import Graphin, {
  Behaviors,
  G6,
  Graph,
  GraphinTreeData,
  Utils
} from '@antv/graphin';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { DefaultTxNode } from '@/components/GraphinNodes';

G6.registerNode('DefaultTxNode', createNodeFromReact(DefaultTxNode));

const data = {
  // 点集
  nodes: [
    {
      id: 'node1' // String，该节点存在则必须，节点的唯一标识
    },
    {
      id: 'node2' // String，该节点存在则必须，节点的唯一标识
    }
  ],
  // 边集
  edges: [
    {
      source: 'node1', // String，必须，起始点 id
      target: 'node2' // String，必须，目标点 id
    }
  ]
};

export function TransactionGraphTree() {
  const graphinRef = useRef<HTMLDivElement>(null);
  let graph: Graph | null = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: 'TransactionGraphContainer',
        width: 1200,
        height: 800,
        fitCenter: true,
        modes: {
          default: ['drag-node', 'drag-canvas', 'zoom-canvas']
        },
        layout: {
          type: 'dagre',
          direction: 'LR'
        },
        defaultNode: {
          type: 'DefaultTxNode'
        },
        defaultEdge: {
          type: 'polyline'
        }
      });
    }
    graph.data(data);
    graph.render();
  }, []);

  return (
    <div
      id="TransactionGraphContainer"
      className="w-full"
      ref={graphinRef}
    ></div>
  );
}
