/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-04 18:21:20
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import pattern from "@/styles/pattern";

export function BitcoinmixedcoinDetection() {
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState<any>("");

  const startSearch = () => {
    // 开始查询
    if (!inputVal) {
      notification.warning({ message: `请输入信息！` });
      return;
    }
    navigate(`/threat-evidence/bitcoinmixedcoin-detection/result/${inputVal}`);
  };

  return (
    <div className={cn(" w-full h-full pt-[0px] fadeIn", `${pattern.flexbet}`)}>
      <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
        <div
          className={cn(
            `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative`
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/BitcoinmixedcoinDetectionDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`
            )}
          >
            <div className={cn(` flex flex-col gap-y-6 items-end`)}>
              <InputCommonV2
                placeholder="输入64位交易ID"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="w-[450px] h-[36px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[#FFFFFF] text-[16px]">检测</span>
              </ButtonCommonV2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
