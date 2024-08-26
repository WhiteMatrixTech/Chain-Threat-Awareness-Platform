/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 18:22:50
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-27 00:43:20
 */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router";

import ArrowPng from "@/assets/arrowNav.png";
import SplitPg from "@/assets/splitePg.png";
import { MenuList } from "@/components/LeftMenu/_menu";
import pattern from "@/styles/pattern";

interface MenuItem {
  label: string;
  key: string;
  children?: [MenuItem];
}

export function Nav() {
  const navigate = useNavigate();
  const [arrowRotate, setArrowRotate] = useState("");
  const [activeNav, setActiveNav] = useState("");

  return (
    <div className={`flex  ml-[74px] h-full px-[9px]`}>
      {MenuList &&
        MenuList.map((item: any, index) =>
        <>
          {item.key? (
            <div
              key={index}
              className={cn(
                `w-[146px] h-[64px]  py-[13px] px-[19px] ${pattern.flexCenter} hover:cursor-pointer relative`,
                activeNav === item.key
                  ? "bg-[#3BA4FF33] border-[2px] border-solid border-[#3BA4FF]"
                  : ""
              )}
            >
              <div
                className={cn(
                  `${pattern.flexCenter} min-w-[130px] h-full  text-[24px] font-[500] text-[#EFF4FF] `,
                  activeNav === item.key ? "" : "bg-[#6A707C33] "
                  // background: var(--series-3100, #EFF4FF);
                  // box-shadow: 0px 0px 8px 0px #3BA4FF;
                )}
                onClick={() => {
                  setActiveNav(item.key);
                  if (item.children && item.children.length) {
                    if (arrowRotate === item.key) {
                      setArrowRotate("");
                    } else {
                      setArrowRotate(item.key);
                    }
                  } else {
                    navigate(item.key);
                  }
                }}
              >
                <span>
                  {item.label}
                </span>
                {item.children &&
                  item.children.length &&
                  <div
                    className={cn(
                      `arrow ml-[10px] w-[12px] h-[7px] ${pattern.flexCenter} duration-200`,
                      arrowRotate === item.key ? "rotate-180" : "rotate-0"
                    )}
                  >
                    <img className="" src={ArrowPng} width={12} height={7} />
                  </div>}
              </div>
            </div>
          )  :(
            <div
              className={`w-[32px] h-full  ${pattern.flexCenter}`}
            >
              <img className="" src={SplitPg} width={1} height={24} />
            </div>
          )}
        </>

        )}
    </div>
  );
}
