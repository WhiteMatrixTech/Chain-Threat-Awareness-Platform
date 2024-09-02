/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-02 15:18:14
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV3 } from "@/components/InputCommonV3";
import pattern from "@/styles/pattern";

const columns3: any = [
  {
    title: "链名",
    dataIndex: "linName",
    ellipsis: true
  }
];

export function CrossChain() {
  const [value, setValue] = useState<any>(null);
  const navigate = useNavigate();

  const startSearch = () => {
    // 开始查询
    navigate("/threat-evidence/cross-chain/result");
  };

  return (
    <div className={cn(" w-full h-full pt-[0px] fadeIn", `${pattern.flexbet}`)}>
      <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
        <div className={cn(` w-[662px] h-[322px] relative`)}>
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/CrossChainDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`,
              "bg-[#003F7A4D]",
              "border-solid border-[1px] border-[#D3EAFF] border-t-0 border-r-0 border-l-0",
              "pt-[66px] px-[106px] pb-[40px]"
            )}
          >
            <div
              className={cn(
                `w-full h-[162px] flex flex-col gap-y-6 items-end  justify-between`
              )}
            >
              <InputCommonV3
                placeholder="输入交易信息"
                onInput={(val: any) => {
                  setValue(val);
                }}
                className="w-[450px] h-[100px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[#FFFFFF] text-[16px]">查询</span>
              </ButtonCommonV2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
