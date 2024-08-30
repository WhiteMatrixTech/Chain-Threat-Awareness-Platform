/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 20:19:37
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { ResultComponent } from "@/components/ResultComponent";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { TagComponent } from "@/components/TagComponent";
import pattern from "@/styles/pattern";

export function BitcoinmixedcoinDetection() {
  const [pageState, setPageState] = useState("search");
  const [value, setValue] = useState<any>(null);
  const [dataList, setDateList] = useState<any>([]);
  const [dealInfo, setDealInfo] = useState({
    hashId: "buefh9u3hr9h3r08g408h45g8524hg942h505h92vuhg139r",
    message: "该交易于 14 Mar 2020 07:08:57 AM GMT+8 在比特币网络上首次广播",
    items: [
      {
        title: "输入金额：",
        value: "6.739832749237 BTC"
      },
      {
        title: "输入金额：",
        value: "6.739832749237 BTC"
      },
      {
        title: "输入数量：",
        value: 33
      },
      {
        title: "输出数量：",
        value: 58
      },
      {
        title: "手续费：",
        value: "0.00329847923 BTC"
      },
      {
        title: "交易大小：",
        value: "6,387 Bytes"
      },
      {
        title: "交易费率：",
        value: "86.837 sat/vByte"
      },
      {
        title: "交易时间：",
        value: "14 Mar 2020 07:08:57"
      }
    ]
  });

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
    <div className={cn(" w-full h-full pt-[0px] fadeIn", `${pattern.flexbet}`)}>
      {pageState === "search"
        ? <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
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
                      setValue(val);
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
        : <div className={cn(`w-full h-full`)}>
            <ResultComponent
              title="检测结果"
              content="该交易是混币交易"
              className="w-full h-[50px]"
            />
            <div className="w-[120px] h-[36px] mt-7">
              <TagComponent title="交易分布信息" className="w-[120px] h-[36px]" />
            </div>
            <div
              className={cn(
                `w-full h-[272px] px-5 py-5 mt-4`,
                "bg-[#02004D4D]",
                `border-[2px] border-solid border-[#0D53B7]`,
                "flex flex-col gap-y-5"
              )}
            >
              <div
                className={`h-[20px] w-full flex items-center justify-start gap-x-6`}
              >
                <span className="text-[#ffffff] text-[15px]">Hash ID :</span>
                <span className="text-[#ffffff] text-[20px]">
                  {dealInfo.hashId}
                </span>
              </div>
              <div className={cn(`w-full flex-1 ${pattern.flexbet}`)}>
                <div className={cn(`w-[calc(50%_-_60px)] h-full `)}>
                  {dealInfo &&
                    dealInfo.items &&
                    dealInfo.items.slice(0, 4).map((item, index) =>
                      <div
                        key={index}
                        className={cn(
                          `w-full h-[48px] ${pattern.flexbet}`,
                          `border-[#0083CF] border-b-[1px] border-solid `
                        )}
                      >
                        <span className="text-[#ffffff] text-[15px]">
                          {item.title}
                        </span>
                        <span className="text-[#ffffff] text-[20px]">
                          {item.value}
                        </span>
                      </div>
                    )}
                </div>
                <div
                  className={cn(
                    `w-[1px] h-full`,
                    `border-[#00A0E9] border-[1px] border-solid`
                  )}
                />
                <div className={cn(`w-[calc(50%_-_60px)] h-full `)}>
                  {dealInfo &&
                    dealInfo.items &&
                    dealInfo.items.slice(4).map((item, index) =>
                      <div
                        key={index}
                        className={cn(
                          `w-full h-[48px] ${pattern.flexbet}`,
                          `border-[#0083CF] border-b-[1px] border-solid `
                        )}
                      >
                        <span className="text-[#ffffff] text-[15px]">
                          {item.title}
                        </span>
                        <span className="text-[#ffffff] text-[20px]">
                          {item.value}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="w-[120px] h-[36px] mt-10">
              <TagComponent title="交易总结" className="w-[120px] h-[36px]" />
            </div>
            <div
              className={cn(
                `w-full h-[224px] px-5 py-5 mt-4`,
                "bg-[#02004D4D]",
                `border-[2px] border-solid border-[#0D53B7]`,
                "flex flex-col gap-y-5 text-[#ffffff]"
              )}
            >
              <div
                className={`h-[20px] w-full flex items-center justify-start gap-x-6 `}
              >
                <span className="text-[15px]">Hash ID :</span>
                <span className="text-[20px]">
                  {dealInfo.hashId}
                </span>
              </div>
              <div className="content text-[15px]">
                {dealInfo.message}
              </div>
            </div>
          </div>}
    </div>
  );
}
