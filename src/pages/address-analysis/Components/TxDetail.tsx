import { Empty, Tooltip } from 'antd';

import { DescriptionItem } from '@/components/DescriptionCard';
import { ITxDetail } from '@/services/mockData/addressAnalysis';
import { transformAddress } from '@/utils/common';

interface ITxDetailPros {
  txData: ITxDetail;
}

export function TxDetail(props: ITxDetailPros) {
  const { txData } = props;

  return (
    <div className="h-full w-full p-6">
      <div className="text-xl font-semibold">交易详情</div>
      <div className="flex flex-col gap-y-4 overflow-y-auto">
        <DescriptionItem
          label="发送方"
          content={
            <span className="mr-2 text-lg text-[#166CDD]">
              <Tooltip title={txData.from}>
                {transformAddress(txData.from)}
              </Tooltip>
            </span>
          }
        />
        <DescriptionItem
          label="接收方"
          content={
            <span className="mr-2 text-lg text-[#166CDD]">
              <Tooltip title={txData.to}>{transformAddress(txData.to)}</Tooltip>
            </span>
          }
        />
        <DescriptionItem label="交易笔数" content={`${txData.txNumber}笔`} />
        <DescriptionItem label="交易金额" content={txData.txAmount} />
        <DescriptionItem
          label="首次交易时间"
          content={txData.firstTxTimestamp}
        />
      </div>
      <div className="mt-4 border-t-[0.0469rem] py-4">
        <div className="mb-4 text-xl font-semibold">交易列表</div>
        <div className="flex items-center">
          <Empty />
        </div>
      </div>
    </div>
  );
}
