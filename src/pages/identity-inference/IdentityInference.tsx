/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-12 10:40:22
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonCyber } from "@/components/ButtonCommonCyber";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { TableCommonV2 } from "@/components/TableCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { TagComponent } from "@/components/TagComponent";
import { detectionSampleColumns, modelColumns } from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService
} from "@/services/detection";
import { modelListIdentityMock } from "@/services/mockData/commonList";
import pattern from "@/styles/pattern";

export function IdentityInference() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState<any>("");

  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [modelList, setModelList] = useState(modelListIdentityMock);

  const startSearch = () => {
    // 开始查询
    if (!inputVal) {
      notification.warning({ message: `请输入地址！` });
      return;
    }
    navigate(`/threat-evidence/identity-inference/result/${inputVal}`);
  };
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "i2gt",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        time: item.createAt,
        cost: item.cost || "-",
        result: JSON.parse(item.output).identity,
        tag: "-"
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
    <div className={cn(" w-full h-full fadeIn flex flex-col ")}>
      <div className={cn(`w-full h-[calc(60%)] ${pattern.flexCenter}`)}>
        <div
          className={cn(
            `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative `
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/IdentityInferenceDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`
            )}
          >
            <div className={cn(`flex flex-col gap-y-6 items-end`)}>
              <InputCommonV2
                placeholder="输入待测地址"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="w-[450px] h-[36px] "
              />

              <ButtonCommonCyber
                onClick={() => {
                  startSearch();
                }}
                className="w-[450px] h-[36px] "
              >
                <span className="text-[#FFFFFF] text-[16px]">查询</span>
              </ButtonCommonCyber>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(` w-full h-[calc(40%)] flex justify-between`)}>
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
              columns={detectionSampleColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
