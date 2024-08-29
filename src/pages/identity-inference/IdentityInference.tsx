/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 14:04:37
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
import pattern from "@/styles/pattern";

const columns: any = [
  {
    title: "序号",
    ellipsis: true,
    width: 100
  },
  {
    title: "数据集名称",
    dataIndex: "name",
    ellipsis: true,
    width: 320
  },
  {
    title: "平台",
    dataIndex: "chainType",
    ellipsis: true,
    width: 320
  },
  {
    title: "数量",
    dataIndex: "number",
    ellipsis: true
  }
];
export function IdentityInference() {
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
      className={cn(
        " w-full h-full pt-[0px] 3xl:pt-32 fadeIn",
        `${pattern.flexbet}`
      )}
    >
      {pageState === "search"
        ? <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
            <div
              className={cn(
                `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative`
              )}
            >
              <div
                className={cn(
                  `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/IdentityInferenceDialogTitle.png')] bg-cover bg-center`
                )}
              />
              <div
                className={cn(
                  ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`
                )}
              >
                <div className={cn(` flex flex-col gap-y-6 items-end`)}>
                  <InputCommonV2
                    placeholder="输入待测地址"
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
                content="这是钓鱼诈骗地址"
                className="w-[calc(50%_-_15px)] h-full"
              />
              <ResultComponent
                title="可能的身份"
                content="xxx"
                className="w-[calc(50%_-_15px)] h-full"
              />
            </div>
            <div className={cn(` w-full h-[160px] 3xl:h-[320px]`)}>
              <TableCommonV2 className="" data={dataList} columns={columns} />
            </div>
          </div>}
    </div>
  );
}
