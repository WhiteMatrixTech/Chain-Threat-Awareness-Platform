/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-09 14:48:48
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { GraphinData } from "@antv/graphin";
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV3 } from "@/components/InputCommonV3";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { TagComponent } from "@/components/TagComponent";
import {
  detectionMaliciousSampleColumns,
  modelColumns
} from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService
} from "@/services/detection";
import { modelListMaliciousMock } from "@/services/mockData/commonList";
import pattern from "@/styles/pattern";

export function MaliciousTransaction() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState<any>("");
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [modelList, setModelList] = useState(modelListMaliciousMock);

  const startSearch = () => {
    if (!inputVal) {
      notification.warning({ message: `请输入信息！` });
      return;
    }
    // 开始查询
    navigate(`/threat-evidence/malicious-transaction/result/${inputVal}`);
  };
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "illicit",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        time: item.createAt,
        result: JSON.parse(item.output).identity || "无"
      };
    });
    setdetectionSampleList(result);
    console.log("检测数据>>>>", respose);
    console.log("检测数据>>>result>", result);
  };
  useEffect(() => {
    void getActionLogList();
  }, []);

  return (
    <div
      className={cn(" w-full h-full pt-[0px]  fadeIn", `${pattern.flexbet}`)}
    >
      <div
        className={cn(
          ` w-full h-full flex flex-col gap-y-20 justify-between pt-40 items-center`
        )}
      >
        <div className={cn(`w-[662px] h-[322px] relative`)}>
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/MaliciousTransactionDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`,
              "bg-[#003F7A4D]",
              "border-solid border-[1px] border-[#D3EAFF] border-t-0 border-r-0 border-l-0",
              "pt-[66px] px-[106px] pb-[40px]"
            )}
          >
            <div
              className={cn(
                `w-full h-[162px] flex flex-col gap-y-6 items-end  justify-between`
              )}
            >
              <InputCommonV3
                placeholder="输入交易信息"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="w-[450px] h-[100px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[#FFFFFF] text-[16px]">查询</span>
              </ButtonCommonV2>
            </div>
          </div>
        </div>
        <div className={cn(`w-full h-[370px] flex justify-between`)}>
          <div className="w-[calc(50%_-_10px)] h-full flex flex-col  justify-between">
            <div className="w-[120px] h-[36px]">
              <TagComponent title="模型信息" className="w-[120px] h-[36px]" />
            </div>

            <div className={cn(` w-full h-[calc(100%_-_52px)] `)}>
              <TableCommonV4
                className="w-full h-full"
                data={modelList}
                columns={modelColumns}
              />
            </div>
          </div>
          <div className="w-[calc(50%_-_10px)] h-full flex flex-col  justify-between">
            <div className="w-[120px] h-[36px]">
              <TagComponent title="检测样例" className="w-[120px] h-[36px]" />
            </div>
            <div className={cn(` w-full h-[calc(100%_-_52px)] `)}>
              <TableCommonV4
                className="w-full h-full"
                data={detectionSampleList}
                columns={detectionMaliciousSampleColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
