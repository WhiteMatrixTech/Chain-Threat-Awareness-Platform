/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:34:32
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-27 01:08:12
 */
import { Image, Layout } from "antd";
import cn from "classnames";
import React, { useState } from "react";
import { useLocation } from "react-router";

import BgNew from "@/assets/bgNew.png";
import logo from "@/assets/logo.png";
import { Header } from "@/components/Header";
import { UserProvider } from "@/services/context";

import { LeftMenu } from "../LeftMenu";
import styles from "./AppLayout.module.less";

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const { pathname } = useLocation();
  const withoutLayout = ["/login", "/login/", "/register/", "/register"];

  if (withoutLayout.includes(pathname)) {
    return (
      <UserProvider>
        <Layout className={styles["auth-layout"]}>
          <Content>
            {children}
          </Content>
        </Layout>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <Layout className="h-screen overflow-hidden relative pt-[23px]">
        {/* 打点 */}
        <div
          className={cn(
            `absolute top-[0px] left-[0px] h-full w-full overflow-hidden z-[0]`
          )}
        >
          <img className="" src={BgNew} />
        </div>
        {/* <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          className={cn('w-[265px] max-w-[265px]', styles.layoutAside)}
          collapsible={true}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <a
            className="text-white flex w-full items-center justify-center py-3"
            href="/"
          >
            <span className="sr-only">Home</span>
            <Image width={180} src={logo} preview={false} />
          </a>
          <LeftMenu />
        </Sider> */}
        <Header />

        <Layout className="">
          <Content className="overflow-y-auto overflow-x-hidden px-[40px] pt-[36px] z-[1]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </UserProvider>
  );
}
