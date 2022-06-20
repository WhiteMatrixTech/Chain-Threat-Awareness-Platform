import { Layout } from 'antd';
import React from 'react';

import { Header } from '../Header';
import { LeftMenu } from '../LeftMenu';

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="h-screen overflow-hidden">
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <LeftMenu />
      </Sider>
      <Layout>
        <Header />
        <Content className="m-[24px]">
          <div className="min-h-360] overflow-y-auto">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
