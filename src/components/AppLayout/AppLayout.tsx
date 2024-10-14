/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:34:32
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-14 16:08:56
 */
import { Image, Layout } from "antd";
import cn from "classnames";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { Header } from "@/components/Header";
import { MenuList } from "@/components/LeftMenu/_menu";
import { UserProvider } from "@/services/context";

import styles from "./AppLayout.module.less";

const { Content, Sider } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [navInfo, setnavInfo] = useState({ start: "", end: "" });
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

  useEffect(
    () => {
      console.log("pathname>>", pathname);
      let start = "";
      let end = "";
      if (pathname.includes("/threat-detection")) {
        start = "威胁感知";
        const targetNav = MenuList.filter(
          (item: any) => item.key === "/threat-detection"
        )[0];
        end = targetNav.children.filter((item: any) =>
          pathname.includes(item.key)
        )[0].label;
      } else if (pathname.includes("/threat-evidence")) {
        start = "威胁取证";
        const targetNav = MenuList.filter(
          (item: any) => item.key === "/threat-evidence"
        )[0];
        end = targetNav.children.filter((item: any) =>
          pathname.includes(item.key)
        )[0].label;
      }
      setnavInfo({
        start: start,
        end: end
      });
    },
    [pathname]
  );

  return (
    <UserProvider>
      <div className=" h-screen overflow-hidden relative pt-[23px] pb-[30px] bg-[url('./assets/bgNew_webp.webp')] bg-cover bg-center">
        <Header />

        <div className="pt-[36px] overflow-y-auto overflow-x-hidden px-[40px] h-[calc(100%_-_64px)] relative">
          {navInfo.start.length !== 0 &&
            <div className="absolute top-0 left-0 text-[#EFF4FF] text-[20px] px-[31px]">
              {navInfo.start + "-" + navInfo.end}
            </div>}

          {children}
        </div>
      </div>
    </UserProvider>
  );
}
