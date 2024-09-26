/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import "@antv/graphin-icons/dist/index.css";

import Graphin, { Behaviors, GraphinData } from "@antv/graphin";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useAsyncFn } from "react-use";
import { v4 as uuidv4 } from "uuid";

import { AnalysisLoading } from "@/components/AnalysisLoading";
import styles from "@/pages/address-analysis/AddressAnalysis.module.less";
import { randomNum, transformAddress, waitTime } from "@/utils/common";
import { initGraphData, setNode } from "@/utils/graph";
import { IGraphFormData } from "@/utils/IdentityTypes";

import { GraphDataBar } from "./GraphDataBar";
import { MouseBehavior } from "./MouseBehavior";
import { ToolBar } from "./ToolBar";

const { ZoomCanvas, Hoverable, ActivateRelations, FontPaint } = Behaviors;

export type TGraphinClickTarget = "node" | "edge" | "canvas";
interface IAddressTxGraphProps {
  focusedId: string;
  formData: IGraphFormData;
  dataList: any;
  changeData: (data: GraphinData) => void;
  handleClick: (hexString: string, type?: TGraphinClickTarget) => void;
}

const layout = {
  type: "graphin-force",
  // center: [100, 100], // 可选，
  rankdir: "LR" // 可选，默认为图的中心,
  // linkDistance: 300, // 可选，边长,
  // nodeSize: 1500
};

export function AddressTxGraph(props: IAddressTxGraphProps) {
  const { focusedId, formData, handleClick, changeData, dataList } = props;
  const graphRef = useRef<Graphin | null>(null);
  const containerRef = useRef(null);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const handleReset = () => {
    setGraphData({ edges: [], nodes: [setNode(formData.address)] });
    handleClick(formData.address);
  };

  const [
    { loading },
    handleChangeData
  ] = useAsyncFn(async (data: GraphinData, setLoading?: boolean) => {
    if (setLoading) {
      await waitTime(800);
    }
    setGraphData(data);

    if (graphRef.current && focusedId) {
      const { apis } = graphRef.current;
      apis.focusNodeById(focusedId);
    }
    // if (containerRef.current && graphRef.current) {
    //   const container = containerRef.current;
    //   const graph = graphRef.current;
    //   graph.updateLayout();
    //   // 设置画布的宽度和高度为外层 div 容器的宽度和高度
    //   // graph.updateLayout({
    //   //   width: container.clientWidth,
    //   //   height: container.clientHeight
    //   // });
    // }

    return data;
  }, []);
  const uniquee = (data: any) => {
    return data.reduce((acc: any, currentValue: any) => {
      if (
        !acc.filter(
          (item: any) =>
            item.src === currentValue.src && item.dst === currentValue.dst
        ).length
      ) {
        acc.push(currentValue);
      }
      return acc;
    }, []);
  };
  const generateNode = () => {
    const res = [];
    const addressNode = {
      id: formData.address,
      selected: focusedId === formData.address,
      style: {
        keyshape: {
          size: 40,
          stroke: "#3BA4FF",
          fill: "white"
        },
        label: {
          value: transformAddress(formData.address),
          fill: "white"
        }
      }
    };
    res.push(addressNode);

    const inputData = uniquee(
      dataList.filter((item: any) => item.dst === formData.address)
    );
    const outputData = uniquee(
      dataList.filter((item: any) => item.src === formData.address)
    );

    for (const item of inputData) {
      const newNode = {
        id: item.src,
        style: {
          keyshape: {
            size: 40,
            stroke: "#3BA4FF",
            fill: "white"
          },
          label: {
            value: transformAddress(item.src),
            fill: "white"
          }
        }
      };
      res.push(newNode);
    }
    for (const item of outputData) {
      const newNode = {
        id: item.dst,
        style: {
          keyshape: {
            size: 40,
            stroke: "#3BA4FF",
            fill: "white"
          },
          label: {
            value: transformAddress(item.dst),
            fill: "white"
          }
        }
      };
      res.push(newNode);
    }
    return [...res];
  };
  const generateEdge = () => {
    const res = [];
    // const uniqueArray = dataList.reduce((acc: any, currentValue: any) => {
    //   if (!acc.filter((item: any) => item.dst === currentValue.dst).length) {
    //     acc.push(currentValue);
    //   }
    //   return acc;
    // }, []);
    const inputData = uniquee(
      dataList.filter((item: any) => item.dst === formData.address)
    );
    const outputData = uniquee(
      dataList.filter((item: any) => item.src === formData.address)
    );
    for (const item of [...inputData, ...outputData]) {
      const newEdges = {
        id: `${uuidv4().replaceAll("-", "")}`,
        source: item.src,
        target: item.dst,
        style: {
          keyshape: {
            stroke: "white",
            lineWidth: 1
          }
          // animate: {
          //   type: "line-dash",
          //   repeat: true
          // }
        }
      };
      res.push(newEdges);
    }
    return [...res];
  };

  useEffect(
    () => {
      const nodes = generateNode();
      const edges = generateEdge();
      const initGraphData = {
        edges: edges,
        nodes: nodes
      };

      void handleChangeData(initGraphData);
    },
    [formData.address, handleChangeData]
  );

  // useEffect(
  //   () => {
  //     changeData(graphData);
  //   },
  //   [changeData, graphData]
  // );

  return (
    <div id="AddressTxGraphContainer" className=" relative h-full w-full">
      {loading && <AnalysisLoading />}
      <div
        id="AddressTxGraphContainer"
        ref={containerRef}
        className={cn("w-full h-full")}
      >
        <Graphin
          data={graphData}
          ref={graphRef}
          layout={layout}
          style={{
            height: "100%",
            width: "100%",
            minHeight: "330px",
            background: "none"
          }}
        >
          <ZoomCanvas />
          {/* <FontPaint /> */}
          {/* <ActivateRelations trigger="click" /> */}
          {/* <Hoverable bindType="edge" /> */}
          <MouseBehavior handleClick={handleClick} />
        </Graphin>
      </div>
    </div>
  );
}
