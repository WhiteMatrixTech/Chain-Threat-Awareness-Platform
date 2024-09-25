/* eslint-disable prettier/prettier */
/*
 * @Description: 输入框-赛博朋克风,自适应width
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-25 16:29:34
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

import pattern from "@/styles/pattern";

interface IProps {
  initVal?: string;
  onInput: (value: string) => void;
  className?: string;
  placeholder: string;
}

export function InputCommonV2(props: IProps) {
  const { className, placeholder, initVal, onInput } = props;
  const [value, setValue] = useState(initVal || "");
  useDebounce(
    () => {
      onInput(value);
    },
    200,
    [value]
  );
  useEffect(
    () => {
      setValue(initVal || "");
    },
    [initVal]
  );
  return (
    <div className={cn(`${pattern.flexCenter}`, className)}>
      <div
        className={cn(
          " text-textFourthSize relative h-[36px] w-[calc(100%_-_12px)] select-none pl-4 pr-[10px] ",
          `border-[1px] border-solid border-[#00A0E9] border-l-0 border-r-0`
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
        <input
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full h-full bg-transparent text-[16px] text-[#ffffff] border-0 outline-none"
        />
      </div>
    </div>
  );
}
