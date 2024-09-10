/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Description: 模型表格
 * @Author: didadida262
 * @Date: 2024-08-29 13:47:01
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-10 14:30:48
 */
/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { notification } from "antd";
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
  const getCurrentColWidth = (col: any) => {
    const used = columns
      .filter(item => item.dataIndex !== col.dataIndex)
      .reduce((total, current) => {
        return total + current.width;
      }, 0);
    // const flexNum = columns.filter(item => item.dataIndex !== col.dataIndex)
    //   .length;
    return `calc(100% - ${used}px)`;
  };
  return (
    <div
      className={cn(
        "px-5 py-5 bg-[#02004D4D] ",
        `border-[2px] border-solid border-[#0D53B7]`,
        className,
        `overflow-scroll`
      )}
    >
      {/* 表头 */}
      <div className={cn(`w-full h-[40px] flex px-4 bg-[#0095FF66]`)}>
        {columns &&
          columns.map((col: any, colkey: number) =>
            <div
              className={cn(
                "flex-shrink-0 px-3 flex items-center justify-start "
              )}
              style={
                col.width
                  ? { width: `${col.width}px` }
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
      {data &&
        data.length !== 0 &&
        <div className="content w-full h-[calc(100%_-_40px)] ">
          {data &&
            data.map((item: any, index: number) =>
              <div
                className={cn(
                  `w-full h-[40px] flex px-4 `,
                  "hover:bg-[#00D2D51A]",
                  ` border-solid border-[0px] border-b-[1px] border-[#0095FF66]`
                )}
                key={index}
              >
                {columns.map((col: any, colkey: number) =>
                  <div
                    style={
                      col.width
                        ? { width: `${col.width}px` }
                        : { width: getCurrentColWidth(col) }
                    }
                    className={`flex-shrink-0 px-3 flex items-center justify-start  text-[15px] text-[#ffffff] `}
                    key={index + "_" + colkey}
                    onClick={() => {
                      console.log("点击>>>", item[col.dataIndex]);
                      const textArea = document.createElement("textarea");
                      textArea.value = item[col.dataIndex];
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      notification.info({ message: "复制成功!!!" });
                    }}
                  >
                    <span className="w-full h-full truncate leading-[40px]">
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
