/* eslint-disable prettier/prettier */
/*
 * @Description: 输入框-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 10:54:17
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

import pattern from "@/styles/pattern";

interface IProps {
  onInput: (value: string) => void;
  className?: string;
  placeholder: string;
}

export function InputCommon(props: IProps) {
  const { className, placeholder, onInput } = props;
  const [value, setValue] = useState("");
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
        "text-textFourthSize relative h-full w-full select-none ",
        `bg-[url('./assets/privacyBgSelector.png')] bg-cover bg-center pl-4 pr-[10px] `,
        className
      )}
    >
      <input
        onChange={e => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full h-full bg-transparent text-[16px] text-[#ffffff] border-0 outline-none"
      />
    </div>
  );
}
