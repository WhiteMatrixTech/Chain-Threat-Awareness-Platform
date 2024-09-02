/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-02 14:51:37
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { GraphinData } from "@antv/graphin";
import cn from "classnames";
import { useEffect, useState } from "react";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import {
  AddressTxGraph,
  TGraphinClickTarget
} from "@/components/GraphV2/AddressTxGraph";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { ResultComponent } from "@/components/ResultComponent";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { columns } from "@/services/columns";
import {
  generateAddressData,
  generateEdgeTxData,
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import pattern from "@/styles/pattern";
import { IGraphFormData } from "@/utils/IdentityTypes";

export function FewidentityInferenceResult() {
  const [pageState, setPageState] = useState("search");
  const [value, setValue] = useState<any>(null);
  const [dataList, setDateList] = useState<any>([]);
  const [selectedHexData, setSelectedHexData] = useState(initQueryAddress);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const [formData, setFormData] = useState<IGraphFormData>({
    date: ["0", "latest"],
    tokenType: "ETH",
    address: initQueryAddress
  });
  const handleClickGraphin = (
    hexString: string,
    _type?: TGraphinClickTarget
  ) => {
    if (hexString) {
      setSelectedHexData(hexString);
    }
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
      <div className={cn(`w-full h-full  gap-y-6 flex flex-col`)}>
        <div className={cn(` flex-1`)}>
          <AddressTxGraph
            focusedId={selectedHexData}
            formData={formData}
            handleClick={handleClickGraphin}
            changeData={setGraphData}
          />
        </div>
        <div className={cn(` w-full h-[50px] ${pattern.flexbet} `)}>
          <ResultComponent
            title="是否与提供的地址身份相同"
            content="是"
            className="w-full h-full"
          />
        </div>
        <div className={cn(` w-full h-[320px]`)}>
          <TableCommonV2 className="" data={dataList} columns={columns} />
        </div>
      </div>
    </div>
  );
}
