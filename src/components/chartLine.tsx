/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
 * @LastEditTime: 2024-10-14 16:21:26
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
interface IProps {
  data: any;
}
export function ChartLine(props: IProps) {
  const [chart, setChart] = useState(null) as any;

  const { data } = props;
  let myChart: any = null;

  const run = () => {
    const time = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        time.push(`0${i}:00`);
      } else {
        time.push(`${i}:00`);
      }
    }
    const option = {
      // animationDuration: 5000,
      grid: {
        bottom: "0%",
        right: "0%",
        left: "0%",
        top: "20px",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: [],
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
          data: [],
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
    setChart(myChart);
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
  const getTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒

    const hours = date.getHours().toString().padStart(2, "0"); // 获取小时，并补零
    const minutes = date.getMinutes().toString().padStart(2, "0"); // 获取分钟，并补零
    const seconds = date.getSeconds().toString().padStart(2, "0"); // 获取秒，并补零

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
  };

  useEffect(() => {
    void initEcharts();
  }, []);
  useEffect(
    () => {
      // 使用 setOption 重新绘制
      if (!chart) return;
      const newXData = data
        .map((item: any) => getTime(item.timestamp))
        .reverse();
      chart.setOption({
        series: [
          {
            data: data.map((item: any) => item.value).reverse()
          }
        ],
        xAxis: {
          data: newXData
        }
      });
    },
    [data]
  );

  return (
    <div className="w-full h-full ">
      <div id="main" className="w-full h-full " />
    </div>
  );
}
