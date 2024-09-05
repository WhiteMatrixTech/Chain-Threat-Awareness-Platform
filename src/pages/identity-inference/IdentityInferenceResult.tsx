/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 10:27:29
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { GraphinData } from "@antv/graphin";
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";

import IdentityInferenceDialogTitle from "@/assets/IdentityInferenceDialogTitle.png";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import {
  AddressTxGraph,
  TGraphinClickTarget
} from "@/components/GraphV2/AddressTxGraph";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { ResultComponent } from "@/components/ResultComponent";
import { SpinCommon } from "@/components/SpinCommon";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { columns } from "@/services/columns";
import {
  detectIdentityRequestType,
  detectIdentityService
} from "@/services/detection";
import {
  generateAddressData,
  generateEdgeTxData,
  initGraphData,
  initQueryAddress
} from "@/services/mockData/addressAnalysis";
import pattern from "@/styles/pattern";
import { IGraphFormData } from "@/utils/IdentityTypes";

export function IdentityInferenceResult() {
  const { address } = useParams();
  const [result, setResult] = useState({
    detectionResult: "",
    identity: "",
    dataList: [
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
    ]
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
    if (hexString) {
      setSelectedHexData(hexString);
    }
  };
  const start = async () => {
    setloading(true);
    try {
      const params: detectIdentityRequestType = {
        address: address || "",
        chain: "eth"
      };
      const respose = await detectIdentityService(params);
      console.log("respose>>>", respose);
      setResult({
        ...result,
        identity: respose.identity
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
        <AiOutlineLoading3Quarters
          className="ml-2 animate-spin"
          style={{ color: "white", fontSize: "24px" }}
        />
      </div>
    : <div
        className={cn(
          " w-full h-full pt-[0px] fadeIn gap-y-6 flex flex-col  relative"
        )}
      >
        <div className={cn(`flex-1`)}>
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
            content={result.detectionResult}
            className="w-[calc(50%_-_15px)] h-full"
          />
          <ResultComponent
            title="可能的身份"
            content={result.identity}
            className="w-[calc(50%_-_15px)] h-full"
          />
        </div>
        <div className={cn(` w-full h-[320px]`)}>
          <TableCommonV2
            className=""
            data={result.dataList}
            columns={columns}
          />
        </div>
      </div>;
}
