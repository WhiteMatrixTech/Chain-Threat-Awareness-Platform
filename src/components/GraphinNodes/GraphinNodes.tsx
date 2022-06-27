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
    <div>
      DefaultTxNode
    </div>
  );
}

export function InflowAddressNode({ cfg = {} }: { cfg: any }) {
  const { description, meta = {}, label = '交易哈希' } = cfg;

  return (
    <div>
      InflowAddressNode
    </div>
  );
}

export function OutflowAddressNode({ cfg = {} }: { cfg: any }) {
  const { description, meta = {}, label = '交易哈希' } = cfg;

  return (
    <div>
      OutflowAddressNode
    </div>
  );
}
