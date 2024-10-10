/* eslint-disable @typescript-eslint/restrict-plus-operands */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-10 15:37:16
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { GraphinData } from "@antv/graphin";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  AddressTxGraph,
  TGraphinClickTarget
} from "@/components/GraphV2/AddressTxGraph";
import { Progress } from "@/components/progres";
import { ResultComponent } from "@/components/ResultComponent";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { columnsIdentity } from "@/services/columns";
import {
  detectFishRequestType,
  detectFishService,
  detectIdentityRequestType,
  detectIdentityService,
  getTransactionsRequestType,
  getTransactionsService
} from "@/services/detection";
import {
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import pattern from "@/styles/pattern";
import { IGraphFormData } from "@/utils/IdentityTypes";

export function IdentityInferenceResult() {
  const { address } = useParams();
  const [result, setResult] = useState({
    time: "",
    detectionResult: "",
    identity: "",
    dataList: []
  });
  const [selectedHexData, setSelectedHexData] = useState(
    address || initQueryAddress
  );
  const [graphData, setGraphData] = useState<GraphinData>(initGraphData);
  const [loading, setloading] = useState(true);

  const [formData, setFormData] = useState<IGraphFormData>({
    date: ["0", "latest"],
    tokenType: "ETH",
    address: address || initQueryAddress
  });

  const handleClickGraphin = (
    hexString: string,
    _type?: TGraphinClickTarget
  ) => {
    console.log("hexString>>>", hexString);
    if (hexString) {
      setSelectedHexData(hexString);
    }
  };
  const start = async () => {
    setloading(true);
    try {
      const paramsFish: detectFishRequestType = {
        address: address || "",
        chain: "eth"
      };
      const resposeFish = await detectFishService(paramsFish);
      console.log("钓鱼判断数据>>>!!!", resposeFish);
      let respose = null;
      if (resposeFish.status === "非钓鱼诈骗地址") {
        const params: detectIdentityRequestType = {
          address: address || "",
          chain: "eth"
        };
        console.log("params>>>", params);
        respose = await detectIdentityService(params);
        console.log("respose>>>", respose);
      }

      const paramsTransaction: getTransactionsRequestType = {
        address: address || "",
        limit: 100
      };
      console.log("paramsTransaction>>>", paramsTransaction);
      const resposeTransaction = await getTransactionsService(
        paramsTransaction
      );

      console.log("resposeTransaction>>>!!!", resposeTransaction);

      setResult({
        ...result,
        identity: respose ? respose.identity : resposeFish.status,
        time: (resposeFish.cost / 1000).toFixed(1) + "s",
        detectionResult: resposeFish.status || "无",
        dataList: resposeTransaction.data
      });

      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    // setSelectedHexData(address || initQueryAddress);
    void start();
  }, []);

  return loading
    ? <div
        className={cn(
          "w-full h-full absolute top-0 left-0",
          `${pattern.flexCenter}`
        )}
      >
        <Progress />
        {/* <AiOutlineLoading3Quarters
          className="ml-2 animate-spin"
          style={{ color: "white", fontSize: "24px" }}
        /> */}
      </div>
    : <div
        className={cn(
          " w-full h-full pt-[0px] fadeIn  flex flex-col relative justify-between"
        )}
      >
        <div
          className={cn(
            `w-full h-[calc(100%_-_300px)] 3xl:h-[calc(100%_-_400px)]`
          )}
        >
          <AddressTxGraph
            focusedId={selectedHexData}
            formData={formData}
            handleClick={handleClickGraphin}
            changeData={setGraphData}
            dataList={result.dataList}
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
            content={result.detectionResult}
            className="w-[calc(50%_-_100px)] h-full"
          />
          <ResultComponent
            title="可能的身份"
            content={result.identity}
            className="w-[calc(50%_-_100px)] h-full"
          />
        </div>
        <div className={cn(`w-full h-[220px] 3xl:h-[320px]`)}>
          <TableCommonV4
            className="w-full h-full"
            data={
              selectedHexData !== address
                ? result.dataList.filter(
                    (item: any) => item.dst === selectedHexData
                  )
                : result.dataList
            }
            columns={columnsIdentity}
          />
        </div>
      </div>;
}
