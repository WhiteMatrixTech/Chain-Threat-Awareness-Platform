/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import { useSearchParams } from "react-router-dom";

import { Column, ColumnConfig } from "@ant-design/plots";
import { SafetyInspectionItems } from "@/services/mockData/detectionChart";

import styles from "./DetectionChart.module.less";

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
    <div className={cn(styles.detectResultCard, "bg-[#fcfbff]")}>
      <div className={cn(styles.column, "py-[18px] px-6")}>
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
