/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/*
 * @Description: selector-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 15:49:12
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import arrowLeft from "@/assets/arrowleft.png";
import arrowRight from "@/assets/arrowright.png";
import pattern from "@/styles/pattern";

interface IProps {
  className?: string;
  pageInfo: any;
  handleEvent: (params: any) => void;
}

export function PageCommon(props: IProps) {
  const { pageInfo, handleEvent, className } = props;
  useEffect(
    () => {
      console.log("pageInfo变化");
    },
    [pageInfo]
  );

  return (
    <div className={cn(`w-[200px] h-[20px] flex items-center gap-x-[10px]`)}>
      <div className={cn(`${pattern.flexCenter} info w-[50px] h-full`)}>
        <span className="text-[15px] text-[#ffffff]">
          共{pageInfo.total}条
        </span>
      </div>
      <div className={cn(`num  flex-1 flex gap-x-[10px]  h-full select-none`)}>
        <div
          className={cn(
            `arrowleft w-[20px] h-full  ${pattern.flexCenter}  hover:cursor-pointer`
          )}
          onClick={() => {
            if (pageInfo.currentPage === 0) return;
            handleEvent({
              ...pageInfo,
              currentPage: pageInfo.currentPage - 1
            });
          }}
        >
          <img className="" src={arrowLeft} width={6} height={7} />
        </div>
        <div
          className={cn(
            `numContent flex items-center gap-x-[19px] flex-1 h-full `
          )}
        >
          {[1, 2, 3].map((item, index) =>
            <div key={index} className={cn(" hover:cursor-pointer")}>
              <span
                className={cn(
                  "text-[15px] text-[#ffffff]",
                  pageInfo.currentPage === item ? "opacity-100" : "opacity-60"
                )}
                onClick={() => {
                  handleEvent({
                    ...pageInfo,
                    currentPage: item
                  });
                }}
              >
                {item}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            `arrowright w-[20px] h-full  ${pattern.flexCenter}  hover:cursor-pointer`
          )}
          onClick={() => {
            if (pageInfo.currentPage === 3) return;
            handleEvent({
              ...pageInfo,
              currentPage: pageInfo.currentPage + 1
            });
          }}
        >
          <img className="" src={arrowRight} width={6} height={7} />
        </div>
      </div>
    </div>
  );
}
