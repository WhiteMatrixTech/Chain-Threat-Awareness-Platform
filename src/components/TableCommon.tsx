/* eslint-disable prettier/prettier */
/*
 * @Description: selector-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-03 14:23:59
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

export function TableCommon(props: IProps) {
  const { data, columns, pageInfo, className } = props;
  useEffect(
    () => {
      console.log("pageInfo变化");
    },
    [pageInfo]
  );

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
              style={col.width ? { width: col.width } : { flexGrow: 1 }}
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
                columns.map((col: any, colkey: number) =>
                  <div
                    className={cn("px-[16px]  flex items-center ")}
                    style={col.width ? { width: col.width } : { flexGrow: 1 }}
                    key={colkey}
                  >
                    <span className={cn("text-[15px] text-[#ffffff]")}>
                      {col.dataIndex
                        ? item[col.dataIndex]
                        : (pageInfo.currentPage - 1) * pageInfo.pageSize +
                          (index + 1)}
                    </span>
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
