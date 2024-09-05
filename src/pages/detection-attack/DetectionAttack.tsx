/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-28 13:35:25
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 13:58:03
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { notification } from "antd";
import cn from "classnames";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { ButtonCommonV2, EButtonType } from "@/components/ButtonCommonV2";
import { InputCommonV2 } from "@/components/InputCommonV2";
import {
  ISelectorItemProps,
  SelectorCommonV2
} from "@/components/SelectorCommonV2";
import pattern from "@/styles/pattern";

export function DetectionAttack() {
  const typeList = [
    {
      label: "哈希",
      value: "hash"
    }
  ];
  const [inputVal, setInputVal] = useState("");
  const [resultContent, setResultContent] = useState(``);
  const [loading, setLoading] = useState(false);

  const start = () => {
    if (!inputVal) {
      notification.warning({ message: `请输入必要信息!!!` });
      return;
    }
    setLoading(true);
    const params = {
      inputVal
    };
    console.log("params>>>>", params);
    setTimeout(() => {
      setResultContent(`
      ----------------------------------------------------------------------------------------------------
  Building block 14802397 finished in 0:00:00.004796, now starting to analyze block 14802397 for insertion attacks...
  Block 14802397 analyzed for insertion,
  total number of transactions in the block = 474, attacks found = 0.
  Time elapsed = 0:00:00.002022
  
  Insertion analysis finished.
  Now starting to analyze block 14802397 for supression attacks...
  Block 14802397 analyzed for suppression,
  total number of transactions in the block = 474, attacks found = 0.
  Time elapsed = 0:00:00.001687
  
  Supression analysis finished.
  Analyzing block 14802397 finished.
  
  ----------------------------------------------------------------------------------------------------
  Building block 14682530 finished in 0:00:00.002774, now starting to analyze block 14682530 for insertion attacks...
  ********************************************************************************
  Found insertion attack!!!
  In block: 0xccf46fe281d566f83d595d1dd6103378c10cec2322eeef1fa071da25c558522e
  gains: 136097830307535089
  frontrunning transaction:
  tx_hash: 0xd5d9b334443406ad1df20880ba5ef1d06a6e2024ac3d0fd55747ad8f129bef7c, from:
  0x7F2944C87183a924d443985649c997f3320D4E5F, to: 0x00000000002d383933aa1609F11d0AFA4D5Ea90A
  backrunning transaction:
  tx_hash: 0x57d03a291faa8f0f1f38e835ee8b21b2ef4495baadfcf70135db2ca14552796a, from:
  0x922Af2498aE44a719da89212658d14c67D35F3f8, to: 0x00000000002d383933aa1609F11d0AFA4D5Ea90A
  victim transaction:
  tx_hash: 0x14273ef3138453f258c39298fd23b1c7c7c25db8360dd174b23b22deeb199bb6, from:
  0xdBfE219DB4206B8CE06694aFdb41C8052328d84c, to: 0xDF1A1b60f2D438842916C0aDc43748768353EC25,
  input amount = 1495500000000000000 wei
  ********************************************************************************
  Block 14682530 analyzed,
  total number of transactions in the block = 247, attacks found = 1, percentage = 0.404858%.
  max gain: 136097830307535089 from Attack#1;
  min gain: 136097830307535089 from Attack#1.
  most frequent t1 to address: 0x7F2944C87183a924d443985649c997f3320D4E5F;
  most frequent t1 from address: 0x00000000002d383933aa1609F11d0AFA4D5Ea90A.
  most frequent t2 to address: 0x922Af2498aE44a719da89212658d14c67D35F3f8;
  most frequent t2 from address: 0x00000000002d383933aa1609F11d0AFA4D5Ea90A.
  Number of victim transactions = 1, max victim transaction input = 1495500000000000000.
  Time elapsed = 0:00:00.002927.
  
  t1's hash: ['0xd5d9b334443406ad1df20880ba5ef1d06a6e2024ac3d0fd55747ad8f129bef7c']
  t2's hash: ['0x57d03a291faa8f0f1f38e835ee8b21b2ef4495baadfcf70135db2ca14552796a']
  gains: [136097830307535089]
  Insertion analysis finished.
  Now starting to analyze block 14682530 for supression attacks...
  Block 14682530 analyzed for suppression,
  total number of transactions in the block = 247, attacks found = 0.
  Time elapsed = 0:00:00.000779
  
  Supression analysis finished.
  Analyzing block 14682530 finished.
  
  Number of blocks analyzed = 2, number of transactions scanned = 721.
  Frontrunning attack analysis finished, now exit.
  Program elapsed time = 0:00:00.016623`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={cn(" w-full h-full  pt-[0px]", `${pattern.flexbet} `)}>
      <div
        className={`left  w-[calc(50%)] h-full flex justify-center align-top `}
      >
        <div
          className={cn(
            `w-[662px] h-[258px] bg-[url('./assets/attackBg1.png')] bg-cover bg-center relative `
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
                <ButtonCommonV2
                  onClick={() => {
                    start();
                  }}
                >
                  <span className="text-[#FFFFFF] text-[16px]">开始检测</span>
                </ButtonCommonV2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`right  w-[calc(50%)] h-full flex justify-center align-top `}
      >
        <div className="pt-[80px] px-[20px] pb-[20px] right w-[778px] h-[760px]  bg-[url('./assets/privacyBg2.png')] bg-cover bg-center ">
          <div className="w-full h-full relative overflow-auto">
            <span className="text-[#FFFFFF] text-[16px]">
              {resultContent}
            </span>
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
  );
}
