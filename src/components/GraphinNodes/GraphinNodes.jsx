import insertCss from "insert-css";
import React from "react";

import { Group, Image, Rect, Text } from "@antv/g6-react-node";
import { transformAddress } from "@/utils/common";
import { DragNode } from "@antv/graphin-components";
import unknowPng from "@/assets/unknown.png";

import styles from "./GraphinNodes.module.less";

export function registerGraphContentMenu() {
  // define the CSS with the id of your menu

  // 我们用 insert-css 演示引入自定义样式
  // 推荐将样式添加到自己的样式文件中
  // 若拷贝官方代码，别忘了 npm install insert-css
  insertCss(`
  .graphContextMenu {
    position: absolute;
    margin: 0;
    padding: 4px 0;
    text-align: left;
    list-style-type: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  }
  .graphContextMenu li {
    clear: both;
    margin: 0;
    padding: 5px 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .graphContextMenu li:hover {
    background-color: #f5f5f5;
  }
`);
}

export function CenterTxNode({ cfg = {} }) {
  const { id, isSelected = false } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: "auto",
          height: "auto",
          fill: "#edf1f9",
          stroke: isSelected ? "#166CDD" : "#edf1f9",
          radius: [4],
          cursor: "pointer",
          justifyContent: "center",
          padding: [10, 20]
        }}
        draggable
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 800,
            fill: "#166CDD",
            cursor: "pointer"
          }}
        >
          {transformAddress(id, 4)}
        </Text>
      </Rect>
    </Group>
  );
}

export function DefaultTxNode({ cfg = {} }) {
  const { id, isHovered = false, isSelected = false } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: "auto",
          height: "auto",
          fill: "#edf1f9",
          stroke: isSelected ? "#166CDD" : "#edf1f9",
          radius: [4],
          cursor: "pointer",
          justifyContent: "center",
          padding: [8, 16]
        }}
        draggable
      >
        <Text
          style={{
            fontSize: 16,
            fill: isSelected || isHovered ? "#166CDD" : "#303133",
            cursor: "pointer"
          }}
        >
          {transformAddress(id, 4)}
        </Text>
      </Rect>
    </Group>
  );
}

export function AmountFlowAddressNode({ cfg = {} }) {
  const {
    id,
    tokenUnit = "BTC",
    tokenAmount = 0,
    isHovered = false,
    isSelected = false,
    flowType = "inflow"
  } = cfg;

  const tokenColor = flowType === "inflow" ? "#389e0d" : "#cf1322";

  return (
    <Group>
      <Rect
        style={{
          width: "auto",
          height: "auto",
          fill: "#fff",
          stroke: isSelected ? "#166CDD" : "#ddd",
          radius: [4],
          cursor: "pointer",
          justifyContent: "center",
          padding: [4, 32, 4, 4]
        }}
      >
        <Rect
          style={{
            width: "auto",
            cursor: "pointer",
            flexDirection: "row",
            margin: [4, 0]
          }}
        >
          <Image
            style={{
              img:
                "https://static.oklink.com/cdn/explorer/icon/exchange/unknown.png",
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          />
          <Text
            style={{
              fill: isSelected || isHovered ? "#166CDD" : "#303133",
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {transformAddress(id, 4)}
          </Text>
        </Rect>
        <Rect
          style={{
            width: "auto",
            cursor: "pointer",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            margin: [4, 0]
          }}
        >
          <Image
            style={{
              img:
                "https://static.oklink.com/cdn/explorer/icon/exchange/unknown.png",
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          />
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {tokenAmount}
          </Text>
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {tokenUnit}
          </Text>
        </Rect>
      </Rect>
    </Group>
  );
}

// 设置交易图谱的第三层节点
export function DiyNode({ cfg = {} }) {
  const {
    id,
    tokenUnit = "BTC",
    tokenAmount = 0,
    isHovered = false,
    isSelected = false,
    flowType = "inflow"
  } = cfg;

  const tokenColor = flowType === "inflow" ? "#389e0d" : "#cf1322";

  return (
    <Group>
      <Rect
        style={{
          width: "auto",
          height: "auto",
          fill: "#fff",
          stroke: isSelected ? "#166CDD" : "#ddd",
          radius: [4],
          cursor: "pointer",
          justifyContent: "center",
          padding: [4, 10, 4, 4]
        }}
      >
        <Rect
          style={{
            width: "auto",
            cursor: "pointer",
            flexDirection: "row",
            margin: [4, 0]
          }}
        >
          {/* <Image
            style={{
              img: unknowPng,
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          /> */}
          <Text
            style={{
              fill: isSelected || isHovered ? "#166CDD" : "#303133",
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {transformAddress(id, 4)}
          </Text>
        </Rect>
        <Rect
          style={{
            width: "auto",
            cursor: "pointer",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            margin: [4, 0]
          }}
        >
          {/* <Image
            style={{
              img: unknowPng,
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          /> */}
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {tokenAmount}
          </Text>
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: "pointer"
            }}
          >
            {tokenUnit}
          </Text>
        </Rect>
      </Rect>
    </Group>
  );
}
