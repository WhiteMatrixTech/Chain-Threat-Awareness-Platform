import { IEdge, INode } from '@antv/g6-core';
import {
  EdgeConfig,
  GraphinContext,
  IG6GraphEvent,
  NodeConfig
} from '@antv/graphin';
import { useCallback, useContext } from 'react';
import { useMount, useUnmount } from 'react-use';

import { TGraphinClickTarget } from './AddressTxGraph';

export const MouseBehavior = ({
  handleClick
}: {
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
}) => {
  const { graph, apis } = useContext(GraphinContext);

  const handleClickNode = useCallback(
    (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;

      // 每次点击聚焦到点击节点上
      apis.focusNodeById(model.id);
      handleClick(model.id, 'node');
    },
    [apis, handleClick]
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

  useMount(() => {
    graph.on('click', handleClickGraphin);
    graph.on('node:click', handleClickNode);
    graph.on('edge:click', handleClickEdge);
  });

  useUnmount(() => {
    graph.off('click', handleClickGraphin);
    graph.off('node:click', handleClickNode);
    graph.off('edge:click', handleClickEdge);
    graph.destroy();
  });

  return null;
};
