import {
  DownloadOutlined,
  FullscreenOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { INode } from '@antv/g6-core';
import Graphin, {
  Behaviors,
  GraphinData,
  IG6GraphEvent,
  NodeConfig
} from '@antv/graphin';
import { useRef } from 'react';
import { useMount, useUnmount } from 'react-use';

const { ZoomCanvas, Hoverable, FontPaint } = Behaviors;

interface IAddressTxGraphProps {
  graphData: GraphinData;
  selectedAddress: string;
  handleClick: (address: string) => void;
}

const layout = {
  type: 'concentric'
};

export function AddressTxGraph(props: IAddressTxGraphProps) {
  const { graphData, handleClick } = props;

  const graphRef = useRef<Graphin | null>(null);

  const handleClickNode = (evt: IG6GraphEvent) => {
    if (graphRef.current) {
      // const { apis } = graphRef.current;

      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;

      // 每次点击聚焦到点击节点上
      // apis.focusNodeById(model.id);

      handleClick(model.id);
    }
  };

  useMount(() => {
    if (graphRef.current) {
      const { graph } = graphRef.current;
      graph.on('node:click', handleClickNode);
    }
  });

  useUnmount(() => {
    if (graphRef.current) {
      graphRef.current?.graph.off('node:click', handleClickNode);
      graphRef.current?.graph.destroy();
    }
  });

  return (
    <div id="AddressTxGraphContainer" className="relative h-full w-full">
      <Graphin
        data={graphData}
        ref={graphRef}
        layout={layout}
        theme={{ background: '#e5e8ee33' }}
      >
        <ZoomCanvas />
        <FontPaint />
        <Hoverable bindType="edge" />
      </Graphin>
      <div className="absolute top-5 right-5 flex flex-col justify-between gap-y-4 rounded-3xl bg-[#B2BACB33] py-6 px-3">
        <SyncOutlined />
        <FullscreenOutlined />
        <DownloadOutlined />
      </div>
    </div>
  );
}
