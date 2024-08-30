/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  AddressDetailData,
  IAddressAnalysisDetail
} from "@/services/mockData/addressAnalysis";
import {
  getBaseInfo,
  // getInAddressTransaction,
  // getOutAddressTransaction,
  IBaseInfoResponse
} from "@/services/transaction";
import { Empty, Spin, Tag, Tooltip } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { QuestionCircleFilled } from "@ant-design/icons";
import { Gauge, GaugeConfig } from "@ant-design/plots";
import { CopyClipboard } from "@/components/Clipboard";
import { DescriptionItem } from "@/components/DescriptionCard";
import { transformAddress } from "@/utils/common";
import { registerPlotsShape } from "@/utils/drawAntvGragh";

// import { IGraphFormData } from '../AddressAnalysis';

// interface IaddressDataDetail extends IBaseInfoResponse{
//   addressHealth: number;
//   healthTags: HealthTag[];
// }

interface IAddressDetailPros {
  unit: string;
  addressData: IAddressAnalysisDetail | undefined;
  // formData: IGraphFormData;
}

const colors = ["magenta", "red", "purple", "volcano", "orange"];

// const AddressDetailField: { [key: string]: string } = {
//   firstTxTimestamp: '首次交易时间',
//   txNumber: '交易次数',
//   maxTxAmount: '最大一笔交易金额',
//   allReceivedAmount: '累计接收金额',
//   allSendedAmount: '累计发送金额'
// };

export function AddressDetail(props: IAddressDetailPros) {
  const { unit, addressData = AddressDetailData } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<IBaseInfoResponse>({
    address: "",
    balance: "",
    firstTransactionTimestamp: "",
    inUserCount: "",
    outUserCount: "",
    transactionCount: "",
    transactionInAmountSum: "",
    transactionMaxAmount: "",
    transactionOutAmountSum: ""
  });

  useEffect(
    () => {
      if (addressData.address) {
        void getBaseInfo(addressData.address)
          .then(data => {
            setIsLoading(true);
            setInfo(data);
          })
          .catch(e => console.log("e", e))
          .finally(() => setIsLoading(false));
      }
    },
    [addressData.address, setInfo]
  );
  if (!addressData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className={cn(" flex flex-col  relative justify-between h-full  gap-y-3")}>
      <div className="relative  w-full rounded-[10px] bg-white p-6 flex-1">
        <div className="text-xl font-semibold">地址详情</div>
        <div className="flex my-6 items-center rounded-lg bg-[#f7f9fc] px-3 py-2">
          <div>
            <svg className="iconfont !h-11 !w-11" aria-hidden="true">
              <use xlinkHref={`#icon-${unit}`}></use>
            </svg>
          </div>
          <div className="flex flex-col ml-2 flex-1 gap-y-1">
            <div className="flex w-full items-center">
              <span className="mr-2 text-lg text-[#166CDD]">
                <Tooltip title={addressData.address}>
                  {transformAddress(addressData.address)}
                </Tooltip>
              </span>
              <CopyClipboard text={addressData.address} tip="复制地址" />
            </div>
            <div className="flex items-center">
              <div className="flex mr-2 items-center justify-center rounded-sm bg-gray-100 p-1 text-sm">
                <QuestionCircleFilled />
                <span className="ml-1 bg-[#ebebeb]">Vitalik Buterin</span>
              </div>
              <Tag color="green" className="px-1 !text-sm">
                Using
              </Tag>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 overflow-y-auto">
          <DescriptionItem
            label="转出/转入对手数量"
            content={`${info?.outUserCount}/${info?.inUserCount}`}
          />
          <DescriptionItem
            label={`当前余额(${unit})`}
            content={Number(info.balance) / 1e18}
          />
          <DescriptionItem
            label={`首次交易时间`}
            content={dayjs(
              Number(info.firstTransactionTimestamp) * 1000
            ).format('YYYY-MM-DD HH:mm:ss')}
          />
          <DescriptionItem label={`交易次数`} content={info.transactionCount} />
          <DescriptionItem
            label={`最大一笔交易金额(${unit})`}
            content={`${Number(info.transactionMaxAmount) / 1e18}`}
          />
          <DescriptionItem
            label={`累计接受金额(${unit})`}
            content={`${Number(info.transactionInAmountSum) / 1e18}`}
          />
          <DescriptionItem
            label={`累计发送金额(${unit})`}
            content={`${Number(info.transactionOutAmountSum) / 1e18}`}
          />
        </div>
      </div>
      <div className=" rounded-[10px] bg-white py-4 px-6 h-[252px]">
        <div className="mb-4 text-xl font-semibold">地址健康度</div>
        <div className="flex">
          <div className="flex-1 p-4">
            <HealthGauge percent={addressData.addressHealth} />
          </div>
          <div className="flex flex-col justify-center gap-y-3">
            {addressData.healthTags.map((text, index) =>
              <Tag
                key={text}
                color={colors[index]}
                className="!m-0 !rounded-2xl !border-none !px-3 !py-1 text-center !text-sm"
              >
                {text}
              </Tag>
            )}
          </div>
        </div>
      </div>
      <div className="flex absolute top-0 left-0 h-full w-full justify-center items-center">
        <Spin spinning={isLoading} />
      </div>
    </div>
  );
}

function HealthGauge({ percent = 0 }: { percent: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  registerPlotsShape();

  const config = useMemo(
    () => {
      const ticks = [1, 1 / 3, 2 / 3, 1];
      const colors = ["#FF7878", "#FFD687", "#24BF59"];

      const color =
        percent < ticks[1]
          ? colors[0]
          : percent < ticks[2] ? colors[1] : colors[2];

      return {
        percent: percent,
        height: 147,
        range: {
          ticks: [0, 1],
          color: ["l(0) 0:#FF7878 0.6:#FFD687 1:#24BF59"]
        },
        indicator: {
          shape: "triangle-gauge-indicator",
          pointer: {
            style: {
              fill: color
            }
          }
        },
        statistic: {
          title: {
            offsetY: -18,
            formatter: ({ percent }: { percent: number }) => {
              return `${percent * 10}`;
            },
            style: ({ percent }: { percent: number }) => {
              return {
                fontSize: "28px",
                lineHeight: 2.5,
                color:
                  percent < ticks[1]
                    ? colors[0]
                    : percent < ticks[2] ? colors[1] : colors[2]
              };
            }
          },
          content: {
            offsetY: 18,
            formatter: ({ percent }: { percent: number }) => {
              if (percent < ticks[1]) {
                return "高风险";
              }

              if (percent < ticks[2]) {
                return "中风险";
              }

              return "低风险";
            },
            style: ({ percent }: { percent: number }) => {
              return {
                fontSize: "14px",
                color:
                  percent < ticks[1]
                    ? colors[0]
                    : percent < ticks[2] ? colors[1] : colors[2]
              };
            }
          }
        }
      } as GaugeConfig;
    },
    [percent]
  );

  return <Gauge {...config} />;
}
