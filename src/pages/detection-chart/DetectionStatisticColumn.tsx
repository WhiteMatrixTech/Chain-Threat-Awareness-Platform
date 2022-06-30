import { Column, ColumnConfig } from '@ant-design/plots';
import cn from 'classnames';

import { SafetyInspectionItems } from '@/services/mockData/detectionChart';

import styles from './DetectionChart.module.less';
const data = [
  {
    projectNumber: '1',
    amount: 5
  },
  {
    projectNumber: '2',
    amount: 3
  },
  {
    projectNumber: '3',
    amount: 9
  },
  {
    projectNumber: '4',
    amount: 7
  },
  {
    projectNumber: '5',
    amount: 2
  },
  {
    projectNumber: '6',
    amount: 6
  },
  {
    projectNumber: '7',
    amount: 5
  }
];

const DemoColumn = () => {
  const config = {
    data,
    height: 200,
    xField: 'projectNumber',
    yField: 'amount',
    xAxis: {
      top: true,
      position: 'bottom',
      title: {
        text: '项目编号'
      },
      label: {
        autoHide: false,
        autoRotate: false
      }
    },
    yAxis: {
      top: true,
      position: 'left',
      title: {
        text: '问题数量'
      },
      label: {
        autoHide: false,
        autoRotate: false
      }
    },
    meta: {
      projectNumber: {
        alias: '项目编号'
      },
      amount: {
        alias: '问题数量'
      }
    }
  } as ColumnConfig;
  return <Column {...config} />;
};

export function DetectionStatisticColumn() {
  return (
    <div className={cn(styles.detectResultCard, 'bg-[#fcfbff]')}>
      <div className={cn(styles.column, 'py-[18px] px-6')}>
        <div>
          <span className="text-xl font-medium">检测结果统计</span>
          <span className="pl-1 text-xl font-normal opacity-70">
            自动形式化验证工具支持
          </span>
        </div>
        <div className="mt-5">
          <DemoColumn />
        </div>
      </div>
      <div className="w-[180px] bg-[#F6F4FD] py-[18px] px-5">
        <div className="text-xl font-medium">安全检测项</div>
        <ul className="mt-5 flex flex-col gap-y-2">
          {SafetyInspectionItems.map((label, index) => (
            <li key={label}>
              <span className="text-sm">{`${index + 1}. ${label}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
