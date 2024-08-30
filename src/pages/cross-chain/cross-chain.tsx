/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-30 14:59:51
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV3 } from "@/components/InputCommonV3";
import { ResultComponent } from "@/components/ResultComponent";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { TableCommonV3 } from "@/components/TableCommonV3";
import { TagComponent } from "@/components/TagComponent";
import { columnsCrossChain1, columnsCrossChain2 } from "@/services/columns";
import pattern from "@/styles/pattern";

const columns3: any = [
  {
    title: "链名",
    dataIndex: "linName",
    ellipsis: true
  }
];

export function CrossChain() {
  const [pageState, setPageState] = useState("search");
  const [value, setValue] = useState<any>(null);
  const [dataList1, setDateList1] = useState<any>([]);
  const [dataList2, setDateList2] = useState<any>([]);
  const [dataList3, setDateList3] = useState<any>([]);

  const startSearch = () => {
    // 开始查询
    setPageState("res");
  };
  useEffect(() => {
    // 请求
    const res1 = [
      {
        username: "测试数据",
        dealID: 1,
        number: 10,
        projectId: 10,
        from: "以太坊",
        to: "以太坊",
        inputMo: 100,
        cost: 100,
        outmoney: 100
      }
    ];
    const res2 = [
      {
        accountName: "测试数据",
        projectId: 10,
        upDeal: "测试数据",
        downdeal: "测试数据",
        depId: 10
      },
      {
        accountName: "测试数据",
        projectId: 10,
        upDeal: "测试数据",
        downdeal: "测试数据",
        depId: 10
      },
      {
        accountName: "测试数据",
        projectId: 10,
        upDeal: "测试数据",
        downdeal: "测试数据",
        depId: 10
      },
      {
        accountName: "测试数据",
        projectId: 10,
        upDeal: "测试数据",
        downdeal: "测试数据",
        depId: 10
      }
    ];
    const res3 = [
      {
        linName: "chain001"
      }
    ];
    setDateList1([...res1, ...res1, ...res1, ...res1]);
    setDateList2(res2);
    setDateList3(res3);
  }, []);

  return (
    <div className={cn(" w-full h-full pt-[0px] fadeIn", `${pattern.flexbet}`)}>
      {pageState === "search"
        ? <div className={cn(`w-full h-full ${pattern.flexCenter} `)}>
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
        : <div className={cn(`w-full h-full flex flex-col `)}>
            <div className="w-[120px] h-[36px]">
              <TagComponent title="跨链交易输出" className="w-[120px] h-[36px]" />
            </div>

            <div className={cn(` w-full h-[272px] mt-4`)}>
              <TableCommonV2
                className=""
                data={dataList1}
                columns={columnsCrossChain1}
              />
            </div>
            <div className="w-[120px] h-[36px] mt-4">
              <TagComponent title="跨链依赖信息" className="w-[120px] h-[36px]" />
            </div>

            <div className={cn(` w-full h-[272px] mt-4`)}>
              <TableCommonV2
                className=""
                data={dataList2}
                columns={columnsCrossChain2}
              />
            </div>
            <div className="w-[120px] h-[36px] mt-4">
              <TagComponent title="交易分布信息" className="w-[120px] h-[36px]" />
            </div>

            <div className={cn(` w-full h-[176px] mt-4`)}>
              <TableCommonV3 className="" data={dataList3} columns={columns3} />
            </div>
          </div>}
    </div>
  );
}
