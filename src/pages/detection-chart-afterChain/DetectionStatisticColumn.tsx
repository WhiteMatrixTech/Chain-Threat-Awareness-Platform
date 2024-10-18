/* eslint-disable prettier/prettier */
import { Column, ColumnConfig } from "@ant-design/plots";
import cn from "classnames";
import { useSearchParams } from "react-router-dom";

import { SafetyInspectionItems } from "@/services/mockData/detectionChart";

// import styles from "./DetectionChart.module.less";

const data = [
  {
    projectNumber: "1",
    amount: 5
  },
  {
    projectNumber: "2",
    amount: 3
  },
  {
    projectNumber: "3",
    amount: 9
  },
  {
    projectNumber: "4",
    amount: 7
  },
  {
    projectNumber: "5",
    amount: 2
  },
  {
    projectNumber: "6",
    amount: 6
  },
  {
    projectNumber: "7",
    amount: 5
  },
  {
    projectNumber: "8",
    amount: 2
  },
  {
    projectNumber: "9",
    amount: 6
  },
  {
    projectNumber: "10",
    amount: 3
  }
];
const colors: any = [
  "#34A853", // 舒适的绿色
  "#6298F4", // 柔和的蓝色灰
  "#F9D95E", // 鲜艳的红色
  "#9B59B6", // 柔和的紫色
  "#2ECC71", // 鲜艳的绿色
  "#F1C40F", // 明亮的黄色
  "#E67E22", // 鲜艳的橙色
  "#3498DB", // 鲜艳的蓝色
  "#95A5A6", // 浅灰色调
  "#FE7979", // 清爽的绿色
  "#D35400" // 橙红色
];
const DemoColumn = () => {
  const [searchParams] = useSearchParams();
  let DetectionResults: any[] = [];
  try {
    DetectionResults = JSON.parse(
      window.atob(searchParams.get("result") || "") || ""
    );
  } catch (e) {}
  console.log(DetectionResults);
  const config = {
    data: [
      {
        projectNumber: "1",
        amount: DetectionResults.filter(o => o.swcId === 101).length
      },
      {
        projectNumber: "2",
        amount: DetectionResults.filter(o => o.swcId === 104).length
      },
      {
        projectNumber: "3",
        amount: DetectionResults.filter(o => o.swcId === 105).length
      },
      {
        projectNumber: "4",
        amount: DetectionResults.filter(o => o.swcId === 106).length
      },
      {
        projectNumber: "5",
        amount: DetectionResults.filter(o => o.swcId === 107).length
      },
      {
        projectNumber: "6",
        amount: DetectionResults.filter(o => o.swcId === 110).length
      },
      {
        projectNumber: "7",
        amount: DetectionResults.filter(o => o.swcId === 112).length
      },
      {
        projectNumber: "8",
        amount: DetectionResults.filter(o => o.swcId === 114).length
      },
      {
        projectNumber: "9",
        amount: DetectionResults.filter(o => o.swcId === 120).length
      },
      {
        projectNumber: "10",
        amount: DetectionResults.filter(o => o.swcId === 132).length
      },
      {
        projectNumber: "11",
        amount: DetectionResults.filter(o => o.swcId === 124).length
      }
    ],
    columnStyle: (item: any) => {
      // return { fill: item.color }; // 其他类型的柱子颜色为蓝色
      console.log(item);
      return { fill: colors[Number(item.projectNumber) - 1] }; // 其他类型的柱子颜色为蓝色
    },
    height: 200,
    xField: "projectNumber",
    yField: "amount",
    xAxis: {
      top: true,
      position: "bottom",
      title: {
        text: "漏洞类型编号"
      },
      label: {
        autoHide: false,
        autoRotate: false
      }
    },
    yAxis: {
      tickInterval: 1,
      top: true,
      position: "left",
      title: {
        text: "问题数量"
      },
      label: {
        autoHide: false,
        autoRotate: false
      }
    },
    meta: {
      projectNumber: {
        alias: "项目编号"
      },
      amount: {
        alias: "问题数量"
      }
    }
  } as ColumnConfig;
  return <Column {...config} />;
};

export function DetectionStatisticColumn() {
  return (
    // <div className={cn(styles.detectResultCard, "bg-[#fcfbff]")}>
    <div
      className={cn("flex bg-[#fcfbff] rounded-[4px]")}
      style={{ boxShadow: "0px 4px 12px rgba(163, 174, 191, 0.2)" }}
    >
      {/* <div className={cn(styles.column, "py-[18px] px-6")}> */}
      <div className={cn("py-[18px] px-6 flex-1 min-w-[calc(100%_-_220px)]")}>
        <div>
          <span className="text-xl font-medium">检测结果统计</span>
          <span className="pl-1 text-xl font-normal opacity-70" />
        </div>
        <div className="mt-5 h-[300px]">
          <DemoColumn />
        </div>
      </div>
      <div className="w-[220px] bg-[#F6F4FD] py-[18px] px-5">
        <div className="text-xl font-medium">安全检测项</div>
        <ul className="mt-5 flex flex-col gap-y-2">
          {SafetyInspectionItems.map((label, index) =>
            <li key={label}>
              <span className="text-sm">{`${index + 1}. ${label}`}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
