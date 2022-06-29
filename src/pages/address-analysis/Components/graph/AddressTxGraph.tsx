import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { AnalysisLoading } from '@/components/AnalysisLoading';
import {
  initGraphData,
  initQueryAddress
} from '@/services/mockData/addressAnalysis';
import { waitTime } from '@/utils/common';

import { GraphDataBar } from './GraphDataBar';
import { MouseBehavior } from './MouseBehavior';
import { ToolBar } from './ToolBar';

const { ZoomCanvas, Hoverable, FontPaint } = Behaviors;

export type TGraphinClickTarget = 'node' | 'edge' | 'canvas';
interface IAddressTxGraphProps {
  focusedId: string;
  changeData: (data: GraphinData) => void;
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
}

const layout = {
  center: [100, 100], // 可选，
  linkDistance: 500 // 可选，边长
};

export function AddressTxGraph(props: IAddressTxGraphProps) {
  const { focusedId, handleClick, changeData } = props;

  const graphRef = useRef<Graphin | null>(null);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const handleReset = () => {
    setGraphData(initGraphData);
    handleClick(initQueryAddress);
  };

  const [{ loading }, handleChangeData] = useAsyncFn(
    async (data: GraphinData, setLoading?: boolean) => {
      if (setLoading) {
        await waitTime(800);
      }

      setGraphData(data);
      return data;
    },
    []
  );

  useEffect(() => {
    if (graphRef.current && focusedId) {
      const { apis } = graphRef.current;
      apis.focusNodeById(focusedId);
    }
    changeData(graphData);
  }, [graphData, focusedId, changeData]);

  return (
    <div id="AddressTxGraphContainer" className="relative h-full w-full">
      {loading && <AnalysisLoading />}
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
        <MouseBehavior handleClick={handleClick} focusedId={focusedId} />
        <ToolBar handleReset={handleReset} />
        <GraphDataBar
          graphData={graphData}
          focusedId={focusedId}
          changeData={handleChangeData}
          changeFocusedId={handleClick}
        />
      </Graphin>
    </div>
  );
}
