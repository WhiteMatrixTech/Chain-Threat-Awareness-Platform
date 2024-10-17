/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-12 16:29:20
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-17 15:42:23
 */
import cn from "classnames";
import { useEffect, useState } from "react";

export function Progress() {
  const [progress, setProgress] = useState(0);
  const [suffix, setSuffix] = useState("");
  const total = 520;
  useEffect(() => {
    const suffixTimer = setInterval(() => {
      setSuffix(prevText => {
        if (prevText === "") {
          return ".";
        } else if (prevText === ".") {
          return "..";
        } else if (prevText === "..") {
          return "...";
        } else {
          return "";
        }
      });
    }, 500);
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < total) {
          const step = Math.random() * total;
          if (prevProgress + step < total) {
            return prevProgress + step; // 每次增加10%
          } else {
            return prevProgress + 1;
          }
        } else {
          clearInterval(timer); // 达到100%后清除定时器
          return total;
        }
      });
    }, 2000);
    return () => {
      clearInterval(timer);
      clearInterval(suffixTimer);
    };
  }, []);
  return (
    <div className={cn(` flex h-full w-full items-center justify-center `)}>
      <div className=" w-[600px] flex flex-col items-center">
        <div className="h-[22px] w-full flex justify-center items-center ">
          <span className="text-[18px] text-[#FFFFFF]">
            {"内容加载中" + suffix}
          </span>
        </div>

        <div className="container h-[10px] w-full flex justify-between items-center mt-[10px]">
          <div className="  h-full w-[540px] bg-[#02004D4D] rounded-[10px] py-[1px] px-[1px]">
            <div
              className="child h-full bg-[#1EAAFB] rounded-[10px]"
              style={{ width: progress }}
            />
          </div>
          <div className="w-[50px] h-full flex items-center justify-end">
            <span className="text-[12px] text-[#ffffff]">
              {(progress / 540 * 100).toFixed(0)} %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
