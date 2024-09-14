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
 * @LastEditTime: 2024-09-14 09:20:59
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

import chart1Data from "@/services/mockData/chart1Data.json";
import chart_data from "@/services/mockData/chartData.json";

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

export function ChartLineAddress() {
  let myChart: any = null;

  const run = () => {
    const option = {
      animationDuration: 15000,
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
        min: 1500000,
        max: 3000000,
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
          data: [1800000, 1880000, 2001000, 2090000, 2100000, 2200000, 2290000],
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
  console.log("chart_data>>", chart_data);

  const initEcharts = () => {
    // 读取json，执行run
    const chartDom = document.getElementById("main2");
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
      <div id="main2" className="w-full h-full " />
    </div>
  );
}
