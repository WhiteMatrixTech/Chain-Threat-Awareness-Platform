/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 14:36:36
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
export function FewidentityInference() {
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
            <div className={cn(` w-[1068px] h-[484px] relative`)}>
              <div
                className={cn(
                  `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/FewidentityDialogTitle.png')] bg-cover bg-center`
                )}
              />
              <div
                className={cn(
                  `pt-16 px-14 pb-10 absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] `,
                  "bg-[#003F7A4D]",
                  "border-solid border-[1px] border-[#D3EAFF] border-t-0 border-r-0 border-l-0",
                  `${pattern.flexbet}`
                )}
              >
                <div
                  className={cn(`w-[450px] h-full `, "flex flex-col gap-y-4 ")}
                >
                  <span className="text-[#ffffff] text-[18px]">
                    提供5个样本用于推断待测地址是否是该身份
                  </span>
                  <InputCommonV2
                    placeholder="样本地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
                  />
                  <InputCommonV2
                    placeholder="样本地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
                  />
                  <InputCommonV2
                    placeholder="样本地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
                  />
                  <InputCommonV2
                    placeholder="样本地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
                  />
                  <InputCommonV2
                    placeholder="样本地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
                  />
                </div>
                <div
                  className={cn(
                    `w-[1px] h-full border-[#00A0E9] border-[1px] border-solid`
                  )}
                />
                <div
                  className={cn(
                    `w-[450px] h-full flex flex-col gap-y-4 items-end`
                  )}
                >
                  <div
                    className={`w-full h-[24px] flex items-center justify-start`}
                  >
                    <span className="text-[#ffffff] text-[18px]">待测地址</span>
                  </div>
                  <InputCommonV2
                    placeholder="输入待测地址"
                    onInput={(val: any) => {
                      setValue(val);
                    }}
                    className="w-full h-[36px] "
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
                title="是否与提供的地址身份相同"
                content="是"
                className="w-full h-full"
              />
            </div>
            <div className={cn(` w-full h-[160px] 3xl:h-[320px]`)}>
              <TableCommonV2 className="" data={dataList} columns={columns} />
            </div>
          </div>}
    </div>
  );
}