/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-14 10:32:18
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-14 13:50:30
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
      // linkPointRadius: 2,
      brightness: {
        related: 0.1
      },
      color: {
        // background: "none",
        // surface: 0x1890ff,
        // 选中的国家
        selected: "#6cebfd",
        // related: "#FF686899",
        // 光晕
        halo: "white",
        // 连接线
        in: "#0053b7",
        out: "#0053b7"
        // 海洋亮度
      }
      // adjustOceanBrightness: 1
    });

    controller.addData(data);
    controller.init();
  }, []);
  return (
    <div className="earth-container h-full w-full">
      <div id="screen" className="h-full w-full" />
    </div>
  );
}
