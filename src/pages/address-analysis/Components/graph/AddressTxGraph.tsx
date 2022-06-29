import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { useEffect, useRef, useState } from 'react';

import {
  initGraphData,
  initQueryAddress
} from '@/services/mockData/addressAnalysis';

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

  useEffect(() => {
    if (graphRef.current && focusedId) {
      const { apis } = graphRef.current;
      apis.focusNodeById(focusedId);
    }
    changeData(graphData);
  }, [graphData, focusedId, changeData]);

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
        <MouseBehavior handleClick={handleClick} focusedId={focusedId} />
        <ToolBar handleReset={handleReset} />
        <GraphDataBar
          graphData={graphData}
          focusedId={focusedId}
          changeData={setGraphData}
          changeFocusedId={handleClick}
        />
      </Graphin>
    </div>
  );
}
