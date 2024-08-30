/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 11:53:05
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 14:13:51
 */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import pattern from "@/styles/pattern";

interface IProps {
  title: string;
  content: string;
  className?: string;
}

export function ResultComponent(props: IProps) {
  const { title, content, className } = props;
  return (
    <div className={cn(`flex h-full w-full gap-x-1`, className)}>
      <div
        className={cn(
          `h-full max-w-[240px] ${pattern.flexCenter} bg-[#0095FF66] px-5`,
          `border-[3px] border-t-0 border-r-0 border-b-0 border-solid border-[#00A0E9]`
        )}
      >
        <span className="text-[16px] text-[#ffffff]">
          {title}
        </span>
      </div>
      <div
        className={cn(`flex h-full flex-1 items-center bg-[#0095FF66] pl-3`)}
      >
        <span className="text-[16px] text-[#ffffff]">
          {content}
        </span>
      </div>
    </div>
  );
}
