/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// import { QuestionCircleFilled } from '@ant-design/icons';
// @ts-ignore
import { IUserEdge } from '@antv/graphin';
import { Empty, Table, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { DescriptionItem } from '@/components/DescriptionCard';
import { IEdgeData, ITxDetail } from '@/services/mockData/addressAnalysis';
import { transformAddress } from '@/utils/common';

interface ITxDetailPros {
  txData: ITxDetail | undefined;
  unit: string;
  edge: IUserEdge[];
}

interface IEdge extends IUserEdge {
  data: IEdgeData;
}

export function TxDetail(props: ITxDetailPros) {
  const { unit, txData, edge } = props;
  const [transactionData, setTransactionData] = useState<IEdge>();
  const [tableData, setTableData] = useState<any[]>([]);

  const columns = [
    {
      title: '时间/hash',
      key: 'hash',
      dataIndex: 'hash',
      render(_: any, row: any) {
        return (
          <div className="flex flex-col">
            <span>
              {dayjs(row.blockTimestamp).format('YYYY/MM/DD HH:mm:ss')}
            </span>
            <Typography.Paragraph copyable={true} style={{ color: '#2F60D7' }}>
              {transformAddress(row.hash, 4)}
            </Typography.Paragraph>
          </div>
        );
      }
    },
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
      render(text: any) {
        return <span>{text / 1e18} ETH</span>;
      }
    }
  ];

  useEffect(() => {
    if (txData) {
      const data = edge.filter(
        (item) => item.source === txData.from && item.target === txData.to
      );
      setTransactionData(data[0] as IEdge);
      setTableData(txData.transactionInfos || []);
    }
  }, [edge, txData]);
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
          label={`交易金额(${unit})`}
          content={txData.txAmount}
        />
        <DescriptionItem
          label="首次交易时间"
          content={transactionData?.data.firstTransactionTimestamp}
        />
        <DescriptionItem
          label="最近交易时间"
          content={transactionData?.data.lastTransactionTimestamp}
        />
      </div>
      <div className="mt-4 border-t-[0.0469rem] py-4">
        <div className="mb-4 text-xl font-semibold">交易列表</div>
        <div className="w-full items-center justify-center">
          <Table columns={columns} dataSource={tableData} size="small" />
        </div>
      </div>
    </div>
  );
}
