import { GraphinData } from '@antv/graphin';
import cn from 'classnames';
import { useCallback, useMemo } from 'react';

import {
  EdgeType,
  generateGraphData
} from '@/services/mockData/addressAnalysis';

import styles from '../../AddressAnalysis.module.less';
import { AnalysisTool, AnalysisType } from '../AnalysisTool';

interface IGraphDataBarProps {
  graphData: GraphinData;
  focusedId: string;
  changeData: (
    data: GraphinData,
    setLoading?: boolean
  ) => Promise<GraphinData | undefined>;
  changeFocusedId: (hexString: string) => void;
}

export const GraphDataBar = (props: IGraphDataBarProps) => {
  const { graphData, focusedId, changeData, changeFocusedId } = props;

  const handleGenerateData = useCallback(
    (type: EdgeType) => {
      const randomData = generateGraphData(focusedId, type);
      randomData.edges = [...randomData.edges, ...graphData.edges];
      randomData.nodes = [...randomData.nodes, ...graphData.nodes];

      void changeData(randomData, true);
    },
    [focusedId, graphData.edges, graphData.nodes, changeData]
  );

  const handleDeleteNode = useCallback(() => {
    const edges = graphData.edges.filter(
      (edge) => edge.source !== focusedId && edge.target !== focusedId
    );
    const nodes = graphData.nodes.filter((node) => {
      const isTargetNode = node.id === focusedId;

      // 孤立的节点
      const isLonelyNode =
        edges.findIndex((edge) =>
          [edge.source, edge.target].includes(node.id)
        ) < 0;

      return !(isTargetNode || isLonelyNode);
    });

    const randomData = {
      nodes,
      edges
    };

    void changeData(randomData);
    changeFocusedId('');
  }, [
    graphData.edges,
    graphData.nodes,
    changeData,
    changeFocusedId,
    focusedId
  ]);

  const address = useMemo(() => {
    if (focusedId.length > 42) {
      return '';
    }

    return focusedId;
  }, [focusedId]);

  const tools = [
    {
      onClick: () => handleGenerateData(EdgeType.SOURCE),
      type: AnalysisType.VIEW_SOURCE,
      title: '资金来源'
    },
    {
      onClick: () => handleGenerateData(EdgeType.PLACE),
      type: AnalysisType.VIEW_PLACE,
      title: '资金去向'
    },
    {
      onClick: () => handleGenerateData(EdgeType.TARGET),
      type: AnalysisType.VIEW_TARGET,
      title: '全部交易对象'
    },
    {
      onClick: handleDeleteNode,
      type: AnalysisType.DELETE,
      title: '删除地址'
    }
  ];

  return (
    <div
      className={cn(
        styles.toolBarContainer,
        'absolute bottom-[15%] left-0 right-0 flex justify-between gap-x-4 rounded-3xl bg-[#B2BACB33] px-10 py-3'
      )}
    >
      {tools.map((tool) => (
        <AnalysisTool {...tool} key={tool.type} address={address} />
      ))}
    </div>
  );
};
