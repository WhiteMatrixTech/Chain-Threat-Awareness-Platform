/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:13:04
 */
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonCyber } from "@/components/ButtonCommonCyber";
import { DateCommon } from "@/components/DateCommon";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import { detectionSamplePrivacyColumns,privacyResultCols } from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService,
  detectPrivacyBlockRangeService,
  detectSelfishminingRequestType,
  detectSelfishminingService} from "@/services/detection";
import pattern from "@/styles/pattern";

export function DetectionPrivacy() {
const [detectionSampleList, setdetectionSampleList] = useState([]) as any;

  const typeList = [
    {
      label: "比特币（BTC）",
      value: 1,
      bg: `bg-[url('./assets/privacyBg1Title1.png')]`
      
    },
    {
      label: "比特币现金（BCH）",
      value: 2,
      bg: `bg-[url('./assets/privacyBg1Title2.png')]`

    },
    {
      label: "以太坊（ETH）",
      value: 3,
      bg: `bg-[url('./assets/privacyBg1Title3.png')]`

    },
    {
      label: "莱特币（LTC）",
      value: 4,
      bg: `bg-[url('./assets/privacyBg1Title4.png')]`

    },
    {
      label: "币安智能链（BSC）",
      value: 5,
      bg: `bg-[url('./assets/privacyBg1Title5.png')]`

    }
  ];
  const [selectedType, setSelectedType] = useState<ISelectorItemProps>(
    typeList[0]
  );
  const [inputRangeOne, setInputRangeOne] = useState<any>("");
  const [inputRangeTwo, setInputRangeTwo] = useState<any>("");
  const [result, setResult] = useState({
    dataList: [],
    content: '',
    time: ''
  });
  const [rangeMap, setRangMap] = useState({
    1:[1, 1000],
    2:[1, 1000],
    3:[1, 1000],
    4:[1, 1000],
    5:[1, 1000],
  }) as any
  


  const [
    { loading },
    detectPrivacy
  ] = useAsyncFn(async (params: detectSelfishminingRequestType) => {
    console.log('params>>>', params)
    const data = await detectSelfishminingService(params);
    return data;
  });


  const getArrange = async (chain:any) => {
    const params = {chain: chain}
    const response = await detectPrivacyBlockRangeService(params)
    const max = response.data
    const min = response.data - 500
    const newMap = {
      ...rangeMap
    }
    newMap[chain] = [min, max]
    setRangMap({
      ...newMap,
    })
  }
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "selfish_mining",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input?JSON.parse(item.input).block_range: '',
        time: item.createAt,
        result: item.output?JSON.parse(item.output).result:'',
      };
    });
    setdetectionSampleList(result);
  };

  const clearResult = () => {
    setResult({
      dataList: [],
      content: '',
      time: ''
    })
  }

  const start = async () => {
    clearResult()
    console.log('rangeMap>>>',rangeMap)
    if (!inputRangeOne || !inputRangeTwo || Number(inputRangeTwo) < Number(inputRangeOne)) {
      notification.warning({ message: `请正确输入必要信息!!!` });
      return;
    }
    const startBlock = Number(inputRangeOne)
    const endBlock = Number(inputRangeTwo)
    
    if (endBlock - startBlock > 500) {
      notification.warning({ message: `范围不能超过 500 个区块!!!` });
      return;
    }
// 校验范围
    const currentRange = rangeMap[selectedType.value]
    if (startBlock < currentRange[0] || endBlock > currentRange[1]) {
      // notification.warning({ message: `当前合法区块范围:[${currentRange[0]},${currentRange[1]}]` });
      notification.warning({ message: `输入区块不存在,合法区块范围[${currentRange[0]}, ${currentRange[1]}]` });
      return;
    }


    
    const params = {
      chain: selectedType?.value,
      startBlock: inputRangeOne,
      endBlock: inputRangeTwo,
    };
    
    const response = await detectPrivacy(params);
    setResult({
      dataList: response.miners_info,
      content: response.result || '无..',
      time: (response.cost / 1000).toFixed(1) + "s"
    });
    void getActionLogList();
  };


  useEffect(() => {
    void getArrange(1)
    void getActionLogList();
  }, []);
  useEffect(() => {
    const chain = selectedType.value
    void getArrange(Number(chain))
  }, [selectedType])
  return (
    <div className={cn(`w-full h-full 3xl:pb-30  flex items-center `)}>

      <div className={cn(`${pattern.flexbet} w-full max-h-[783px] h-full `)}>
      <div
        className={`scale-95 3xl:scale-100 left  w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full  flex flex-col items-end justify-between gap-y-7`}
      >
        <div
          className={cn(
            ` w-[662px] h-[384px] bg-[url('./assets/privacyBg1.png')] bg-cover bg-center relative`
          )}
        >
          <div
              className={cn(
                `absolute top-0 left-0 w-full h-[54px]  bg-cover bg-center`,
                // selectedType.bg
                // `bg-[url('./assets/privacyBg1Title1.png')]`
                selectedType.value === 1? `bg-[url('./assets/privacyBg1Title1.png')]`: selectedType.value === 2? `bg-[url('./assets/privacyBg1Title2.png')]`:selectedType.value === 3? `bg-[url('./assets/privacyBg1Title3.png')]`:selectedType.value === 4? `bg-[url('./assets/privacyBg1Title4.png')]`:selectedType.value === 5? `bg-[url('./assets/privacyBg1Title5.png')]`:''
            )}
          />
          <div
            className={cn(
              `absolute top-[54px] left-0 w-full h-[calc(100%_-_54px)]  pt-[66px] px-[106px] pb-[40px]`
            )}
          >
            <div className="w-full h-full  flex flex-col gap-y-[16px] ">
              <div className={`w-full h-[36px] flex items-center `}>
                <SelectorCommonV2
                  placeholder="币种"
                  value={selectedType}
                  options={typeList}
                  setValue={(item: ISelectorItemProps) => {
                    setSelectedType(item);
                  }}
                    className="w-[450px] h-[36px]"
                />
              </div>
              {/* <div
                  className={cn(`w-full h-[36px]  ${pattern.flexCenter}`)}
                >
                  <DateCommon
                    className="w-[450px] h-full"
                    onSelect={(date: any) => {
                      setSelectedRange(date)
                    }}
                  />
                </div> */}
              <div className={`w-full h-[36px] flex items-center justify-between`}>
                <span className="text-[16px] text-[#ffffff] w-[80px]">开始区块号</span>
                <InputCommonV2
                  initVal={inputRangeOne}
                  placeholder="请输入"
                  onInput={(val: any) => {
                    setInputRangeOne(val);
                  }}
                  className="w-[calc(100%_-_100px)] h-[36px] "
                />
              </div>
              <div className={`w-full h-[36px] flex items-center justify-between`}>
              <span className="text-[16px] text-[#ffffff] w-[80px]">结束区块号</span>
              <InputCommonV2
                initVal={inputRangeTwo}
                placeholder="请输入,与开始区块差值≤500"
                onInput={(val: any) => {
                  setInputRangeTwo(val);
                }}
                className="w-[calc(100%_-_100px)] h-[36px] "
              />
              </div>
              <div
                className={`w-full h-[36px] flex items-center justify-end select-none`}
              >
                  <ButtonCommonCyber
                    className="w-full"
                  // disable={fishLoading}
                  onClick={() => {
                    void start();
                  }}
                >
                  <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                </ButtonCommonCyber>
              </div>
              {result.time.length !== 0 &&
                <div className="w-full h-[22px] flex justify-center items-center">
                  <span className="text-[#ffffff] text-[13px]">
                    检索时间：{result.time}
                  </span>
                </div>}
            </div>
          </div>
        </div>
        <div className={cn(` w-[662px] h-[calc(100%_-_390px)] flex flex-col`)}>
          <div className={cn(`w-full h-[40px] flex items-center justify-start`,
            `border-solid border-[#00A0E9] border-l-[6px]`,
            'bg-[#02004D4D] pl-5'

            )}>
            <span className="text-[20px] text-[#ffffff]">历史检测数据 - 基于二阶二项分布的通用自私挖矿检测模型</span>
            </div>
            <div className="w-full h-[calc(100%_-_50px)] mt-[10px]">
              <TableCommonV4
              className="w-full h-full"
              data={detectionSampleList}
              columns={detectionSamplePrivacyColumns}
            />
            </div>
          

        </div>
      </div>
      <div
        className={` right w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full flex justify-start items-center `}
      >
        <div className=" pt-[60px] px-[20px] pb-[20px] w-[614px] h-[600px] 3xl:w-[778px] 3xl:h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center  overflow-scroll">
            <div className="w-full h-full relative  flex flex-col justify-around">
              {!result.content && !loading && (
                <div className="w-full h-[100px] absolute top-0 left-0">
                  <span className="text-[16px] text-[#FFFFFF99]">请输入检测内容并点击开始检测以查看结果</span>
                </div>
              )}
              <div className="table_container w-full h-[calc(100%_-_60px)] ">
                {result.content && (
                  <TableCommonV4
                  className="w-full h-full"
                  data={result.dataList}
                  columns={privacyResultCols}
                />  
                )}
 
              </div>
              <div className=" w-full h-[50px] overflow-scroll">
                {result.content && (
                  <span className="text-[#FFFFFF] text-[16px] ">
                    检测结果：{result.content}
                  </span>
                )}

              </div>
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
