/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-09 15:01:56
 */
import { notification } from "antd";
import cn from "classnames";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { DateCommon } from "@/components/DateCommon";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { detectionSamplePrivacyColumns } from "@/services/columns";
import {
  detectSelfishminingRequestType,
  detectSelfishminingService
} from "@/services/detection";
import pattern from "@/styles/pattern";

export function DetectionPrivacy() {
const [detectionSampleList, setdetectionSampleList] = useState([]) as any;

  const typeList = [
    {
      label: "比特币（BTC）",
      value: 1
    },
    {
      label: "比特币现金（BCH）",
      value: 2
    },
    {
      label: "以太坊（ETH）",
      value: 3
    },
    {
      label: "莱特币（LTC）",
      value: 4
    },
    {
      label: "币安智能链（BSC）",
      value: 5
    }
  ];
  const rangeList: any = [];
  const [selectedType, setSelectedType] = useState<ISelectorItemProps | null>(
    null
  );
  const [selectedRange, setSelectedRange] = useState<any>('');
  const [inputRange, setInputRange] = useState<any>("");
  const [resultContent, setResultContent] = useState("");


  const [
    { loading },
    detectPrivacy
  ] = useAsyncFn(async (params: detectSelfishminingRequestType) => {
    const data = await detectSelfishminingService(params);
    return data;
  });
  const start =  () => {
    if (!inputRange) {
      notification.warning({ message: `请输入必要信息!!!` });
      return;
    }
    const params = {
      chain: selectedType?.value,
      startBlock: inputRange.split('-')[0],
      endBlock: inputRange.split('-')[1],
      date_range: selectedRange,

    };
    // const response = await detectPrivacy(params);
    // console.log("response>>>", response);
    setResultContent("测试数据!!!");
    console.log("params>>>>", params);
  };

  return (
    <div className={cn("w-full h-full pt-[0px]", `${pattern.flexbet} pb-[110px]`)}>
      <div
        className={` left  w-[calc(50%)] h-full flex flex-col items-center justify-between gap-y-7`}
      >
        <div
          className={cn(
            ` w-[662px] h-[362px] bg-[url('./assets/privacyBg1.png')] bg-cover bg-center relative`
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/privacyBg1Title.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              `absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)]  pt-[66px] px-[106px] pb-[40px]`
            )}
          >
            <div className="w-full h-full  flex flex-col gap-y-[16px]">
              <div className={`w-full h-[36px] flex items-center`}>
                <SelectorCommonV2
                  placeholder="币种"
                  value={selectedType}
                  options={typeList}
                  setValue={(item: ISelectorItemProps) => {
                    setSelectedType(item);
                  }}
                />
              </div>
              <div
                  className={cn(`w-full h-[36px]  ${pattern.flexCenter}`)}
                >
                  <DateCommon
                    className="w-full h-full"
                    onSelect={(date: any) => {
                      setSelectedRange(date)
                    }}
                  />
                </div>
              <div className={`w-full h-[36px] flex items-center`}>
                <InputCommonV2
                  placeholder="1000-2000"
                  onInput={(val: any) => {
                    setInputRange(val);
                  }}
                  className="w-[450px] h-[36px] "
                />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                <ButtonCommonV2
                  // disable={fishLoading}
                  onClick={() => {
                    void start();
                  }}
                >
                  <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                </ButtonCommonV2>
              </div>
            </div>
          </div>
        </div>
        <div className={cn(` w-[662px] flex-1 flex flex-col gap-y-2`)}>
          <div className={cn(`w-full h-[40px] flex items-center justify-start`,
            `border-solid border-[#00A0E9] border-l-[6px]`,
            'bg-[#02004D4D] pl-5'

          )}>
            <span className="text-[20px] text-[#ffffff]">历史检测数据 - 基于二阶二项分布的通用自私挖矿检测模型</span>
          </div>
          
          <TableCommonV4
            className="w-full flex-1"
            data={detectionSampleList}
            columns={detectionSamplePrivacyColumns}
          />
        </div>
      </div>
      <div
        className={` right  w-[calc(50%)] h-full flex justify-center items-center `}
      >
        <div className=" pt-[80px] px-[20px] pb-[20px] right w-[778px] h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
          <div className="w-full h-full relative">
            <span className="text-[#FFFFFF] text-[16px]">
              {resultContent}
            </span>
            {loading &&
              <div
                className={cn(
                  "w-full h-full absolute top-0 left-0",
                  `${pattern.flexCenter}`
                )}
              >
                <AiOutlineLoading3Quarters
                  className="ml-2 animate-spin"
                  style={{ color: "white", fontSize: "24px" }}
                />
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
