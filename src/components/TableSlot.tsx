/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/*
 * @Description: 表格组件，支持插槽版本
 * @Author: didadida262
 * @Date: 2024-08-27 18:34:53
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-19 16:38:13
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { notification } from "antd";
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
  const getCurrentColWidth = () => {
    const confirmedWidthItems = columns.filter(item => !!item.width);
    const flexNum = columns.length - confirmedWidthItems.length;
    const usedWidth = confirmedWidthItems.reduce((total, current) => {
      return total + current.width;
    }, 0);
    return [usedWidth, flexNum];
  };
  const usedWidth = getCurrentColWidth()[0];
  const flexNum = getCurrentColWidth()[1];
  const curretnColWidth = {
    width: `calc((100% - ${usedWidth}px) / ${flexNum})`
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
          `header flex bg-[#00D2D51A] h-[40px] items-center w-full`
        )}
      >
        {columns &&
          columns.map((col: any, colkey: number) =>
            <div
              className={cn("px-[16px] ")}
              style={
                col.width
                  ? { width: `${col.width}px` }
                  : // : { width: getCurrentColWidth(col) }
                    curretnColWidth
              }
              key={colkey}
            >
              <span className={cn("text-[15px] text-[#ffffff]")}>
                {col.title}
              </span>
            </div>
          )}
        {/* {operationColumn &&
          <div
            className={cn(
              "px-[16px] w-[100px]",
              "border-solid border-0 border-l-[2px] border-[#0E47A5]"
            )}
          >
            <span className={cn("text-[15px] text-[#ffffff]")} />
          </div>} */}
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
                    col.slot
                      ? <div
                          style={
                            col.width
                              ? { width: `${col.width}px` }
                              : curretnColWidth
                          }
                          className={cn(
                            ` px-[16px] flex items-center relative group text-[15px] text-[#ffffff] `
                          )}
                          key={colkey}
                        >
                          <div className={cn("px-[16px] w-full h-full")}>
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
                                <img
                                  src={plus_icon}
                                  alt=""
                                  width={28}
                                  height={28}
                                />
                                <img
                                  className="absolute top-0 left-0 hidden group-hover:block"
                                  src={plus_light_icon}
                                  alt=""
                                  width={28}
                                  height={28}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      : <div
                          style={
                            col.width
                              ? { width: `${col.width}px` }
                              : curretnColWidth
                          }
                          className={cn(
                            ` px-[16px] flex items-center relative group text-[15px] text-[#ffffff] `
                          )}
                          key={colkey}
                          onClick={() => {
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
              {/* {operationColumn &&
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
                </div>} */}
            </div>
          )}
        {/* {!data.length &&
          <div className={cn(` w-full h-[calc(100%_-_40px)] `)}>暂无数据....</div>} */}

        {data.length !== 0 &&
          footer &&
          <div className={cn(`w-full  footer px-[16px]`)}>
            {footer}
          </div>}
      </div>
    </div>
  );
}
