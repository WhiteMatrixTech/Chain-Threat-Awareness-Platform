/* eslint-disable @typescript-eslint/restrict-plus-operands */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-06 09:08:54
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
import { columns, columnsIdentity } from "@/services/columns";
import {
  detectFishRequestType,
  detectFishService,
  detectIdentityRequestType,
  detectIdentityService,
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

export function IdentityInferenceResult() {
  const { address } = useParams();
  const [result, setResult] = useState({
    time: "",
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
        identity: respose.identity,
        time: (respose.cost / 1000).toFixed(1) + "s",
        detectionResult: resposeFish.status || "无"
        // dataList: resposeTransaction.data
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
        <div className={cn(` w-full h-[320px]`)}>
          <TableCommonV2
            className=""
            data={result.dataList}
            columns={columns}
          />
        </div>
      </div>;
}
