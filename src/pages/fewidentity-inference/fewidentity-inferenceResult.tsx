/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-06 09:14:34
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
import { columns } from "@/services/columns";
import {
  detectFewSamplesRequestType,
  detectFewSamplesService
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
    time: ""
  });

  const [dataList, setDateList] = useState<any>([]);
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
      setResult({
        ...result,
        time: (respose.cost / 1000).toFixed(1) + "s",
        result: respose.identity
      });
      setloading(false);
    } catch (error) {
      setloading(false);
    }
    setloading(false);
  };

  useEffect(() => {
    void start();

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
            <TableCommonV2 className="" data={dataList} columns={columns} />
          </div>
        </div>
      </div>;
}
