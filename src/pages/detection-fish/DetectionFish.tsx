/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-09 10:49:14
 */
import { notification } from "antd";
import cn from "classnames";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonV2 } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  detectPhishingRequestType,
  detectPhishingService
} from "@/services/detection";
import pattern from "@/styles/pattern";

export function DetectionFish() {
  const [inputVal, setInputVal] = useState("");

  const [resultContent, setResultContent] = useState("");

  const [
    { loading },
    detectFish
  ] = useAsyncFn(async (params: detectPhishingRequestType) => {
    const data = await detectPhishingService(params);
    return data;
  });
  const start = async () => {
    if (!inputVal) {
      notification.warning({ message: `请输入地址！` });
      return;
    }
    try {
      const params: detectPhishingRequestType = {
        address: inputVal
      };
      const respose = await detectFish(params);
      console.log("respose>>>", respose);
      const content = JSON.stringify(respose);
      setResultContent(content);
    } catch (error) {}
  };

  return (
    <div className={cn(" w-full h-full  pt-[0px]", `${pattern.flexbet} `)}>
      <div
        className={`left  w-[calc(50%)] h-full flex justify-center align-top`}
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
                <InputCommonV2
                  placeholder="以太坊外部账号的地址"
                  onInput={(val: any) => {
                    setInputVal(val);
                  }}
                  className="w-[450px] h-[36px] "
                />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                <ButtonCommonV2
                  className=""
                  loading={loading}
                  disable={loading}
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
        className={` right w-[calc(50%)] h-full flex justify-center align-top`}
      >
        <div className="pt-[80px] px-[20px] pb-[20px] right w-[778px] h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
          <div className="w-full h-full relative overflow-scroll">
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
