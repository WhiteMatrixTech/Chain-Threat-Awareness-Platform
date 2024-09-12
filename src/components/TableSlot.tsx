/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/*
 * @Description: 表格组件，支持插槽版本
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-12 17:44:52
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

import plus_icon from "@/assets/plus.png";
import plus_light_icon from "@/assets/plus_light.png";
import pattern from "@/styles/pattern";

interface IProps {
  columns: any[];
  data: any[];
  className?: string;
  pageInfo: any;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  operationColumn?: React.ReactNode;
  handleEvent: (data: any) => void;
}
const maxcharNum = 40;
export function TableSlot(props: IProps) {
  const {
    data,
    columns,
    pageInfo,
    className,
    children,
    footer,
    operationColumn,
    handleEvent
  } = props;
  const getCurrentColWidth = (col: any) => {
    const used = columns
      .filter(item => item.dataIndex !== col.dataIndex)
      .reduce((total, current) => {
        return total + current.width;
      }, 0);
    return `calc(100% - ${used + 100}px)`;
  };
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
        {operationColumn &&
          <div
            className={cn(
              "px-[16px] w-[100px]",
              "border-solid border-0 border-l-[2px] border-[#0E47A5]"
            )}
          >
            <span className={cn("text-[15px] text-[#ffffff]")} />
          </div>}
      </div>
      <div className="content w-full h-[calc(100%_-_40px)] overflow-scroll">
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
                          {/* {item[col.dataIndex] &&
                            item[col.dataIndex].length > maxcharNum &&
                            <div className="px-3 py-3 rounded-sm hidden group-hover:block  absolute top-[38px] left-0 w-[500px] bg-[#2A6CB6] z-10">
                              <span
                                className={cn("text-[12px] text-[#ffffff]")}
                              >
                                {item[col.dataIndex]}
                              </span>
                            </div>} */}
                        </div>
                )}
              {operationColumn &&
                <div className={cn("px-[16px] w-[100px]")}>
                  <div
                    className={cn(
                      `w-full h-full`,
                      ` flex justify-end items-center`
                    )}
                  >
                    <div
                      className="cursor-pointer group relative"
                      onClick={() => {
                        handleEvent(item);
                      }}
                    >
                      <img src={plus_icon} alt="" width={28} height={28} />
                      <img
                        className="absolute top-0 left-0 hidden group-hover:block"
                        src={plus_light_icon}
                        alt=""
                        width={28}
                        height={28}
                      />
                    </div>
                  </div>
                </div>}
            </div>
          )}
        {!data.length &&
          <div className={cn(` w-full h-[calc(100%_-_40px)] `)}>暂无数据....</div>}

        {data.length !== 0 &&
          footer &&
          <div className={cn(`w-full  footer px-[16px]`)}>
            {footer}
          </div>}
      </div>
    </div>
  );
}
