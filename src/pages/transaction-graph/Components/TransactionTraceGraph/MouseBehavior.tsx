import {
  DownloadOutlined,
  FullscreenOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { INode } from '@antv/g6-core';
import { GraphinContext, IG6GraphEvent } from '@antv/graphin';
import { message, Tooltip } from 'antd';
import { add, subtract } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useMount, useUnmount } from 'react-use';

import { ITransactionTraceGraphProps } from './TransactionTraceGraph';

export const MouseBehavior = ({
  queryHash,
  handleClick
}: ITransactionTraceGraphProps) => {
  const { graph } = useContext(GraphinContext);

  const [zoom, setZoom] = useState(1);

  const handleClickNode = useCallback(
    (evt: IG6GraphEvent) => {
      const targetNode = evt.item as INode;
      const targetNodeId = targetNode.getModel().id ?? '';

      const nodes = graph
        .getNodes()
        .filter((node) => node._cfg?.id !== targetNodeId);

      nodes.forEach((node) => {
        graph.updateItem(node._cfg?.id as string, {
          isSelected: false
        });
      });

      // 每次点击聚焦到点击节点上
      graph.updateItem(targetNodeId, {
        isSelected: true
      });

      handleClick(targetNodeId);
    },
    [graph, handleClick]
  );

  const handleNodeMouseEnter = useCallback(
    (evt: IG6GraphEvent) => {
      const targetNode = evt.item as INode;
      const targetNodeId = targetNode.getModel().id ?? '';

      graph.updateItem(targetNodeId, {
        isHovered: true
      });
    },
    [graph]
  );

  const handleNodeMouseLeave = useCallback(
    (evt: IG6GraphEvent) => {
      const targetNode = evt.item as INode;
      const targetNodeId = targetNode.getModel().id ?? '';

      graph.updateItem(targetNodeId, {
        isHovered: false
      });
    },
    [graph]
  );

  const handleWheelEvent = () => {
    const curZoom = graph.getZoom();
    setZoom(curZoom);
  };

  const handleZoomIn = () => {
    const nextZoom = add(zoom, 0.1);

    graph.zoomTo(nextZoom);
    setZoom(nextZoom);
  };

  const handleZoomOut = () => {
    if (zoom <= 0.2) {
      void message.warning('已经是最小了');
      return;
    }

    const nextZoom = subtract(zoom, 0.1);

    graph.zoomTo(nextZoom);
    setZoom(nextZoom);
  };

  const handleFocusCenter = useCallback(() => {
    graph.focusItem(queryHash, true, {
      easing: 'easeCubic',
      duration: 400
    });
  }, [graph, queryHash]);

  const handleExport = () => {
    graph.downloadFullImage('交易图谱', 'image/png', {
      backgroundColor: '#fff',
      padding: [30, 15, 15, 15]
    });
  };

  useEffect(() => {
    setTimeout(() => handleFocusCenter(), 3000);
    // graph.on('graphin:datachange', () => {
    //   graph.focusItem(queryHash, true, {
    //     easing: 'easeCubic',
    //     duration: 400
    //   });
    // });
  }, [handleFocusCenter, queryHash, graph]);

  useMount(() => {
    graph.on('node:click', handleClickNode);
    graph.on('node:mouseenter', handleNodeMouseEnter);
    graph.on('node:mouseleave', handleNodeMouseLeave);
    graph.on('wheel', handleWheelEvent);
  });

  useUnmount(() => {
    graph.off('node:click', handleClickNode);
    graph.off('node:mouseenter', handleNodeMouseEnter);
    graph.off('node:mouseleave', handleNodeMouseLeave);
    graph.off('wheel', handleWheelEvent);
    graph.destroy();
  });

  return (
    <div className="absolute top-5 right-6">
      <div className="flex flex-col items-center justify-between gap-y-3 rounded-3xl bg-[#efefef] py-5">
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
      <div className="mt-6 flex flex-col justify-between gap-y-4 rounded-3xl bg-[#efefef] py-5 px-3">
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
};
