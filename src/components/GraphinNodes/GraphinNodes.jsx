import { Group, Image, Rect, Text, Circle } from '@antv/g6-react-node';
import React from 'react';
import insertCss from 'insert-css';
import { transformAddress } from '@/utils/common';

import styles from './GraphinNodes.module.less';

export function registerGraphContentMenu() {
  // define the CSS with the id of your menu

  // 我们用 insert-css 演示引入自定义样式
  // 推荐将样式添加到自己的样式文件中
  // 若拷贝官方代码，别忘了 npm install insert-css
  insertCss(`
  .graphContextMenu {
    position: absolute;
    list-style-type: none;
    padding: 10px 8px;
    left: -150px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: red;
  }
  .graphContextMenu li {
    cursor: pointer;
		list-style-type:none;
    list-style: none;
    margin-left: 0px;
  }
  .graphContextMenu li:hover {
    color: #aaa;
  }
`);
}

export function CenterTxNode({ cfg = {} }) {
  const { id, isSelected = false } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#f5f5f5',
          stroke: isSelected ? '#166CDD' : '#f5f5f5',
          radius: [4],
          cursor: 'pointer',
          justifyContent: 'center',
          padding: [8, 16]
        }}
        draggable
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 600,
            fill: '#166CDD',
            cursor: 'pointer'
          }}
        >
          {transformAddress(id, 4)}
        </Text>
      </Rect>
    </Group>
  );
}

export function DefaultTxNode({ cfg = {} }) {
  const { id, isSelected = false } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#f5f5f5',
          stroke: isSelected ? '#166CDD' : '#f5f5f5',
          radius: [4],
          cursor: 'pointer',
          justifyContent: 'center',
          padding: [8, 16]
        }}
        draggable
      >
        <Text
          style={{
            fontSize: 16,
            fill: isSelected ? '#166CDD' : '#000',
            cursor: 'pointer'
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
    tokenUnit = 'BTC',
    tokenAmount = 0,
    isSelected = false,
    flowType = 'inflow'
  } = cfg;

  const tokenColor = flowType === 'inflow' ? '#389e0d' : '#cf1322';

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#fff',
          stroke: isSelected ? '#166CDD' : '#ddd',
          radius: [4],
          cursor: 'pointer',
          justifyContent: 'center',
          padding: [4, 4]
        }}
      >
        <Rect
          style={{
            width: 'auto',
            cursor: 'pointer',
            flexDirection: 'row',
            margin: [4, 0]
          }}
        >
          <Image
            style={{
              img: 'https://static.oklink.com/cdn/explorer/icon/exchange/unknown.png',
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: 'pointer'
            }}
          />
          <Text
            style={{
              fill: isSelected ? '#166CDD' : '#000',
              fontSize: 16,
              margin: [0, 2],
              cursor: 'pointer'
            }}
          >
            {transformAddress(id, 4)}
          </Text>
        </Rect>
        <Rect
          style={{
            width: 'auto',
            cursor: 'pointer',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'start',
            margin: [4, 0]
          }}
        >
          <Image
            style={{
              img: 'https://static.oklink.com/cdn/explorer/icon/exchange/unknown.png',
              width: 16,
              height: 16,
              margin: [0, 2],
              cursor: 'pointer'
            }}
          />
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: 'pointer'
            }}
          >
            {tokenAmount}
          </Text>
          <Text
            style={{
              fill: tokenColor,
              fontSize: 16,
              margin: [0, 2],
              cursor: 'pointer'
            }}
          >
            {tokenUnit}
          </Text>
        </Rect>
      </Rect>
    </Group>
  );
}
