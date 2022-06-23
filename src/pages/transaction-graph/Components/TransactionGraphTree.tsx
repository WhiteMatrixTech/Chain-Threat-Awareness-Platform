import Graphin, { Behaviors, GraphinTreeData, Utils } from '@antv/graphin';
import { useEffect, useRef } from 'react';

const { TreeCollapse } = Behaviors;
const data = Utils.mock(10).tree().graphinTree();

const walk = (
  node: GraphinTreeData,
  callback: (node: GraphinTreeData) => void
) => {
  callback(node);
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      walk(child, callback);
    });
  }
};

walk(data, (node) => {
  node.style = {
    label: {
      value: node.id
    }
  };
});

const layout = {
  type: 'mindmap',
  options: {
    direction: 'H',
    getHeight: () => {
      return 26;
    },
    getWidth: () => {
      return 26;
    },
    getVGap: () => {
      return 26;
    },
    getHGap: () => {
      return 50;
    }
  }
};

export function TransactionGraphTree() {
  const graphinRef = useRef<Graphin>(null);

  useEffect(() => {
    const {
      graph, // g6 的Graph实例
      apis // Graphin 提供的API接口
    } = graphinRef.current as Graphin;
    console.log('ref', graphinRef, graph, apis);
  }, []);

  return (
    <div id="TransactionGraphContainer" className="w-full">
      <Graphin data={data} ref={graphinRef} layout={layout} fitView={true}>
        <TreeCollapse />
      </Graphin>
    </div>
  );
}
