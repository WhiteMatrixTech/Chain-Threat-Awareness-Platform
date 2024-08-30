/* eslint-disable prettier/prettier */
/*
 * @Description: 
 * @Author: didadida262
 * @Date: 2024-08-30 10:47:11
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-30 11:00:23
 */
import {
  DownloadOutlined,
  FullscreenOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { GraphinContext } from "@antv/graphin";
import { message, Tooltip } from "antd";
import { add, subtract } from "lodash";
import { useCallback, useContext, useState } from "react";
import { useMount, useUnmount } from "react-use";

export const ToolBar = (props: { handleReset: () => void }) => {
  const { handleReset } = props;

  const { graph } = useContext(GraphinContext);
  const [zoom, setZoom] = useState(1);

  const handleExport = () => {
    graph.downloadFullImage("地址分析图谱", "image/png", {
      backgroundColor: "#fff",
      padding: [30, 15, 15, 15]
    });
  };

  const handleZoomIn = useCallback(
    () => {
      const nextZoom = add(zoom, 0.1);

      graph.zoomTo(nextZoom);
      setZoom(nextZoom);
    },
    [graph, zoom]
  );

  const handleZoomOut = useCallback(
    () => {
      if (zoom <= 0.2) {
        void message.warning("已经是最小了");
        return;
      }

      const nextZoom = subtract(zoom, 0.1);

      graph.zoom(nextZoom);
      setZoom(nextZoom);
    },
    [graph, zoom]
  );

  const handleWheelEvent = () => {
    const curZoom = graph.getZoom();
    setZoom(curZoom);
  };

  useMount(() => {
    graph.on("wheel", handleWheelEvent);
  });

  useUnmount(() => {
    graph.off("wheel", handleWheelEvent);
  });

  return (
    <div className="absolute top-5 right-5">
      <div className="flex flex-col items-center justify-between gap-y-3 rounded-3xl bg-[#efefef] py-5">
        <Tooltip title="放大">
          <PlusCircleOutlined
            onClick={handleZoomIn}
            className="cursor-pointer px-3 text-lg text-[#303133B2] hover:text-[#004cff]"
          />
        </Tooltip>
        <div className="select-none text-sm">
          {(zoom * 100).toFixed(0)}
        </div>
        <Tooltip title="缩小">
          <MinusCircleOutlined
            onClick={handleZoomOut}
            className="cursor-pointer px-3 text-lg text-[#303133B2] hover:text-[#004cff]"
          />
        </Tooltip>
      </div>
      <div className="mt-6 flex flex-col justify-between gap-y-4 rounded-3xl bg-[#efefef] py-5 px-3">
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
};
