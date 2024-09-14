/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-13 16:47:27
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-14 09:33:03
 */

import { LineChart } from "echarts/charts";
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from "echarts/components";
import * as echarts from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useState } from "react";

echarts.use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

export function ChartLine() {
  let myChart: any = null;

  const run = () => {
    const option = {
      animationDuration: 5000,
      grid: {
        bottom: "0%",
        right: "0%",
        left: "0%",
        top: "20px",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:00"],
        axisLine: {
          show: false
        },
        axisLabel: {
          color: "white"
        }
        // splitLine: {
        //   show: false,
        //   lineStyle: {
        //     // 设置间隔线颜色
        //     color: "red",
        //     // 设置间隔线的类型，可以是 'solid', 'dashed', 或 'dotted'
        //     type: "dashed"
        //   }
        // }
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "white"
        },
        splitLine: {
          show: true,
          lineStyle: {
            // 设置间隔线颜色
            color: "#4E6CAE",
            // 设置间隔线的类型，可以是 'solid', 'dashed', 或 'dotted'
            type: "solid"
          }
        }
      },
      series: [
        {
          data: [60000, 30000, 110000, 5000, 70000, 80000, 170000],
          type: "line",
          symbol: "rect",
          symbolSize: 3,
          lineStyle: {
            color: "#00FFD1",
            width: 1,
            type: ""
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: "#00FFD1",
            color: "#00FFD1"
          }
        }
      ]
    };

    option && myChart.setOption(option);
  };

  // 方案3
  const initEcharts = () => {
    // 读取json，执行run
    const chartDom = document.getElementById("main");
    myChart = echarts.init(
      chartDom,
      {
        // width: 400,
        // height: 340
      }
    );
    run();
  };

  useEffect(() => {
    void initEcharts();
  }, []);
  return (
    <div className="w-full h-full ">
      <div id="main" className="w-full h-full " />
    </div>
  );
}
