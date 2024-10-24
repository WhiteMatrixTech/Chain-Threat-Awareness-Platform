/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:07:04
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { TagComponent } from "@/components/TagComponent";
import {
  detectionSampleBitCoinColumns,
  modelColumns
} from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService
} from "@/services/detection";
import { modelListBitCoinMock } from "@/services/mockData/commonList";
import pattern from "@/styles/pattern";
import { isValidAddressV2 } from "@/utils/common";

export function BitcoinmixedcoinDetection() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState<any>("");
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [modelList, setModelList] = useState(modelListBitCoinMock);
  const startSearch = () => {
    // 开始查询
    if (!inputVal) {
      notification.warning({ message: `请输入信息！` });
      return;
    }
    if (!isValidAddressV2(inputVal)) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    navigate(`/threat-evidence/bitcoinmixedcoin-detection/result/${inputVal}`);
  };
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "mix_coin",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        time: item.createAt,
        result: item.output ? JSON.parse(item.output).result : ""
      };
    });
    setdetectionSampleList(result);
    setInputVal(result[0].name);
  };

  useEffect(() => {
    void getActionLogList();
  }, []);

  return (
    <div className={cn(" w-full h-full fadeIn flex flex-col ")}>
      <div className={cn(`w-full h-[calc(60%)] ${pattern.flexCenter}`)}>
        <div
          className={cn(
            `scale-[70%] 3xl:scale-[100%] w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative`
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/BitcoinmixedcoinDetectionDialogTitle.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              ` absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)] ${pattern.flexCenter}`
            )}
          >
            <div className={cn(` flex flex-col gap-y-6 items-end`)}>
              <InputCommonV2
                initVal={inputVal}
                placeholder="输入64位交易ID"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="w-[450px] h-[36px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[#FFFFFF] text-[16px]">检测</span>
              </ButtonCommonV2>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(`w-full h-[calc(40%)] flex justify-between`)}>
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
              columns={detectionSampleBitCoinColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
