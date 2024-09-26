/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/*
 * @Description: selector-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-25 16:30:01
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import pattern from "@/styles/pattern";

interface IProps {
  columns: any[];
  data: any[];
  className?: string;
  pageInfo: any;
}
const maxcharNum = 40;
export function TableCommon(props: IProps) {
  const { data, columns, pageInfo, className } = props;
  const getCurrentColWidth = (col: any) => {
    const used = columns
      .filter(item => item.dataIndex !== col.dataIndex)
      .reduce((total, current) => {
        return total + current.width;
      }, 0);
    return `calc(100% - ${used}px)`;
  };

  return (
    <div
      className={cn(
        "h-full w-full px-5 py-5",
        className,
        "bg-[#02004D4D]",
        `border-[2px] border-solid border-[#0D53B7]`
      )}
    >
      <div
        className={cn(
          `header flex bg-[#00D2D51A] h-[40px] items-center w-full `
        )}
      >
        {columns &&
          columns.map((col: any, colkey: number) =>
            <div
              className={cn("px-[16px] ")}
              style={
                col.width
                  ? { width: col.width }
                  : { width: getCurrentColWidth(col) }
              }
              key={colkey}
            >
              <span className={cn("text-[15px] text-[#ffffff]")}>
                {col.title}
              </span>
            </div>
          )}
      </div>
      <div className="content w-full h-[calc(100%_-_40px)] ">
        {data &&
          data.map((item: any, index: number) =>
            <div
              className={cn(
                `w-full h-[40px] flex border-solid border-[0px] border-b-[1px] border-[#083FAA]`,
                "hover:bg-[#0000001A]"
              )}
              key={index}
            >
              {columns &&
                columns.map(
                  (col: any, colkey: number) =>
                    col.width
                      ? <div
                          style={{ width: col.width }}
                          className={cn(
                            `px-[16px] flex items-center relative group text-[15px] text-[#ffffff] `
                          )}
                          key={colkey}
                        >
                          <span className="w-full h-full truncate leading-[40px]">
                            {col.dataIndex ? item[col.dataIndex] : index + 1}
                          </span>
                        </div>
                      : <div
                          style={{ width: getCurrentColWidth(col) }}
                          className={cn(
                            ` px-[16px] flex items-center relative group text-[15px] text-[#ffffff] `
                          )}
                          key={colkey}
                        >
                          <span className="w-full h-full truncate leading-[40px]">
                            {col.dataIndex ? item[col.dataIndex] : index + 1}
                          </span>
                          {item[col.dataIndex] &&
                            item[col.dataIndex].length > maxcharNum &&
                            <div className="px-3 py-3 rounded-sm hidden group-hover:block  absolute top-[38px] left-0 w-[500px] bg-[#2A6CB6] z-10">
                              <span
                                className={cn("text-[12px] text-[#ffffff]")}
                              >
                                {item[col.dataIndex]}
                              </span>
                            </div>}
                        </div>
                )}
            </div>
          )}
        {!data.length &&
          <div className={cn(` w-full h-[calc(100%_-_40px)] `)}>暂无数据....</div>}
      </div>
    </div>
  );
}
