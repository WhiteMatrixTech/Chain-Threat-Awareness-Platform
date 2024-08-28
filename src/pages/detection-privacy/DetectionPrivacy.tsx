/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 10:53:24
 */
import cn from "classnames";
import { useState } from "react";

import { InputCommon } from "@/components/InputCommon";
import { Search } from "@/components/Search";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import pattern from "@/styles/pattern";

export function DetectionPrivacy() {
  const typeList = [
    {
      label: "比特币",
      value: "bitcoin"
    },
    {
      label: "火币",
      value: "hot"
    }
  ];
  const rangeList = [
    {
      label: "0-100",
      value: "0-100"
    },
    {
      label: "100-200",
      value: "100-200"
    }
  ];
  const [selectedType, setSelectedType] = useState<ISelectorItemProps | null>(
    null
  );
  const [selectedRange, setSelectedRange] = useState<ISelectorItemProps | null>(
    null
  );
  const [inputRange, setInputRange] = useState<any>("");
  return (
    <div className={cn(" w-full h-full markBorderR", `${pattern.flexbet} `)}>
      <div
        className={`left markBorderR w-[calc(50%)] h-full ${pattern.flexCenter} `}
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
                <InputCommon
                  placeholder="1000到2000数值"
                  onInput={(val: any) => {
                    setInputRange(val);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`right  w-[calc(50%)] h-full ${pattern.flexCenter}`}>
        <div className="pt-[80px] px-[20px] pb-[20px]  right w-[778px] h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
          <div className="w-full h-full " />
        </div>
      </div>
    </div>
  );
}
