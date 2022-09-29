import '@antv/graphin-icons/dist/index.css';

import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { AnalysisLoading } from '@/components/AnalysisLoading';
import { initGraphData, setNode } from '@/services/mockData/addressAnalysis';
import { waitTime } from '@/utils/common';

import { IGraphFormData } from '../../AddressAnalysis';
import styles from '../../AddressAnalysis.module.less';
import { GraphDataBar } from './GraphDataBar';
import { MouseBehavior } from './MouseBehavior';
import { ToolBar } from './ToolBar';

const { ZoomCanvas, Hoverable, ActivateRelations, FontPaint } = Behaviors;

export type TGraphinClickTarget = 'node' | 'edge' | 'canvas';
interface IAddressTxGraphProps {
  focusedId: string;
  formData: IGraphFormData;
  changeData: (data: GraphinData) => void;
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
}

const layout = {
  type: 'concentric',
  center: [100, 100], // 可选，
  linkDistance: 100, // 可选，边长,
  nodeSize: 150
};

export function AddressTxGraph(props: IAddressTxGraphProps) {
  const { focusedId, formData, handleClick, changeData } = props;

  const graphRef = useRef<Graphin | null>(null);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const handleReset = () => {
    setGraphData({ edges: [], nodes: [setNode(formData.address)] });
    handleClick(formData.address);
  };

  const [{ loading }, handleChangeData] = useAsyncFn(
    async (data: GraphinData, setLoading?: boolean) => {
      if (setLoading) {
        await waitTime(800);
      }

      setGraphData(data);

      if (graphRef.current && focusedId) {
        const { apis } = graphRef.current;
        apis.focusNodeById(focusedId);
      }

      return data;
    },
    []
  );

  useEffect(() => {
    const initGraphData = {
      edges: [],
      nodes: [setNode(formData.address)]
    };

    void handleChangeData(initGraphData);
  }, [formData.address, handleChangeData]);

  useEffect(() => {
    changeData(graphData);
  }, [changeData, graphData]);

  return (
    <div id="AddressTxGraphContainer" className="relative h-full w-full">
      {loading && <AnalysisLoading />}
      <div
        id="AddressTxGraphContainer"
        className={cn(styles.canvasBg, 'absolute inset-0')}
      >
        <Graphin
          data={graphData}
          ref={graphRef}
          layout={layout}
          fitView={true}
          theme={{ background: '#e5e8ee33' }}
        >
          <ZoomCanvas />
          <FontPaint />
          <ActivateRelations trigger="click" />
          <Hoverable bindType="edge" />
          <MouseBehavior handleClick={handleClick} />
          <ToolBar handleReset={handleReset} />
          <GraphDataBar
            formData={formData}
            graphData={graphData}
            focusedId={focusedId}
            changeData={handleChangeData}
            changeFocusedId={handleClick}
          />
        </Graphin>
      </div>
    </div>
  );
}
