/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-13 01:17:39
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Progress } from "@/components/progres";
import { ResultComponent } from "@/components/ResultComponent";
import { TagComponent } from "@/components/TagComponent";
import {
  detectMaliciousRequestType,
  detectMaliciousService
} from "@/services/detection";
import pattern from "@/styles/pattern";

export function MaliciousTransactionResult() {
  const { tx } = useParams();
  const [loading, setloading] = useState(true);

  const [result, setResult] = useState({
    result: "",
    hash_id: "",
    time: "",
    infoData: "",
    conclusionData: "",
    dataList: [
      {
        title: "输入金额：",
        key: "input_value",
        value: "",
        rem: " BTC"
      },
      {
        title: "输出金额：",
        key: "output_value",
        value: "",
        rem: " BTC"
      },
      {
        title: "输入数量：",
        key: "inputs_count",
        value: "",
        rem: ""
      },
      {
        title: "输出数量：",
        key: "outputs_count",
        value: "",
        rem: ""
      },
      {
        title: "手续费：",
        key: "fee",
        value: "",
        rem: " BTC"
      },
      {
        title: "交易大小：",
        key: "size",
        value: "6,387",
        rem: " Bytes"
      },
      {
        title: "交易费率：",
        key: "fee_per_vb",
        value: "",
        rem: " sat/vByte"
      },
      {
        title: "交易时间：",
        key: "broadcasted_at",
        value: "14 Mar 2020 07:08:57",
        rem: ""
      }
    ]
  });

  const start = async () => {
    setloading(true);
    try {
      const params: detectMaliciousRequestType = {
        tx: tx || "",
        chain: "btc"
      };
      const respose = await detectMaliciousService(params);
      const re = result.dataList.map((item: any) => {
        const newValue = respose[item.key];
        return {
          ...item,
          value: newValue
        };
      });
      setResult({
        ...result,
        ...respose,
        time: (respose.cost / 1000).toFixed(1) + "s",
        dataList: [...re],
        conclusionData: respose.summary
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
        <Progress />
      </div>
    : <div
        className={cn(" w-full h-full pt-[0px] fadeIn", `${pattern.flexbet}`)}
      >
        <div className={cn(`w-full h-full `)}>
          <div className="w-full h-[50px] flex justify-between items-center">
            <ResultComponent
              title="检测时间"
              content={result.time}
              className="w-[174px] h-[50px]"
            />
            <ResultComponent
              title="检测结果"
              content={`${result.result}`}
              className="w-[calc(100%_-_190px)] h-[50px]"
            />
          </div>

          <div className="w-[120px] h-[36px] mt-7">
            <TagComponent title="交易分布信息" className="w-[120px] h-[36px]" />
          </div>
          <div
            className={cn(
              `w-full h-[272px] px-5 py-5 mt-4`,
              "bg-[#02004D4D]",
              `border-[2px] border-solid border-[#0D53B7]`,
              "flex flex-col gap-y-5"
            )}
          >
            <div
              className={`h-[20px] w-full flex items-center justify-between`}
            >
              <span className="text-[#ffffff] text-[15px] w-[80px] ">
                Hash ID :
              </span>
              <span className="text-[#ffffff] text-[20px] w-[calc(100%_-_90px)] truncate">
                {result.hash_id}
              </span>
            </div>
            <div className={cn(`w-full flex-1 ${pattern.flexbet}`)}>
              <div className={cn(`w-[calc(50%_-_60px)] h-full `)}>
                {result &&
                  result.dataList &&
                  result.dataList.slice(0, 4).map((item, index) =>
                    <div
                      key={index}
                      className={cn(
                        `w-full h-[48px] ${pattern.flexbet}`,
                        `border-[#0083CF] border-b-[1px] border-solid `
                      )}
                    >
                      <span className="text-[#ffffff] text-[15px]">
                        {item.title}
                      </span>
                      <span className="text-[#ffffff] text-[20px]">
                        {item.value + item.rem}
                      </span>
                    </div>
                  )}
              </div>
              <div
                className={cn(
                  `w-[1px] h-full`,
                  `border-[#00A0E9] border-[1px] border-solid`
                )}
              />
              <div className={cn(`w-[calc(50%_-_60px)] h-full `)}>
                {result &&
                  result.dataList &&
                  result.dataList.slice(4).map((item, index) =>
                    <div
                      key={index}
                      className={cn(
                        `w-full h-[48px] ${pattern.flexbet}`,
                        `border-[#0083CF] border-b-[1px] border-solid `
                      )}
                    >
                      <span className="text-[#ffffff] text-[15px]">
                        {item.title}
                      </span>
                      <span className="text-[#ffffff] text-[20px]">
                        {item.value + item.rem}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="w-[120px] h-[36px] mt-10">
            <TagComponent title="交易总结" className="w-[120px] h-[36px]" />
          </div>
          <div
            className={cn(
              `w-full h-[calc(100%_-_500px)] px-5 py-5 mt-4 overflow-scroll`,
              "bg-[#02004D4D]",
              `border-[2px] border-solid border-[#0D53B7]`,
              "flex flex-col gap-y-5 text-[#ffffff]"
            )}
          >
            <div className="content text-[15px]">
              {result.conclusionData}
            </div>
          </div>
        </div>
      </div>;
}
