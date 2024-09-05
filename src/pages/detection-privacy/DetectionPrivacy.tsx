/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 11:15:47
 */
import { notification } from "antd";
import cn from "classnames";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import {
  detectPrivacyRequestType,
  detectPrivacyService
} from "@/services/detection";
import pattern from "@/styles/pattern";

export function DetectionPrivacy() {
  const typeList = [
    {
      label: "比特币（BTC）",
      value: "BTC"
    },
    {
      label: "比特币现金（BCH）",
      value: "BCH"
    },
    {
      label: "以太坊（ETH）",
      value: "ETH"
    },
    {
      label: "莱特币（LTC）",
      value: "LTC"
    },
    {
      label: "币安智能链（BSC）",
      value: "BSC"
    }
  ];
  const rangeList: any = [];
  const [selectedType, setSelectedType] = useState<ISelectorItemProps | null>(
    null
  );
  const [selectedRange, setSelectedRange] = useState<ISelectorItemProps | null>(
    null
  );
  const [inputRange, setInputRange] = useState<any>("");
  const [resultContent, setResultContent] = useState("");

  const [
    { loading },
    detectPrivacy
  ] = useAsyncFn(async (params: detectPrivacyRequestType) => {
    const data = await detectPrivacyService(params);
    return data;
  });
  const start = async () => {
    if (!inputRange) {
      notification.warning({ message: `请输入必要信息!!!` });
      return;
    }
    const params = {
      address: "0x2510ae5decc547ae63364eb844e47fb663e1178c",
      chain: "btc"
      // chain_choice: selectedType,
      // date_range: selectedRange,
      // block_range: inputRange
    };
    const response = await detectPrivacy(params);
    setResultContent("测试数据!!!");
    console.log("response>>>>", response);
  };

  return (
    <div className={cn(" w-full h-full  pt-[0px]", `${pattern.flexbet} `)}>
      <div
        className={`left  w-[calc(50%)] h-full flex justify-center align-top scale-75 3xl:scale-100`}
      >
        <div
          className={cn(
            `w-[662px] h-[362px] bg-[url('./assets/privacyBg1.png')] bg-cover bg-center relative`
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
              <div className={`w-full h-[36px] flex items-center`}>
                <SelectorCommonV2
                  placeholder="区块号范围"
                  value={selectedRange}
                  options={rangeList}
                  setValue={(item: ISelectorItemProps) => {
                    setSelectedRange(item);
                  }}
                />
              </div>
              <div className={`w-full h-[36px] flex items-center`}>
                <InputCommonV2
                  placeholder="1000到2000数值"
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
      </div>
      <div
        className={` right  w-[calc(50%)] h-full flex justify-center align-top `}
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
