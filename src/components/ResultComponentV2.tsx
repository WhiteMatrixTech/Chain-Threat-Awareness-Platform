/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 18:03:52
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 18:10:54
 */
/* eslint-disable prettier/prettier */

import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import pattern from "@/styles/pattern";

interface IProps {
  title: string;
  className?: string;
}

export function ResultComponentV2(props: IProps) {
  const { title, className } = props;
  return (
    <div
      className={cn(`flex h-full w-full items-center justify-start`, className)}
    >
      <div
        className={cn(
          `h-full w-full ${pattern.flexStart} bg-[#0095FF66] px-5`,
          `border-[3px] border-t-0 border-r-0 border-b-0 border-solid border-[#00A0E9]`
        )}
      >
        <span className="text-[16px] text-[#ffffff]">
          {title}
        </span>
      </div>
    </div>
  );
}
