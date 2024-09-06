/*
 * @Description: 模型表格
 * @Author: didadida262
 * @Date: 2024-08-29 13:47:01
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 23:33:35
 */
/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import pattern from "@/styles/pattern";

interface IProps {
  columns: any[];
  data: any[];
  className?: string;
}

export function TableCommonV4(props: IProps) {
  const { data, columns, className } = props;

  return (
    <div
      className={cn(
        "h-full w-full px-5 py-5 bg-[#02004D4D]",
        className,
        `border-[2px] border-solid border-[#0D53B7]`
      )}
    >
      <div
        className={cn(
          `header flex bg-[#0095FF66] h-[40px] items-center w-full `
        )}
      >
        {columns &&
          columns.map((col: any, colkey: number) =>
            <div
              className={cn("px-3  flex items-center justify-start")}
              style={col.width ? { width: col.width } : { flexGrow: 1 }}
              key={colkey}
            >
              <span className={cn("text-[15px] text-[#ffffff]")}>
                {col.title}
              </span>
            </div>
          )}
      </div>
      {data &&
        <div className="content w-full h-[calc(100%_-_40px)] overflow-scroll">
          {data &&
            data.map((item: any, index: number) =>
              <div
                className={cn(
                  `w-full h-[40px] flex`,
                  "hover:bg-[#00D2D51A]",
                  ` border-solid border-[0px] border-b-[1px] border-[#0095FF66]`
                )}
                key={index}
              >
                {columns &&
                  columns.map((col: any, colkey: number) =>
                    <div
                      className={cn(
                        "px-3 flex items-center justify-start overflow-hidden"
                      )}
                      style={col.width ? { width: col.width } : { flexGrow: 1 }}
                      key={colkey}
                    >
                      <span
                        className={cn(" text-[15px] text-[#ffffff] truncate")}
                      >
                        {col.dataIndex ? item[col.dataIndex] : index + 1}
                      </span>
                    </div>
                  )}
              </div>
            )}
        </div>}
    </div>
  );
}
