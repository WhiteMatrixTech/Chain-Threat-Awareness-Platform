import {
  Group,
  Image,
  Rect,
  Text
} from '@antv/g6-react-node';
import Graphin from '@antv/graphin';
import cn from 'classnames';
import React from 'react';

import styles from './GraphinNodes.module.less';

export function DefaultTxNode({ cfg = {} }: { cfg : any}) {

  const { description, meta = {}, label = '交易哈希' } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#fff',
          stroke: '#ddd',
          shadowColor: '#eee',
          shadowBlur: 30,
          radius: [8],
          justifyContent: 'center',
          padding: [18, 0]
        }}
        draggable
      >
        <Text
          style={{
            fill: '#000',
            margin: [0, 24],
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          这是一个卡片
        </Text>
        <Text style={{ fill: '#ccc', fontSize: 12, margin: [12, 24] }}>
          描述描述
        </Text>
      </Rect>
    </Group>
  );
}

export function InflowAddressNode({ cfg = {} }: { cfg: any }) {
  const { description, meta = {}, label = '交易哈希' } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#fff',
          stroke: '#ddd',
          shadowColor: '#eee',
          shadowBlur: 30,
          radius: [8],
          justifyContent: 'center',
          padding: [18, 0]
        }}
        draggable
      >
        <Text
          style={{
            fill: '#000',
            margin: [0, 24],
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          这是一个卡片
        </Text>
        <Text style={{ fill: '#ccc', fontSize: 12, margin: [12, 24] }}>
          描述描述
        </Text>
      </Rect>
    </Group>
  );
}

export function OutflowAddressNode({ cfg = {} }: { cfg: any }) {
  const { description, meta = {}, label = '交易哈希' } = cfg;

  return (
    <Group>
      <Rect
        style={{
          width: 'auto',
          height: 'auto',
          fill: '#fff',
          stroke: '#ddd',
          shadowColor: '#eee',
          shadowBlur: 30,
          radius: [8],
          justifyContent: 'center',
          padding: [18, 0]
        }}
        draggable
      >
        <Text
          style={{
            fill: '#000',
            margin: [0, 24],
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          这是一个卡片
        </Text>
        <Text style={{ fill: '#ccc', fontSize: 12, margin: [12, 24] }}>
          描述描述
        </Text>
      </Rect>
    </Group>
  );
}
