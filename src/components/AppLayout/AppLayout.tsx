import { Layout } from 'antd';
import cn from 'classnames';
import React, { useState } from 'react';

import { Header } from '../Header';
import { LeftMenu } from '../LeftMenu';
import styles from './AppLayout.module.less';

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        className={cn('w-[265px] max-w-[265px]', styles.layoutAside)}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <LeftMenu />
      </Sider>
      <Layout>
        <Header />
        <Content className="overflow-y-auto overflow-x-hidden p-[24px]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
