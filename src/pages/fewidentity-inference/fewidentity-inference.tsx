/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-10 15:42:38
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import {
  detectActionLogRequestType,
  detectActionLogService
} from "@/services/detection";
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonCyber } from "@/components/ButtonCommonCyber";
import { GraphinData } from "@antv/graphin";
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { TagComponent } from "@/components/TagComponent";
import { detectionFewSampleColumns, modelColumns } from "@/services/columns";
import { modelListFewIdentityMock } from "@/services/mockData/commonList";
import pattern from "@/styles/pattern";

export function FewidentityInference() {
  const navigate = useNavigate();
  const [modelList, setModelList] = useState(modelListFewIdentityMock);
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;

  const [address, setAddress] = useState<any>(null);
  const [sampleData, setSampleData] = useState<any>({
    sample1: "0x51d4f799f40a7ca9f4289e64dbed0502a494e8a0",
    sample2: "0x6ef5b57cc302d53b873c7b471faa1b9bb2c437aa",
    sample3: "0x95b0566ff14437f18fa310a621efd9b496b21c29",
    sample4: "0xeec065d75ae38db0df08344eebed4aefcec918b4",
    sample5: "0xfb1b9882ac70484e054c8d02c6097ea2777cc2d8"
  });
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "fsl",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      const input = item.input.split(",");
      return {
        name: input[input.length - 1],
        time: item.createAt,
        result: JSON.parse(item.output).identity,
        sample: input.slice(0, 5).join(",")
      };
    });
    setdetectionSampleList(result);
    console.log("监测数据>>>>", respose);
  };
  useEffect(() => {
    void getActionLogList();
  }, []);

  const startSearch = () => {
    // 开始查询
    if (!address) {
      notification.warning({ message: `请输入信息！！！` });
      return;
    }
    const samArr = Object.values(sampleData);
    const t = samArr.filter((item: any) => item.length === 0);
    console.log("addre>>", address);
    console.log("t>>", t);
    if (t.length) {
      notification.warning({ message: `请输入信息！！！` });
    } else {
      navigate(
        `/threat-evidence/fewidentity-inference/result/${address}/${samArr.join(
          ","
        )}`
      );
    }
  };

  return (
    <div className={cn(" w-full h-full fadeIn flex flex-col ")}>
      <div className={cn(`w-full h-[calc(60%)] ${pattern.flexCenter}`)}>
        <div
          className={cn(
            `scale-75 3xl:scale-100 w-[1068px] h-[484px] relative `
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/FewidentityDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              `pt-8 px-14 pb-10 absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] `,
              "bg-[#003F7A4D]",
              "border-solid border-[1px] border-[#D3EAFF] border-t-0 border-r-0 border-l-0",
              `${pattern.flexbet}`
            )}
          >
            <div
              className={cn(
                `w-[450px] h-full `,
                "flex flex-col justify-between items-start"
              )}
            >
              <span className="text-[#ffffff] text-[18px]">
                提供5个样本用于推断待测地址是否是该身份
              </span>
              <InputCommonV2
                initVal={sampleData.sample1}
                placeholder="样本地址"
                onInput={(val: any) => {
                  setSampleData({
                    ...sampleData,
                    sample1: val
                  });
                }}
                className="w-full h-[36px]"
              />
              <InputCommonV2
                initVal={sampleData.sample2}
                placeholder="样本地址"
                onInput={(val: any) => {
                  setSampleData({
                    ...sampleData,
                    sample2: val
                  });
                }}
                className="w-full h-[36px] "
              />
              <InputCommonV2
                initVal={sampleData.sample3}
                placeholder="样本地址"
                onInput={(val: any) => {
                  setSampleData({
                    ...sampleData,
                    sample3: val
                  });
                }}
                className="w-full h-[36px] "
              />
              <InputCommonV2
                initVal={sampleData.sample4}
                placeholder="样本地址"
                onInput={(val: any) => {
                  setSampleData({
                    ...sampleData,
                    sample4: val
                  });
                }}
                className="w-full h-[36px] "
              />
              <InputCommonV2
                initVal={sampleData.sample5}
                placeholder="样本地址"
                onInput={(val: any) => {
                  setSampleData({
                    ...sampleData,
                    sample5: val
                  });
                }}
                className="w-full h-[36px] "
              />
            </div>
            <div
              className={cn(
                `w-[1px] h-full border-[#00A0E9] border-[1px] border-solid`
              )}
            />
            <div
              className={cn(`w-[450px] h-full flex flex-col gap-y-4 items-end`)}
            >
              <div
                className={`w-full h-[24px] flex items-center justify-start`}
              >
                <span className="text-[#ffffff] text-[18px]">待测地址</span>
              </div>
              <InputCommonV2
                placeholder="输入待测地址"
                onInput={(val: any) => {
                  setAddress(val);
                }}
                className="w-full h-[36px] "
              />

              {/* <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[#FFFFFF] text-[16px]">查询</span>
              </ButtonCommonV2> */}
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

      <div className={cn(`w-full h-[calc(40%)] flex justify-between`)}>
        <div className="w-[calc(50%_-_10px)] h-full flex flex-col justify-between">
          <div className="w-[120px] h-[36px]">
            <TagComponent title="模型信息" className="w-[120px] h-[36px]" />
          </div>

          <div className={cn(` w-full h-[calc(100%_-_52px)]`)}>
            <TableCommonV4
              className="w-full h-full"
              data={modelList}
              columns={modelColumns}
            />
          </div>
        </div>
        <div className="w-[calc(50%_-_10px)] h-full flex flex-col justify-between">
          <div className="w-[120px] h-[36px]">
            <TagComponent title="检测样例" className="w-[120px] h-[36px]" />
          </div>
          <div className={cn(` w-full h-[calc(100%_-_52px)]`)}>
            <TableCommonV4
              className="w-full h-full"
              data={detectionSampleList}
              columns={detectionFewSampleColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
