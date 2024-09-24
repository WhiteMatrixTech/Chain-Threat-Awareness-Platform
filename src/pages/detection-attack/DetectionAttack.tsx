/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-28 13:35:25
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-24 11:14:21
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {ButtonCommonCyber} from  '@/components/ButtonCommonCyber'
import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { detectionSampleAttackColumns } from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService,
  detectAttackRequestType,
  detectAttackService,
} from "@/services/detection";
import pattern from "@/styles/pattern";

export function DetectionAttack() {
  const typeList = [
    {
      label: "哈希",
      value: "hash"
    }
  ];
  const [inputVal, setInputVal] = useState("");
  const [result, setResult] = useState({
    content: '',

    time: ''
  });
  const [detectResult, setdetectResult] = useState([
    {
      title: 'attacks_info',
      key: 'attacks_info',
      value: ''
    },
    {
      title: 'block_height',
      key: 'block_height',
      value: ''
    },
    {
      title: 'number_of_detected_attacks',
      key: 'number_of_detected_attacks',
      value: ''
    },
    {
      title: 'total_number_of_transactions',
      key: 'total_number_of_transactions',
      value: ''
    }
  ]) as any
  const [loading, setLoading] = useState(false);
const [detectionSampleList, setdetectionSampleList] = useState([]) as any;

const getActionLogList = async () => {
  const params: detectActionLogRequestType = {
    action: "front_running",
    count: 10
  };
  const respose = await detectActionLogService(params);
  const result: any[] = respose.data.map((item: any) => {
    return {
      name: item.input,
      result: item.output,
      time: item.createAt
      
    };
  });
  setdetectionSampleList(result);
  if (!inputVal.length) {
    setInputVal(result[0].name)
  }
  console.log("检测数据>>>>", respose);
  console.log("检测数据>>>result>", result);
};
  const start = async () => {
    if (!inputVal) {
      notification.warning({ message: `请输入必要信息!!!` });
      return;
    }
    setLoading(true);
    try {
      const params: detectAttackRequestType = {
        blockNumber: inputVal
      };
      console.log("params>>>>", params);
      const respose = await detectAttackService(params);
      console.log("respose:", respose);
      const newVal = detectResult.map((Ditem: any) => {
        const val = respose[Ditem.key];
        return {
          ...Ditem,
          value: Ditem.key !== 'attacks_info'?String(val):val.length?val[0]:'空'
        };
      });
      setdetectResult(newVal)
      setResult({
        // content: respose.attacks_info.length? respose.attacks_info,
        content: '',
        time: (respose.cost / 1000).toFixed(1) + "s",
      });
      setLoading(false);
      void getActionLogList()
    } catch {
      setLoading(false);
    }

  };


  useEffect(() => {
    void getActionLogList();
  }, []);
  return (
    <div className={cn(`w-full h-full 3xl:pb-30  flex items-center`)}>
      <div className={cn(`${pattern.flexbet} w-full max-h-[783px] h-full `)}>

      <div
        className={`scale-95 3xl:scale-100 left  w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full flex flex-col items-end justify-between`}
      >
        <div
          className={cn(
            ` w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative `
          )}
        >
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/attackBg1Title.png')] bg-cover bg-center`
            )}
          />
          <div
            className={cn(
              `absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)]  pt-[66px] px-[106px] pb-[40px]`
            )}
          >
            <div className="w-full h-full  flex flex-col gap-y-[16px]">
              <div className={`w-full h-[36px] flex items-center`}>
                  <InputCommonV2
                    initVal={inputVal}
                  placeholder="以太坊区块的区块号或区块哈希"
                  onInput={(val: any) => {
                    setInputVal(val);
                  }}
                  className="w-[450px] h-[36px] "
                />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                  {/* <ButtonCommonV2
                    onClick={() => {
                      void start();
                    }}
                  >
                    <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                  </ButtonCommonV2> */}
                  <ButtonCommonCyber
                    onClick={() => {
                        void start();
                        
                    }}
                    className="w-[450px] h-[36px] "
                  >
                    <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                  </ButtonCommonCyber>
              </div>  
              {result.time.length !== 0 && (
                <div className="w-full h-[22px] flex justify-center items-center">
                  <span className="text-[#ffffff] text-[13px]">检索时间：{ result.time}</span>
                </div>
              )}

            </div>
          </div>
        </div>
        <div className={cn(` w-[662px] h-[calc(100%_-_278px)] flex flex-col justify-between`)}>
            <div className={cn(`w-full h-[40px] flex items-center justify-start`,
              `border-solid border-[#00A0E9] border-l-[6px]`,
              'bg-[#02004D4D] pl-5'

            )}>
              <span className="text-[20px] text-[#ffffff]">历史检测数据</span>
            </div>
            <div className="w-full h-[calc(100%_-_48px)]">
              <TableCommonV4
                className="w-full h-full"
                data={detectionSampleList}
                columns={detectionSampleAttackColumns}
              />
            </div>

        </div>
      </div>
      <div
        className={` right w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full flex justify-start items-center`}
      >
        <div className="pt-[60px] px-[20px] pb-[20px] w-[614px] h-[600px] 3xl:w-[778px] 3xl:h-[760px] bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
            <div className="w-full h-full relative overflow-scroll">
            {result.time &&
                detectResult.map((item: any, index: number) =>
                  <div
                    key={index}
                    className="h-[35px] w-full text-[#FFFFFF] text-[16px] flex justify-between items-center"
                  >
                    <span className="w-[250px] h-full flex items-center justify-start">
                      {item.key}
                    </span>
                    <span className="w-[calc(100%_-_260px)] h-full flex items-center justify-start">
                      {item.value}
                    </span>
                  </div>
                )}
            {/* <span className="text-[#FFFFFF] text-[16px]">
              {result.content}
            </span> */}
            {loading &&
              <div
                className={cn(
                  "w-full h-full absolute top-0 left-0",
                  `${pattern.flexCenter}`
                )}
              >
                <AiOutlineLoading3Quarters
                  className="ml-2 animate-spin"
                  style={{ color: "white", fontSize: "24px" }}
                />
              </div>}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
