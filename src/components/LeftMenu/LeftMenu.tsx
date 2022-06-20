import { Menu } from 'antd';
import React from 'react';

import styles from './LeftMenu.module.less';

const { SubMenu } = Menu;

export function LeftMenu() {
  return (
    <div className="h-screen overflow-hidden bg-[#166CDD]">
      <Menu mode="inline" className={styles.LeftMenu}>
        <SubMenu title="数据仓库">
          <Menu.Item>数据仓库-创建</Menu.Item>
        </SubMenu>
        <SubMenu title="威胁感知">
          <Menu.Item>监测结果</Menu.Item>
          <Menu.Item>查看图表</Menu.Item>
        </SubMenu>
        <SubMenu title="威胁取证">
          <Menu.Item>地址分析</Menu.Item>
          <Menu.Item>取证图谱</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
}
