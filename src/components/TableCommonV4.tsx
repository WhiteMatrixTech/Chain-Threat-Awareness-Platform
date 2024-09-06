/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Description: 模型表格
 * @Author: didadida262
 * @Date: 2024-08-29 13:47:01
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-06 16:06:57
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
  const maxNum = 10;
  return (
    <div
      className={cn(
        "px-5 py-5 bg-[#02004D4D] ",
        `border-[2px] border-solid border-[#0D53B7]`,
        className,
        `overflow-scroll`
      )}
    >
      <div className={cn(`w-full h-[40px] flex px-4 bg-[#0095FF66]`)}>
        {columns &&
          columns.map((col: any, colkey: number) =>
            <div
              className={cn(" px-3 flex items-center justify-start ")}
              style={col.width ? { width: `${col.width}px` } : { flexGrow: 1 }}
              // style={{ width: `${col.width}px` }}
              key={colkey}
            >
              <span
                className={cn(
                  // " text-[15px] text-[#ffffff]  whitespace-nowrap overflow-hidden overflow-ellipsis"
                  " text-[15px] text-[#ffffff]  "
                )}
              >
                {col.title}
              </span>
            </div>
          )}
      </div>
      {data &&
        <div className="content w-full h-[calc(100%_-_40px)]">
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
                {columns &&
                  columns.map((col: any, colkey: number) =>
                    <div
                      className={cn(" px-3 flex items-center justify-start ")}
                      style={
                        col.width
                          ? { width: `${col.width}px` }
                          : { flexGrow: 1 }
                      }
                      // style={{ width: `${col.width}px` }}
                      key={colkey}
                    >
                      <span
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
                        className={cn(
                          // " text-[15px] text-[#ffffff]  whitespace-nowrap overflow-hidden overflow-ellipsis"
                          " text-[15px] text-[#ffffff]"
                        )}
                      >
                        {/* {col.dataIndex ? item[col.dataIndex] : index + 1} */}
                        {col.dataIndex
                          ? item[col.dataIndex] &&
                            item[col.dataIndex].length > maxNum
                            ? item[col.dataIndex].slice(0, maxNum) + "..."
                            : item[col.dataIndex]
                          : index + 1}
                      </span>
                    </div>
                  )}
              </div>
            )}
        </div>}
    </div>
  );
}
