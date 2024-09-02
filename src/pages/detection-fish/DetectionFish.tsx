/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-02 14:06:18
 */
import cn from "classnames";
import { useState } from "react";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommon } from "@/components/InputCommon";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import pattern from "@/styles/pattern";

export function DetectionFish() {
  const typeList = [
    {
      label: "账号地址",
      value: "address"
    }
  ];

  const [selectedType, setSelectedType] = useState<ISelectorItemProps | null>(
    null
  );
  const [resultContent, setResultContent] = useState("暂无数据...");

  const start = () => {
    const params = {
      selectedType
    };
    console.log("params>>>>", params);
  };

  return (
    <div className={cn(" w-full h-full  pt-[0px]", `${pattern.flexbet} `)}>
      <div
        className={`left  w-[calc(50%)] h-full flex justify-center align-top scale-75 3xl:scale-100`}
      >
        <div
          className={cn(
            `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative`
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/fishBg1Title.png')] bg-cover bg-center`
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
                  placeholder="以太坊外部账号的地址"
                  value={selectedType}
                  options={typeList}
                  setValue={(item: ISelectorItemProps) => {
                    setSelectedType(item);
                  }}
                />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                <ButtonCommonV2
                  onClick={() => {
                    start();
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
        className={`right  w-[calc(50%)] h-full flex justify-center align-top scale-75 3xl:scale-100`}
      >
        <div className="3xl:pt-[80px] 3xl:px-[20px] 3xl:pb-[20px] right w-[778px] h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
          <div className="w-full h-full ">
            <span className="text-[#FFFFFF] text-[16px]">
              {resultContent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
