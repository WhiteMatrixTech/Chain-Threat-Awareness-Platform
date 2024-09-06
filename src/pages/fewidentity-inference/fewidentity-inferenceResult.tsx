/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-06 15:58:36
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { GraphinData } from "@antv/graphin";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";

import {
  AddressTxGraph,
  TGraphinClickTarget
} from "@/components/GraphV2/AddressTxGraph";
import { ResultComponent } from "@/components/ResultComponent";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { columns, columnsIdentity } from "@/services/columns";
import {
  detectFewSamplesRequestType,
  detectFewSamplesService,
  detectFishRequestType,
  detectFishService,
  getTransactionsRequestType,
  getTransactionsService
} from "@/services/detection";
import {
  generateAddressData,
  generateEdgeTxData,
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import pattern from "@/styles/pattern";
import { IGraphFormData } from "@/utils/IdentityTypes";

export function FewidentityInferenceResult() {
  const { address, samples } = useParams();
  const [loading, setloading] = useState(true);
  const [result, setResult] = useState({
    result: "",
    time: "",
    dataList: []
  });

  const [selectedHexData, setSelectedHexData] = useState(initQueryAddress);
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);

  const [formData, setFormData] = useState<IGraphFormData>({
    date: ["0", "latest"],
    tokenType: "ETH",
    address: address || initQueryAddress
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
      const params: detectFewSamplesRequestType = {
        address: address || "",
        samples: samples || "",
        chain: "eth"
      };
      const respose = await detectFewSamplesService(params);
      console.log("respose>>>", respose);

      const paramsTransaction: getTransactionsRequestType = {
        address: address || "",
        limit: 100
      };
      const resposeTransaction = await getTransactionsService(
        paramsTransaction
      );
      console.log("查询交易数据>>>!!!", resposeTransaction);

      const paramsFish: detectFishRequestType = {
        address: address || "",
        chain: "eth"
      };
      const resposeFish = await detectFishService(paramsFish);
      console.log("钓鱼判断数据>>>!!!", resposeFish);

      setResult({
        ...result,
        time: (respose.cost / 1000).toFixed(1) + "s",
        result: resposeFish.status || "无",
        dataList: resposeTransaction.data
      });
      setloading(false);
    } catch (error) {
      setloading(false);
    }
    setloading(false);
  };

  useEffect(() => {
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
              title="是否与提供的地址身份相同"
              content={result.result}
              className="w-[calc(100%_-_190px)] h-full"
            />
          </div>
          <div className={cn(` w-full h-[320px]`)}>
            <TableCommonV2
              className=""
              data={result.dataList}
              columns={columnsIdentity}
            />
          </div>
        </div>
      </div>;
}
