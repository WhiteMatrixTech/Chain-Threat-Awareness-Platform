/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-24 00:19:59
 */
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonCyber } from "@/components/ButtonCommonCyber";
import { DateCommon } from "@/components/DateCommon";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { detectionSamplePrivacyColumns } from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService,
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
  const [selectedType, setSelectedType] = useState<ISelectorItemProps | null>(
    typeList[0]
  );
  const [inputRange, setInputRange] = useState<any>("0-500");
  const [result, setResult] = useState({
    content: '',
    time: ''
  });
  


  const [
    { loading },
    detectPrivacy
  ] = useAsyncFn(async (params: detectSelfishminingRequestType) => {
    const data = await detectSelfishminingService(params);
    return data;
  });
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "selfish_mining",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: JSON.parse(item.input).block_range,
        time: item.createAt,
        result: JSON.parse(item.output).result,
      };
    });
    setdetectionSampleList(result);
    console.log("检测数据>>>>", respose);
    console.log("检测数据>>>result>", result);
  };

  const start =   async () => {
    if (!inputRange) {
      notification.warning({ message: `请输入必要信息!!!` });
      return;
    }
    const startBlock = Number(inputRange.split('-')[0])
    const endBlock = Number(inputRange.split('-')[1])
    
    if (endBlock - startBlock > 500) {
      notification.warning({ message: `范围不能超过 500 个区块!!!` });
      return;
    }
    const params = {
      chain: selectedType?.value,
      startBlock: inputRange.split('-')[0],
      endBlock: inputRange.split('-')[1],
      // startDate: selectedRange[0],
      // endDate: selectedRange[1],

    };
    
    const response = await detectPrivacy(params);
    console.log("response>>>", response);
    setResult({
      content: response.result,
      time: (response.cost / 1000).toFixed(1) + "s"
    });
    console.log("params>>>>", params);
    void getActionLogList();

  };

  useEffect(() => {
    void getActionLogList();
  }, []);
  return (
    <div className={cn(`w-full h-full 3xl:pb-30  flex items-center`)}>
      <div className={cn(`${pattern.flexbet} w-full max-h-[783px] h-full `)}>
      <div
        className={`scale-95 3xl:scale-100 left  w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full  flex flex-col items-end justify-between gap-y-7`}
      >
        <div
          className={cn(
            ` w-[662px] h-[384px] bg-[url('./assets/privacyBg1.png')] bg-cover bg-center relative`
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
                    className="w-[450px] h-full"
                />
              </div>
              {/* <div
                  className={cn(`w-full h-[36px]  ${pattern.flexCenter}`)}
                >
                  <DateCommon
                    className="w-[450px] h-full"
                    onSelect={(date: any) => {
                      setSelectedRange(date)
                    }}
                  />
                </div> */}
              <div className={`w-full h-[36px] flex items-center`}>
                <InputCommonV2
                  initVal={inputRange}
                  placeholder="0-500"
                  onInput={(val: any) => {
                    setInputRange(val);
                  }}
                  className="w-[450px] h-[36px] "
                />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                  <ButtonCommonCyber
                    className="w-full"
                  // disable={fishLoading}
                  onClick={() => {
                    void start();
                  }}
                >
                  <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                </ButtonCommonCyber>
                </div>
                {result.time.length !== 0 &&
                  <div className="w-full h-[22px] flex justify-center items-center">
                    <span className="text-[#ffffff] text-[13px]">
                      检索时间：{result.time}
                    </span>
                  </div>}
            </div>
          </div>
        </div>
        <div className={cn(` w-[662px] h-[calc(100%_-_390px)] flex flex-col`)}>
          <div className={cn(`w-full h-[40px] flex items-center justify-start`,
            `border-solid border-[#00A0E9] border-l-[6px]`,
            'bg-[#02004D4D] pl-5'

            )}>
            <span className="text-[20px] text-[#ffffff]">历史检测数据 - 基于二阶二项分布的通用自私挖矿检测模型</span>
            </div>
            <div className="w-full h-[calc(100%_-_50px)] mt-[10px]">
              <TableCommonV4
              className="w-full h-full"
              data={detectionSampleList}
              columns={detectionSamplePrivacyColumns}
            />
            </div>
          

        </div>
      </div>
      <div
        className={` right w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full flex justify-start items-center `}
      >
        <div className=" pt-[60px] px-[20px] pb-[20px] w-[614px] h-[600px] 3xl:w-[778px] 3xl:h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center  overflow-scroll">
          <div className="w-full h-full relative">
            <span className="text-[#FFFFFF] text-[16px]">
              {result.content}
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

    </div>
  );
}
