/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  DownloadOutlined,
  FullscreenOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { IG6GraphEvent, INode } from '@antv/g6-core';
import { createNodeFromReact } from '@antv/g6-react-node';
import { G6, Graph, GraphData } from '@antv/graphin';
import { message, Tooltip } from 'antd';
import { add, subtract } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useMount, useUnmount } from 'react-use';

import {
  AmountFlowAddressNode,
  CenterTxNode,
  DefaultTxNode,
  registerGraphContentMenu
} from '@/components/GraphinNodes';
import {
  generateTxGraphData,
  ITxGraphData
} from '@/services/mockData/transactionGraph';

G6.registerNode('DefaultTxNode', createNodeFromReact(DefaultTxNode));
G6.registerNode('CenterTxNode', createNodeFromReact(CenterTxNode));
G6.registerNode(
  'AmountFlowAddressNode',
  createNodeFromReact(AmountFlowAddressNode)
);

interface ITransactionGraphTreeProps {
  queryHash: string;
  tokenUnit: string;
  handleClick: (hexString: string) => void;
}

export function TransactionGraphTree(props: ITransactionGraphTreeProps) {
  const { queryHash, tokenUnit, handleClick } = props;

  const graphinContainerRef = useRef<HTMLDivElement>(null);
  const graphInstRef = useRef<Graph | null>(null);

  const [zoom, setZoom] = useState(1);
  const [txGraphData, setTxGraphData] = useState<ITxGraphData>({
    nodes: [],
    edges: []
  });

  const handleWheelEvent = () => {
    const curZoom = graphInstRef.current?.getZoom() ?? 1;
    setZoom(curZoom);
  };

  const handleNodeClick = (evt: IG6GraphEvent) => {
    const targetNode = evt.item as INode;
    const targetNodeId = targetNode._cfg?.id as string;

    if (graphInstRef.current) {
      const nodes = graphInstRef.current
        .getNodes()
        .filter((node) => node._cfg?.id !== targetNodeId);

      nodes.forEach((node) => {
        graphInstRef.current &&
          graphInstRef.current.updateItem(node._cfg?.id as string, {
            isSelected: false
          });
      });

      graphInstRef.current.updateItem(targetNodeId, {
        isSelected: true
      });
    }

    handleClick(targetNodeId);
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
  }, [queryHash]);

  useEffect(() => {
    if (txGraphData) {
      graphInstRef.current?.read(txGraphData as GraphData);
      graphInstRef.current?.refresh();
    }
  }, [txGraphData]);

  useMount(() => {
    registerGraphContentMenu();
    if (!graphInstRef.current) {
      const contextMenu = new G6.Menu({
        className: 'graphContextMenu',
        getContent(evt) {
          const itemModel = evt?.item?.getModel();
          if (itemModel?.type === 'AmountFlowAddressNode') {
            return '';
          }

          const outDiv = document.createElement('div');
          outDiv.innerHTML = `<ul>
            <li code='show-inflow'>展开</li>
            <li>收起</li>
          </ul>`;
          return outDiv;
        },
        handleMenuClick: (target, item) => {
          console.log(target.getAttribute('code'), item);
        },
        // offsetX and offsetY include the padding of the parent container
        // 需要加上父级容器的 padding-left 16 与自身偏移量 10
        offsetX: -615,
        // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
        offsetY: -212,
        // 在哪些类型的元素上响应
        itemTypes: ['node']
      });

      graphInstRef.current = new G6.Graph({
        container: 'TransactionGraphContainer',
        width: graphinContainerRef.current?.clientWidth || 600,
        height: graphinContainerRef.current?.clientHeight || 600,
        fitCenter: true,
        plugins: [contextMenu],
        modes: {
          default: ['drag-node', 'drag-canvas', 'zoom-canvas']
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR' // 可选，默认为图的中心
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            endArrow: true
          }
        }
      });

      graphInstRef.current.on('node:click', handleNodeClick);
      graphInstRef.current.on('wheel', handleWheelEvent);
    }

    graphInstRef.current.data(txGraphData as GraphData);
    graphInstRef.current.render();

    window.addEventListener('resize', () => {
      graphInstRef.current?.changeSize(
        graphinContainerRef.current?.clientWidth ?? 800,
        graphinContainerRef.current?.clientHeight ?? 800
      );
      graphInstRef.current?.fitCenter();
    });
  });

  useUnmount(() => {
    graphInstRef.current?.destroy();

    window.removeEventListener('resize', () => {
      console.log('remove');
    });
  });

  const handleZoomIn = () => {
    const nextZoom = add(zoom, 0.1);

    graphInstRef.current?.zoomTo(nextZoom);
    setZoom(nextZoom);
  };

  const handleZoomOut = () => {
    if (zoom <= 0.2) {
      void message.warning('已经是最小了');
      return;
    }

    const nextZoom = subtract(zoom, 0.1);

    graphInstRef.current?.zoomTo(nextZoom);
    setZoom(nextZoom);
  };

  const handleFocusCenter = () => {
    graphInstRef.current?.focusItem(queryHash, true, {
      easing: 'easeCubic',
      duration: 400
    });
  };

  const handleExport = () => {
    if (graphInstRef.current) {
      graphInstRef.current.downloadFullImage('交易图谱', 'image/png', {
        backgroundColor: '#fff',
        padding: [30, 15, 15, 15]
      });
    }
  };

  return (
    <div
      id="TransactionGraphContainer"
      className="relative w-full"
      ref={graphinContainerRef}
    >
      <div className="absolute top-5 right-5 flex flex-col items-center justify-between gap-y-3 rounded-3xl bg-[#B2BACB33] py-5">
        <Tooltip title="放大">
          <PlusCircleOutlined
            onClick={handleZoomIn}
            className="cursor-pointer px-3 text-lg text-[#303133B2] hover:text-[#004cff]"
          />
        </Tooltip>
        <div className="select-none text-sm">{(zoom * 100).toFixed(0)}</div>
        <Tooltip title="缩小">
          <MinusCircleOutlined
            onClick={handleZoomOut}
            className="cursor-pointer px-3 text-lg text-[#303133B2] hover:text-[#004cff]"
          />
        </Tooltip>
      </div>
      <div className="absolute top-40 right-5 flex flex-col justify-between gap-y-4 rounded-3xl bg-[#B2BACB33] py-5 px-3">
        <Tooltip title="定位到中心">
          <svg
            className="iconfont !h-[17px] !w-[17px] cursor-pointer hover:text-[#004cff]"
            aria-hidden="true"
            onClick={handleFocusCenter}
          >
            <use xlinkHref="#icon-filter-center-focus"></use>
          </svg>
        </Tooltip>
        <Tooltip title="全屏(功能开发中)">
          <FullscreenOutlined className="cursor-not-allowed text-lg" />
        </Tooltip>
        <Tooltip title="下载">
          <DownloadOutlined
            onClick={handleExport}
            className="cursor-pointer text-lg text-[#303133B2] hover:text-[#004cff]"
          />
        </Tooltip>
      </div>
    </div>
  );
}
