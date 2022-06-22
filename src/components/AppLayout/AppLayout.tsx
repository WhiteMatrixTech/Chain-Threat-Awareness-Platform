import { Layout } from 'antd';
import React from 'react';

import { Header } from '../Header';
import { LeftMenu } from '../LeftMenu';
import styles from './AppLayout.module.less';

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        className={styles.layoutAside}
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
