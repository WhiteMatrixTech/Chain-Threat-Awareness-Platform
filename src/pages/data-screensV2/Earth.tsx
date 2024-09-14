/*
 * @Description: 老版本改造
 * @Author: didadida262
 * @Date: 2024-09-14 10:32:18
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-14 15:56:37
 */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import * as GIO from "giojs";
import { useEffect, useState } from "react";

import data from "@/utils/json/sampleData2.json";

export function Earth() {
  useEffect(() => {
    const container = document.getElementById("screen");
    if (!container) return;

    const controller = new GIO.Controller(container);
    controller.setTransparentBackground(true);
    controller.configure({
      brightness: {
        ocean: 1,
        mentioned: 1,
        related: 0.5
      },
      color: {
        // background: "none",
        // 大陆和海洋的颜色
        surface: "#FFFFFF",
        // 选中的国家
        selected: "#6cebfd",
        // related: "#FF686899",
        // 光晕
        halo: "white",
        // 连接线
        in: "#0053b7",
        out: "#6cebfd"
      }
    });

    controller.setInitCountry("US");
    controller.showInOnly(true);

    controller.addData(data);
    controller.init();
  }, []);
  return (
    <div className="earth-container h-full w-full">
      <div id="screen" className="h-full w-full" />
    </div>
  );
}
