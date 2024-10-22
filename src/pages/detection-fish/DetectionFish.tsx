/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:10:29
 */
import { notification } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAsyncFn } from "react-use";

import { ButtonCommonCyber } from "@/components/ButtonCommonCyber";
import { ButtonCommonV2 } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import { TableCommonV4 } from "@/components/TableCommonV4";
import {
  detectionFishResultColumns,
  detectionSampleFishColumns
} from "@/services/columns";
import {
  detectActionLogRequestType,
  detectActionLogService,
  detectAttackRequestType,
  detectAttackService,
  detectPhishingRequestType,
  detectPhishingService
} from "@/services/detection";
import pattern from "@/styles/pattern";
import { isValidAddress } from "@/utils/common";

export function DetectionFish() {
  const [inputVal, setInputVal] = useState("");
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [detectResult, setdetectResult] = useState([
    {
      title: "Average Clustering Coefficient",
      CTitle: "聚类系数",
      key: "ACC",
      value: ""
    },
    {
      title: "Average Degree",
      CTitle: "节点度平均值",
      key: "AD",
      value: ""
    },
    {
      title: "Average Neighbor Degree",
      CTitle: "节点的邻居的平均度",
      key: "AND",
      value: ""
    },
    {
      title: "Betweenness Centrality",
      CTitle: "介数中心性的平均值",
      key: "BC",
      value: ""
    },
    {
      title: "Closeness Centrality",
      CTitle: "接近中心性的平均值",
      key: "CC",
      value: ""
    },
    {
      title: "Maximum Eigenvalue of Adjacency Matrix",
      CTitle: "最大特征值的实部",
      key: "MEoAM",
      value: ""
    },
    {
      title: "Network Density",
      CTitle: "图密度",
      key: "ND",
      value: ""
    },
    {
      title: "Proportion of Leaf Nodes",
      CTitle: "叶子节点比",
      key: "PoLN",
      value: ""
    },
    {
      title: "edges",
      CTitle: "边数",
      key: "edges",
      value: ""
    },
    {
      title: "预测结果",
      CTitle: "预测结果",
      key: "is_phishing",
      value: ""
    },
    {
      title: "message",
      CTitle: "消息",
      key: "message",
      value: ""
    },
    {
      title: "nodes",
      CTitle: "节点数量",

      key: "nodes",
      value: ""
    },
    {
      title: "success",
      CTitle: "请求是否成功",
      key: "success",
      value: ""
    }
  ]) as any;

  const [result, setResult] = useState({
    content: "",
    time: ""
  });

  const [
    { loading },
    detectFish
  ] = useAsyncFn(async (params: detectPhishingRequestType) => {
    const data = await detectPhishingService(params);
    return data;
  });
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: "phishing_attack",
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        // result: JSON.parse(item.output).is_phishing ? "钓鱼地址" : "非钓鱼地址",
        result: item.output
          ? JSON.parse(item.output).is_phishing ? "钓鱼地址" : "非钓鱼地址"
          : "",
        time: item.createAt
      };
    });
    setdetectionSampleList(result);
    if (!inputVal.length) {
      setInputVal(result[0].name);
    }
    console.log("检测数据>>>>", respose);
    console.log("检测数据>>>result>", result);
  };
  const start = async () => {
    setResult({
      time: "",
      content: ""
    });
    if (!inputVal) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    if (!isValidAddress(inputVal)) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    try {
      const params: detectPhishingRequestType = {
        address: inputVal
      };
      const respose = await detectFish(params);
      const newVal = detectResult.map((Ditem: any) => {
        const key = Ditem.key;
        return {
          ...Ditem,
          value: String(
            typeof respose[key] === "boolean"
              ? respose[key] ? "是" : "否"
              : typeof respose[key] !== "undefined" ? respose[key] : "无"
          )
        };
      });
      console.log("newVal>>>", newVal);
      setdetectResult(newVal);
      setResult({
        ...result,
        time: (respose.cost / 1000).toFixed(1) + "s"
      });
      void getActionLogList();
    } catch (error) {}
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
              `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative`
            )}
          >
            <div
              className={cn(
                `absolute top-0 left-0 w-full h-[54px] bg-[url('./assets/fishBg1Title.png')] bg-cover bg-center`
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
                    placeholder="以太坊外部账号的地址"
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
                  className=""
                  loading={loading}
                  disable={loading}
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
                {result.time.length !== 0 &&
                  <div className="w-full h-[22px] flex justify-center items-center">
                    <span className="text-[#ffffff] text-[13px]">
                      检索时间：{result.time}
                    </span>
                  </div>}
              </div>
            </div>
          </div>
          <div
            className={cn(
              ` w-[662px]  h-[calc(100%_-_278px)] flex flex-col justify-between`
            )}
          >
            <div
              className={cn(
                `w-full h-[40px] flex items-center justify-start`,
                `border-solid border-[#00A0E9] border-l-[6px]`,
                "bg-[#02004D4D] pl-5"
              )}
            >
              <span className="text-[20px] text-[#ffffff]">
                历史检测数据-基于图神经网络的钓鱼攻击检测模型
              </span>
            </div>
            <div className="w-full h-[calc(100%_-_48px)]">
              <TableCommonV4
                className="w-full h-full"
                data={detectionSampleList}
                columns={detectionSampleFishColumns}
              />
            </div>
          </div>
        </div>
        <div
          className={` right w-[calc(50%_-_10px)] 3xl:w-[calc(50%_-_55px)] h-full flex justify-start items-center`}
        >
          <div className="pt-[55px] 3xl:pt-[70px] px-[20px] pb-[10px] 3xl:pb-[20px] w-[614px] h-[600px] 3xl:w-[778px] 3xl:h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
            <div className="w-full h-full relative overflow-scroll ">
              {!result.time &&
                !loading &&
                <div className="w-full h-[100px] absolute top-0 left-0">
                  <span className="text-[16px] text-[#FFFFFF99]">
                    请输入检测内容并点击开始检测以查看结果
                  </span>
                </div>}
              {result.time &&
                <div className="w-full h-full">
                  <TableCommonV4
                    className="w-full h-full"
                    data={detectResult}
                    columns={detectionFishResultColumns}
                  />
                </div>}

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
