import { QuestionCircleFilled } from '@ant-design/icons';
import { Empty, Tooltip } from 'antd';

import { DescriptionItem } from '@/components/DescriptionCard';
import { ITxDetail } from '@/services/mockData/addressAnalysis';
import { transformAddress } from '@/utils/common';

interface ITxDetailPros {
  txData: ITxDetail | undefined;
  unit: string;
}

export function TxDetail(props: ITxDetailPros) {
  const { unit, txData } = props;

  if (!txData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="h-full w-full p-6">
      <div className="mb-4 text-xl font-semibold">交易详情</div>
      <div className="my-6 flex items-center justify-between rounded-lg bg-[#f7f9fc] px-3 py-2">
        <div className="flex flex-col gap-y-1">
          <div className="text-base text-[#166CDD]">
            <Tooltip title={txData.from}>
              {transformAddress(txData.from, 4)}
            </Tooltip>
          </div>
          <div className="flex w-fit items-center rounded-sm bg-[#ebebeb] px-1 text-sm">
            <img
              width="20"
              height="20"
              className="mr-1"
              src="https://static.oklink.com/cdn/assets/imgs/2111/5DA549A4DD8C3AE6.png"
              alt="logoUrl"
            />
            <span>未知</span>
          </div>
        </div>
        <img
          className=" w-11"
          src="https://static.oklink.com/cdn/assets/imgs/223/EA45DEB006104C1E.png"
        />
        <div className="flex flex-col gap-y-1">
          <div className="text-base text-[#166CDD]">
            <Tooltip title={txData.to}>
              {transformAddress(txData.to, 4)}
            </Tooltip>
          </div>
          <div className="flex w-fit items-center rounded-sm bg-[#ebebeb] px-1 text-sm">
            <img
              width="20"
              height="20"
              className="mr-1"
              src="https://static.oklink.com/cdn/assets/imgs/2111/5DA549A4DD8C3AE6.png"
              alt="logoUrl"
            />
            <span>unknown</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto">
        <DescriptionItem label="交易笔数" content={`${txData.txNumber}笔`} />
        <DescriptionItem
          label="交易金额"
          unit={unit}
          content={txData.txAmount}
        />
        <DescriptionItem
          label="首次交易时间"
          content={txData.firstTxTimestamp}
        />
        <DescriptionItem
          label="最近交易时间"
          content={txData.recentTxTimestamp}
        />
      </div>
      <div className="mt-4 border-t-[0.0469rem] py-4">
        <div className="mb-4 text-xl font-semibold">交易列表</div>
        <div className="flex w-full items-center justify-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </div>
    </div>
  );
}
