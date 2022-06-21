import { BellOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { ResultIconColor } from '@/services/mockData/contractDetection';
import {
  DetectionResults,
  IDetectionDetail
} from '@/services/mockData/detectionChart';

import styles from './DetectionChart.module.less';

export function DetectionDetail() {
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
        {DetectionResults.map((item) => (
          <DetectionDetailItem key={item.message} {...item} />
        ))}
      </div>
    </div>
  );
}

function DetectionDetailItem(data: IDetectionDetail) {
  return (
    <div className="text-base">
      <div className="item-center mb-3 flex">
        <div
          className="flex h-6 w-6 items-center justify-center p-2"
          style={{ backgroundColor: ResultIconColor[data.type] }}
        >
          <BellOutlined style={{ color: '#fff' }} />
        </div>
        <div className="ml-2">
          {`${data.filePath} 代码行数：${data.position.line}`}
        </div>
      </div>
      <div className="ml-5 mb-2">
        <span>{data.message}</span>
      </div>
      <div className="ml-5">
        <span>{`修复建议: ${data.suggestion}`}</span>
        <span>
          <a
            href={data.documentLink}
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
