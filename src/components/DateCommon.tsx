/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description: datePicker,待开发....
 * @Author: didadida262
 * @Date: 2024-08-28 18:23:07
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 00:59:22
 */
/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DatePicker } from "antd";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

import DatePickerLogo from "@/assets/datePickerLogo.png";
import pattern from "@/styles/pattern";

interface IProps {
  onSelect: (date: any) => void;
  className?: string;
}

export function DateCommon(props: IProps) {
  const { className, onSelect } = props;
  const { RangePicker } = DatePicker;
  const [startTime, setStartTime] = useState("开始时间");
  const [endTime, setEndTime] = useState("结束时间");

  return (
    <div
      className={cn(
        "text-textFourthSize relative h-full w-calc(100%_-_12px) select-none pl-4 pr-[10px] ",
        `border-[1px] border-solid border-[#00A0E9] border-l-0 border-r-0`,
        // `bg-[url('./assets/privacyBgSelector.png')] bg-cover bg-center`,
        className
      )}
    >
      <div
        className={cn(
          "w-[10px] h-[36px]",
          "absolute left-[-4px] top-[-1px]",
          `bg-[url('./assets/inputLeft.png')] bg-cover bg-center`
        )}
      />
      <div
        className={cn(
          "w-[21px] h-[36px]",
          "absolute right-[-8px] top-[-1px]",
          `bg-[url('./assets/inputRight.png')] bg-cover bg-center`
        )}
      />
      <div className={cn(` w-full h-full  ${pattern.flexbet}`)}>
        <img className="mr-[8px]" src={DatePickerLogo} width={20} height={20} />
        <div
          className={cn(
            "text-[16px] text-[#ffffff] flex-1 flex h-full justify-around items-center"
          )}
        >
          <span className="">
            {startTime}
          </span>
          <span className="">-</span>
          <span className="">
            {endTime}
          </span>
        </div>
      </div>
      <div className="absolute top-0 left-0  opacity-0">
        <RangePicker
          size="middle"
          className={cn("")}
          onChange={(dataInfo:any) => {
            console.log("data>>", dataInfo);
            setStartTime(dataInfo[0]?.format('YYYY-MM-DD'))
            setEndTime(dataInfo[1]?.format('YYYY-MM-DD'))
            onSelect(dataInfo);
          }}
        />
      </div>
    </div>
  );
}
