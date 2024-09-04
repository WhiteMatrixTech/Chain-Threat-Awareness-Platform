/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-04 18:36:44
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { GraphinData } from "@antv/graphin";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import {
  AddressTxGraph,
  TGraphinClickTarget
} from "@/components/GraphV2/AddressTxGraph";
import { InputCommonV3 } from "@/components/InputCommonV3";
import { ResultComponent } from "@/components/ResultComponent";
import {
  detectMaliciousRequestType,
  detectMaliciousService
} from "@/services/detection";
import {
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import pattern from "@/styles/pattern";
import { IGraphFormData } from "@/utils/IdentityTypes";

export function MaliciousTransactionResult() {
  const { tx } = useParams();
  const [loading, setloading] = useState(true);
  const [detectResult, setdetectResult] = useState("");

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
  const start = async () => {
    setloading(true);
    try {
      const params: detectMaliciousRequestType = {
        tx: tx || "",
        chain: "btc"
      };
      const respose = await detectMaliciousService(params);
      console.log("respose>>>", respose);
      setdetectResult(respose.result ? respose.result : "");

      setloading(false);
    } catch (error) {
      setloading(false);
    }
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
  };
  useEffect(() => {
    // 请求
    void start();
  }, []);

  return loading
    ? <div
        className={cn(
          "w-full h-full absolute top-0 left-0",
          `${pattern.flexCenter}`
        )}
      >
        <AiOutlineLoading3Quarters
          className="ml-2 animate-spin"
          style={{ color: "white", fontSize: "24px" }}
        />
      </div>
    : <div
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
              title="检测结果"
              content={`${detectResult}`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>;
}
