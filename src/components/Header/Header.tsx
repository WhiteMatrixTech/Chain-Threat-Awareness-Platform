import { Layout } from 'antd';
import React from 'react';

import styles from './Header.module.less';

const { Header: AntdHeader } = Layout;

export function Header() {
  return (
    <AntdHeader className={styles.Header}>区块链安全威胁感知平台</AntdHeader>
  );
}
