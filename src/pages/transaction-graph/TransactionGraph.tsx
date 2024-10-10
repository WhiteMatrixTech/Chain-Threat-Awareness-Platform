/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { DatePicker, Form, Input, notification, Select, Spin } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { PrimaryButton } from "@/components/Button";
import { DateCommon } from "@/components/DateCommon";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { SelectorCommonV3 } from "@/components/SelectorCommonV3";
import {
  randomAddressData,
  randomTxDetailData
} from "@/services/mockData/transactionGraph";
import { getBaseInfo, getTransactionBaseInfo } from "@/services/transaction";
import pattern from "@/styles/pattern";
import { randomNum, waitTime } from "@/utils/common";

import {
  AddressDetailCard,
  TransactionDetailCard
} from "./Components/DetailCard";
import { TransactionTraceGraph } from "./Components/TransactionTraceGraph";
import styles from "./TransactionGraph.module.less";

const Option = Select.Option;
const { RangePicker } = DatePicker;
const typeList = [
  {
    label: "ETH",
    value: "ETH"
  }
];
interface IGraphFormData {
  date: undefined;
  tokenType: string;
  transactionHash: string;
}
const initHex =
  "0x3c2eacee8cb9ea750ae4cc51f41c40e73b5099b8ed5df0fd2dd9cb72d58dbb62";
export function TransactionGraph() {
  const [data, setData] = useState(null) as any;
  const [addressDetailData, setaddressDetailData] = useState(null) as any;
  const [loading, setloading] = useState(false);
  const [detailInfo, setDetailInfo] = useState(null) as any;
  const [formData, setFormData] = useState<IGraphFormData>({
    date: undefined,
    tokenType: "ETH",
    transactionHash: initHex
  });
  const [selectedHexData, setSelectedHexData] = useState("") as any;
  const isTx = useMemo(() => selectedHexData.length > 42, [
    selectedHexData.length
  ]);
  const getData = async () => {
    console.log("请求参数>>>", formData);
    const response = await getTransactionBaseInfo(formData.transactionHash);
    setData(response);
    console.log("response>>>>", response);
    if (!selectedHexData) {
      setSelectedHexData(formData.transactionHash);
    }
  };
  const getAddressInfo = async (address: string) => {
    if (!address) return;
    const response = await getBaseInfo(address);
    console.log("response>>>>", response);
    setDetailInfo(response);
  };
  useEffect(() => {
    void getData();
  }, []);
  useEffect(
    () => {
      if (!selectedHexData || !data.fromTransactions || !data.toTransactions)
        return;

      const initNodeInfo = {
        ...data
      };
      const allData = [
        ...data.fromTransactions,
        ...data.toTransactions,
        initNodeInfo
      ];
      const target = allData.filter(item => item.hash === selectedHexData)[0];
      if (selectedHexData.length > 42) {
        setDetailInfo({
          ...target,
          from: target.fromAddress || target.from,
          to: target.toAddress || target.to
        });
      } else {
        getAddressInfo(selectedHexData);
      }
    },
    [selectedHexData]
  );

  const onClickAnalysis = () => {
    if (!formData.tokenType || !formData.transactionHash) {
      notification.warning({ message: `请输入信息！` });
      return;
    }
    getData();
  };

  return (
    <div
      className={cn(
        styles.TransactionGraph,
        "overflow-y-auto  w-full h-full fadeIn"
      )}
    >
      <div className="flex gap-x-10 w-full h-full ">
        <div className="w-80 rounded bg-white shadow-card">
          <Spin spinning={loading}>
            {isTx
              ? <TransactionDetailCard
                  unit={formData.tokenType}
                  transactionData={detailInfo}
                />
              : <AddressDetailCard
                  unit={formData.tokenType}
                  addressData={detailInfo}
                />}
          </Spin>
        </div>
        <div className="flex-1 flex flex-col gap-y-[10px]">
          <div className={`${pattern.flexbet}  w-full h-[36px]`}>
            <div className={cn(`h-full flex items-center gap-x-[10px] `)}>
              <div className="text-[#ffffff] text-[16px] font-[500]">交易图谱</div>
              <div className="flex flex-1 gap-x-[10px] 3xl:gap-x-[20px]">
                <InputCommonV2
                  initVal="ETH"
                  onInput={(val: any) => {
                    setFormData({
                      ...formData,
                      tokenType: val
                    });
                  }}
                  className="w-[140px] h-[36px] "
                  placeholder={""}
                />

                <InputCommonV2
                  initVal={formData.transactionHash}
                  placeholder="地址"
                  onInput={(val: any) => {
                    setFormData({
                      ...formData,
                      transactionHash: val
                    });
                  }}
                  className="w-[480px] 3xl:w-[688px] h-[36px] "
                />
                {/* <div
                  className={cn(`w-[450px] h-[36px]  ${pattern.flexCenter}`)}
                >
                  <DateCommon
                    className="w-[450px] h-full"
                    onSelect={(date: any) => {
                      setFormData({
                        ...formData,
                        date: date
                      });
                    }}
                  />
                </div> */}
              </div>
            </div>

            <div
              onClick={onClickAnalysis}
              className={cn(
                "w-[113px] h-full hover:cursor-pointer",
                `bg-[url('./assets/analyses_start.png')] bg-cover bg-center`
              )}
            />
          </div>
          <div className="flex-1 overflow-hidden rounded bg-white shadow-card">
            <TransactionTraceGraph
              transactionData={data}
              tokenUnit={formData.tokenType}
              handleClick={(data: any) => {
                setloading(true);
                setTimeout(() => {
                  setloading(false);
                  setSelectedHexData(data);
                }, 1000);
              }}
              queryHash={formData.transactionHash}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
