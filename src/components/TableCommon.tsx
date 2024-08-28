/* eslint-disable prettier/prettier */
/*
 * @Description: selector-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 14:53:22
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
    <div className={cn("h-full w-full", className)}>
      <div className="table w-full bg-[#02004D4D] max-h-[calc(100%_-_40px)] px-[20px] py-[20px] border-[2px] border-solid border-[#0D53B7]">
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
        <div className="content w-full ">
          {data &&
            data.map((item: any, index: number) =>
              <div
                className="w-full h-[40px] flex border-solid border-[0px] border-b-[1px] border-[#083FAA]"
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
        </div>
      </div>
    </div>
  );
}