/*
 * @Description: datePicker,待开发....
 * @Author: didadida262
 * @Date: 2024-08-28 18:23:07
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 18:23:32
 */
/* eslint-disable prettier/prettier */

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

export function DateCommon(props: IProps) {
  const { className, placeholder, initVal, onInput } = props;
  console.log("initVal>>>", initVal);
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
        "text-textFourthSize relative h-full w-full select-none pl-4 pr-[10px] ",
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
      <input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full h-full bg-transparent text-[16px] text-[#ffffff] border-0 outline-none"
      />
    </div>
  );
}
