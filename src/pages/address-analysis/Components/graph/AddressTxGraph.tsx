import {
  DownloadOutlined,
  FullscreenOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { IEdge, INode } from '@antv/g6-core';
import Graphin, {
  Behaviors,
  EdgeConfig,
  GraphinContext,
  GraphinData,
  IG6GraphEvent,
  NodeConfig
} from '@antv/graphin';
import { message, Tooltip } from 'antd';
import { add, subtract } from 'lodash';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useMount, useUnmount } from 'react-use';

const { ZoomCanvas, Hoverable, FontPaint } = Behaviors;

export type TGraphinClickTarget = 'node' | 'edge' | 'canvas';
interface IAddressTxGraphProps {
  graphData: GraphinData;
  focusedAddress: string;
  handleReset: () => void;
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
}

const layout = {
  center: [100, 100], // 可选，
  linkDistance: 500 // 可选，边长
};

const MouseBehavior = ({
  setZoom,
  handleClick,
  focusedAddress
}: {
  setZoom: (zoom: number) => void;
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
  focusedAddress: string;
}) => {
  const { graph, apis } = useContext(GraphinContext);

  const handleClickNode = useCallback(
    (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;

      // 每次点击聚焦到点击节点上
      apis.focusNodeById(model.id);

      if (focusedAddress !== model.id) {
        handleClick(model.id, 'node');
      }
    },
    [apis, handleClick, focusedAddress]
  );

  const handleClickEdge = useCallback(
    (evt: IG6GraphEvent) => {
      const edge = evt.item as IEdge;
      const model = edge.getModel() as EdgeConfig;

      graph.setItemState(edge as unknown as string, 'selected', true);
      handleClick(model.id ?? '', 'edge');
    },
    [graph, handleClick]
  );

  const handleClickGraphin = (evt: IG6GraphEvent) => {
    if (!evt.item) {
      handleClick('', 'canvas');
    }
  };

  const handleWheelEvent = () => {
    const curZoom = graph.getZoom();
    setZoom(curZoom);
  };

  useMount(() => {
    graph.on('click', handleClickGraphin);
    graph.on('node:click', handleClickNode);
    graph.on('edge:click', handleClickEdge);
    graph.on('wheel', handleWheelEvent);
  });

  useUnmount(() => {
    graph.off('click', handleClickGraphin);
    graph.off('node:click', handleClickNode);
    graph.off('edge:click', handleClickEdge);
    graph.off('wheel', handleWheelEvent);
    graph.destroy();
  });

  return null;
};

export function AddressTxGraph(props: IAddressTxGraphProps) {
  const { graphData, focusedAddress, handleClick, handleReset } = props;

  const graphRef = useRef<Graphin | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleExport = () => {
    if (graphRef.current) {
      const { graph } = graphRef.current;
      graph.downloadFullImage('地址分析图谱', 'image/png', {
        backgroundColor: '#fff',
        padding: [30, 15, 15, 15]
      });
    }
  };

  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const { graph } = graphRef.current;

      const nextZoom = add(zoom, 0.1);

      graph.zoomTo(nextZoom);
      setZoom(nextZoom);
    }
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const { graph } = graphRef.current;

      if (zoom <= 0.2) {
        void message.warning('已经是最小了');
        return;
      }

      const nextZoom = subtract(zoom, 0.1);

      graph.zoom(nextZoom);
      setZoom(nextZoom);
    }
  }, [zoom]);

  useEffect(() => {
    if (graphRef.current) {
      const { apis } = graphRef.current;
      apis.focusNodeById(focusedAddress);
    }
  }, [graphData, focusedAddress]);

  return (
    <div id="AddressTxGraphContainer" className="relative h-full w-full">
      <Graphin
        data={graphData}
        ref={graphRef}
        layout={layout}
        fitView={true}
        theme={{ background: '#e5e8ee33' }}
      >
        <ZoomCanvas />
        <FontPaint />
        <Hoverable bindType="edge" />
        <MouseBehavior
          setZoom={setZoom}
          handleClick={handleClick}
          focusedAddress={focusedAddress}
        />
      </Graphin>
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
        <Tooltip title="重置">
          <SyncOutlined
            onClick={handleReset}
            className="cursor-pointer text-lg text-[#303133B2] hover:text-[#004cff]"
          />
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
