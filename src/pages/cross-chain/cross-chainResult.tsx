/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-17 16:50:43
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV3 } from "@/components/InputCommonV3";
import { Progress } from "@/components/progres";
import { ResultComponent } from "@/components/ResultComponent";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { TagComponent } from "@/components/TagComponent";
import { columnsCrossChain1, columnsCrossChain2 } from "@/services/columns";
import {
  detectCrossChainRequestType,
  detectCrossChainService
} from "@/services/detection";
import pattern from "@/styles/pattern";

const columns3: any = [
  {
    title: "链名",
    dataIndex: "linName",
    ellipsis: true
  }
];

export function CrossChainResult() {
  const { tx } = useParams();
  const [result, setResult] = useState({
    tx_query_result: [],
    cross_chain_dependency: [],
    chains_need_query: [],
    time: ""
  });

  const [loading, setloading] = useState(true);
  const start = async () => {
    setloading(true);
    try {
      const params: detectCrossChainRequestType = {
        tx: tx || "",
        chain: "eth"
      };
      const respose = await detectCrossChainService(params);
      console.log("respose>>>", respose);
      setResult({
        ...result,
        time: (respose.cost / 1000).toFixed(1) + "s",
        ...respose
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
        {/* <AiOutlineLoading3Quarters
          className="ml-2 animate-spin"
          style={{ color: "white", fontSize: "24px" }}
        /> */}
        <Progress />
      </div>
    : <div className={cn(" w-full h-full fadeIn", `${pattern.flexbet}`)}>
        <div className={cn(`w-full h-full flex flex-col  justify-between`)}>
          <div className="top w-full h-[50px]">
            <ResultComponent
              title="检测时间"
              content={result.time}
              className="w-full h-full"
            />
          </div>
          <div className="content w-full h-[calc(100%_-_66px)] flex flex-col justify-between ">
            <div className="content_one w-full h-[calc(50%_-_8px)]  flex flex-col justify-between">
              <div className="w-[120px] h-[36px]">
                <TagComponent title="跨链交易输出" className="w-[120px] h-[36px]" />
              </div>
              <div className={cn(` w-full h-[calc(100%_-_50px)]`)}>
                <TableCommonV4
                  className="w-full h-full"
                  data={result.tx_query_result}
                  columns={columnsCrossChain1}
                />
              </div>
            </div>
            <div className="content_one w-full h-[calc(50%_-_8px)]  flex flex-col justify-between">
              <div className="w-[120px] h-[36px] ">
                <TagComponent title="跨链依赖信息" className="w-[120px] h-[36px]" />
              </div>
              <div className={cn(` w-full h-[calc(100%_-_50px)]`)}>
                <TableCommonV4
                  className="w-full h-full"
                  data={result.cross_chain_dependency}
                  columns={columnsCrossChain2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>;
}
