import { Image, Layout } from 'antd';
import cn from 'classnames';
import React, { useState } from 'react';
import { useLocation } from 'react-router';

import logo from '@/assets/logo.png';
import { UserProvider } from '@/services/context';

import { Header } from '../Header';
import { LeftMenu } from '../LeftMenu';
import styles from './AppLayout.module.less';

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const { pathname } = useLocation();
  const withoutLayout = ['/login', '/login/', '/register/', '/register'];

  if (withoutLayout.includes(pathname)) {
    return (
      <UserProvider>
        <Layout className={styles['auth-layout']}>
          <Content>{children}</Content>
        </Layout>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
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
          <a
            className="text-white flex w-full items-center justify-center py-4"
            href="/"
          >
            <span className="sr-only">Home</span>
            <Image width={75} src={logo} preview={false} />
          </a>
          <LeftMenu />
        </Sider>
        <Layout>
          <Header />
          <Content className="overflow-y-auto overflow-x-hidden p-[24px]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </UserProvider>
  );
}
