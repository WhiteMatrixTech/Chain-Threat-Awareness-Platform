import { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';
import { message } from 'antd';
import cn from 'classnames';
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  EdgeType,
  setEdge,
  setNode
} from '@/services/mockData/addressAnalysis';
import {
  getInAddressTransaction,
  getOutAddressTransaction
} from '@/services/transaction';

import { IGraphFormData } from '../../AddressAnalysis';
import styles from '../../AddressAnalysis.module.less';
import { AnalysisTool, AnalysisType } from '../AnalysisTool';

interface IGraphDataBarProps {
  formData: IGraphFormData;
  graphData: GraphinData;
  focusedId: string;
  changeData: (
    data: GraphinData,
    setLoading?: boolean
  ) => Promise<GraphinData | undefined>;
  changeFocusedId: (hexString: string) => void;
}

export const GraphDataBar = (props: IGraphDataBarProps) => {
  const { graphData, focusedId, changeData, changeFocusedId, formData } = props;

  const handleGenerateData = useCallback(
    (type: EdgeType) => {
      const haveTargetData = graphData.edges.filter((edge) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const edgeType = edge.data.type as EdgeType;
        switch (type) {
          case EdgeType.SOURCE:
            return edgeType === EdgeType.SOURCE && edge.target === focusedId;
          case EdgeType.PLACE:
            return edgeType === EdgeType.PLACE && edge.source === focusedId;
          case EdgeType.TARGET:
            return edgeType === EdgeType.TARGET && edge.source === focusedId;
          default:
            return false;
        }
      });
      return haveTargetData;
    },
    [focusedId, graphData.edges]
  );

  const handleSourceNode = useCallback(async () => {
    if (handleGenerateData(EdgeType.SOURCE).length) {
      void message.warning('请勿重复查询资金来源');
      return;
    }

    try {
      const nodes: IUserNode[] = [];
      const edges: IUserEdge[] = [];
      const data = await getInAddressTransaction({
        address: focusedId,
        fromBlock: formData.date[0],
        toBlock: formData.date[1]
      });
      data.forEach((item) => {
        const id = item.address;
        const hash = `0x${uuidv4()}${uuidv4()}`.replaceAll('-', '');
        const txNumber = item.count;
        const txAmount = Number(item.value) / 1e18;
        const source = item.address;
        const target = focusedId;
        nodes.push(setNode(id));
        edges.push(
          setEdge({
            hash,
            source,
            target,
            type: EdgeType.SOURCE,
            txAmount,
            txNumber
          })
        );
      });
      const sourceData = {
        nodes: [...nodes, ...graphData.nodes],
        edges: [...edges, ...graphData.edges]
      };
      await changeData(sourceData, true);
    } catch (e) {
      console.log('e', e);
    }
  }, [
    changeData,
    focusedId,
    formData.date,
    graphData.edges,
    graphData.nodes,
    handleGenerateData
  ]);

  const handlePlaceNode = useCallback(async () => {
    if (handleGenerateData(EdgeType.PLACE).length) {
      void message.warning('请勿重复查询资金去向');
      return;
    }

    try {
      const nodes: IUserNode[] = [];
      const edges: IUserEdge[] = [];
      const data = await getOutAddressTransaction({
        address: focusedId,
        fromBlock: formData.date[0],
        toBlock: formData.date[1]
      });
      data.forEach((item) => {
        const id = item.address;
        const hash = `0x${uuidv4()}${uuidv4()}`.replaceAll('-', '');
        const txNumber = item.count;
        const txAmount = Number(item.value) / 1e18;
        const source = focusedId;
        const target = item.address;
        nodes.push(setNode(id));
        edges.push(
          setEdge({
            hash,
            source,
            target,
            type: EdgeType.PLACE,
            txAmount,
            txNumber
          })
        );
      });
      const sourceData = {
        nodes: [...nodes, ...graphData.nodes],
        edges: [...edges, ...graphData.edges]
      };
      await changeData(sourceData, true);
    } catch (e) {
      console.log('e', e);
    }
  }, [
    changeData,
    focusedId,
    formData.date,
    graphData.edges,
    graphData.nodes,
    handleGenerateData
  ]);

  const handleTargetNode = useCallback(async () => {
    if (
      !handleGenerateData(EdgeType.SOURCE).length &&
      handleGenerateData(EdgeType.PLACE).length
    ) {
      await handleSourceNode();
    } else if (
      handleGenerateData(EdgeType.SOURCE).length &&
      !handleGenerateData(EdgeType.PLACE).length
    ) {
      await handlePlaceNode();
    } else if (
      handleGenerateData(EdgeType.SOURCE).length &&
      handleGenerateData(EdgeType.PLACE).length
    ) {
      void message.warning('请勿重复查询');
    } else {
      try {
        const nodes: IUserNode[] = [];
        const edges: IUserEdge[] = [];
        const dataIn = await getOutAddressTransaction({
          address: focusedId,
          fromBlock: formData.date[0],
          toBlock: formData.date[1]
        });
        dataIn.forEach((item) => {
          const id = item.address;
          const hash = `0x${uuidv4()}${uuidv4()}`.replaceAll('-', '');
          const txNumber = item.count;
          const txAmount = Number(item.value) / 1e18;
          const source = focusedId;
          const target = item.address;
          nodes.push(setNode(id));
          edges.push(
            setEdge({
              hash,
              source,
              target,
              type: EdgeType.PLACE,
              txAmount,
              txNumber
            })
          );
        });
        const dataOut = await getInAddressTransaction({
          address: focusedId,
          fromBlock: formData.date[0],
          toBlock: formData.date[1]
        });
        dataOut.forEach((item) => {
          const id = item.address;
          const hash = `0x${uuidv4()}${uuidv4()}`.replaceAll('-', '');
          const txNumber = item.count;
          const txAmount = Number(item.value) / 1e18;
          const source = item.address;
          const target = focusedId;
          nodes.push(setNode(id));
          edges.push(
            setEdge({
              hash,
              source,
              target,
              type: EdgeType.SOURCE,
              txAmount,
              txNumber
            })
          );
        });

        const sourceData = {
          nodes: [...nodes, ...graphData.nodes],
          edges: [...edges, ...graphData.edges]
        };
        await changeData(sourceData, true);
      } catch (e) {
        console.log('e', e);
      }
    }
  }, [
    changeData,
    focusedId,
    formData.date,
    graphData.edges,
    graphData.nodes,
    handleGenerateData,
    handlePlaceNode,
    handleSourceNode
  ]);

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
    if (focusedId.length >= 64) {
      return '';
    }

    return focusedId;
  }, [focusedId]);

  const tools = [
    {
      onClick: () => void handleSourceNode(),
      type: AnalysisType.VIEW_SOURCE,
      title: '资金来源'
    },
    {
      onClick: () => void handlePlaceNode(),
      type: AnalysisType.VIEW_PLACE,
      title: '资金去向'
    },
    {
      onClick: () => void handleTargetNode(),
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
        'absolute bottom-[10%] left-0 right-0 flex justify-between gap-x-4 rounded-3xl bg-[#efefef] px-10 py-3'
      )}
    >
      {tools.map((tool) => (
        <AnalysisTool {...tool} key={tool.type} address={address} />
      ))}
    </div>
  );
};
