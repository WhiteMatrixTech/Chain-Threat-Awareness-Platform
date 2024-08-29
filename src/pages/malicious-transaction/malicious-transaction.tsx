/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 21:23:24
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV3 } from "@/components/InputCommonV3";
import { ResultComponent } from "@/components/ResultComponent";
import pattern from "@/styles/pattern";

export function MaliciousTransaction() {
  const [pageState, setPageState] = useState("search");
  const [value, setValue] = useState<any>(null);
  const [dataList, setDateList] = useState<any>([]);

  const startSearch = () => {
    // 开始查询
    setPageState("res");
  };
  useEffect(() => {
    // 请求
    const res = [
      {
        name: "测试数据",
        chainType: "测试数据",
        number: 10
      },
      {
        name: "测试数据",
        chainType: "测试数据",
        number: 10
      },
      {
        name: "测试数据",
        chainType: "测试数据",
        number: 10
      },
      {
        name: "测试数据",
        chainType: "测试数据",
        number: 10
      },
      {
        name: "测试数据",
        chainType: "测试数据",
        number: 10
      }
    ];
    setDateList(res);
  }, []);

  return (
    <div
      className={cn(" w-full h-full pt-[0px]  fadeIn", `${pattern.flexbet}`)}
    >
      {pageState === "search"
        ? <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
            <div className={cn(`w-[662px] h-[322px] relative`)}>
              <div
                className={cn(
                  `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/MaliciousTransactionDialogTitle.png')] bg-cover bg-center`
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
        : <div className={cn(`w-full h-full  gap-y-6 flex flex-col`)}>
            <div className={cn(` flex-1`)} />
            <div className={cn(` w-full h-[50px] ${pattern.flexbet} `)}>
              <ResultComponent
                title="检测结果"
                content="非法交易"
                className="w-full h-full"
              />
            </div>
          </div>}
    </div>
  );
}
