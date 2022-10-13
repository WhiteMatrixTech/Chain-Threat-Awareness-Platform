/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { BellOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ERROR_DETAIL, ERROR_TIPS } from '@/constant';
import { ResultIconColor } from '@/services/mockData/contractDetection';

import styles from './DetectionChart.module.less';

export function DetectionDetail() {
  const [searchParams] = useSearchParams();
  let DetectionResults: any[] = [];
  try {
    DetectionResults = JSON.parse(
      window.atob(searchParams.get('result') || '') || ''
    );
  } catch (e) {}
  return (
    <div
      className={cn(
        styles.detectResultCard,
        'h-full flex-col bg-white py-[18px] px-6'
      )}
    >
      <div className="text-xl font-medium">
        {`检测结果详述：${DetectionResults.length}`}
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-y-8 overflow-y-auto">
        {DetectionResults.map((item, index) => (
          <DetectionDetailItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

function DetectionDetailItem(data: any) {
  return (
    <div className="text-base">
      <div className="item-center mb-3 flex">
        <div
          className="flex h-6 w-6 items-center justify-center p-2"
          style={{
            backgroundColor:
              ResultIconColor[data.security as 'Low' | 'High' | 'Medium']
          }}
        >
          <BellOutlined style={{ color: '#fff' }} />
        </div>
        <div className="ml-2"> 代码行数：{data.line}</div>
      </div>
      <div className="ml-5 mb-2">
        <span>{ERROR_DETAIL[data.swcId]?.desc}</span>
      </div>
      <div className="ml-5">
        <span>修复建议:{ERROR_DETAIL[data.swcId]?.handle}</span>
        <span>
          <a
            href={ERROR_TIPS[data.swcId] || ''}
            target="_blank"
            rel="noreferrer"
            className="text-[#166CDD] underline hover:text-[#166CDD]"
          >
            点击此处查看文档详情
          </a>
        </span>
      </div>
    </div>
  );
}
