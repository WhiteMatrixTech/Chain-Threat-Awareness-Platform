/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-06 16:42:26
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
  const [result, setResult] = useState({
    result: "",
    transaction_id: "",
    time: ""
  });

  const [selectedHexData, setSelectedHexData] = useState(initQueryAddress);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const [formData, setFormData] = useState<IGraphFormData>({
    date: ["0", "latest"],
    tokenType: "ETH",
    address: tx || initQueryAddress
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
      setResult({
        ...result,
        result: respose.result,
        transaction_id: respose.transaction_id,
        time: (respose.cost / 1000).toFixed(1) + "s"
      });

      setloading(false);
    } catch (error) {
      setloading(false);
    }
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
              title="检测时间"
              content={result.time}
              className="w-[173px] h-full"
            />
            <ResultComponent
              title="检测结果"
              content={`${result.result}`}
              className="w-[calc(100%_-_190px)] h-full"
            />
          </div>
        </div>
      </div>;
}
