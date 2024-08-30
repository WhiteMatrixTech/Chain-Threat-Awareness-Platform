/* eslint-disable prettier/prettier */
/*
 * @Description: 输入框-赛博朋克风,自适应width,textarea版本
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-30 10:26:16
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

import TextAreaBg from "@/assets/textareabg1.png";
import pattern from "@/styles/pattern";

interface IProps {
  initVal?: string;
  onInput: (value: string) => void;
  className?: string;
  placeholder: string;
}

export function InputCommonV3(props: IProps) {
  const { className, placeholder, initVal, onInput } = props;
  const [value, setValue] = useState(initVal || "");
  useDebounce(
    () => {
      onInput(value);
    },
    200,
    [value]
  );
  return (
    <div
      className={cn(
        `${pattern.flexCenter}`,
        className,
        `bg-[url('./assets/textareabg1.png')] bg-cover bg-center relative`
      )}
    >
      <textarea
        placeholder={placeholder}
        onChange={e => {
          setValue(e.target.value);
        }}
        className="px-3 py-2 w-full h-full  bg-transparent text-[16px] text-[#ffffff] border-0 outline-none"
      />
    </div>
  );
}
