/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 18:22:50
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-27 14:17:54
 */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import { useEffect, useState } from "react";
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
  const [activeNav, setActiveNav] = useState(MenuList[0]?.key || '');
  useEffect(() => {
    const item = MenuList.filter((i: any) => i.key === activeNav)[0] as any
    setArrowRotate("");
    if (item && item.children && item.children.length) {
        setArrowRotate(item.key);
    } else {
      navigate(item.key);
    }
  }, [activeNav])

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
                  if (activeNav === item.key ) {
                    setArrowRotate(arrowRotate === item.key? '': item.key)
                  } else {
                    setActiveNav(item.key);

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
                {item.children && item.children.length && arrowRotate === item.key && (
                  <ul className="absolute top-[68px] left-[-15px]  w-[171px] bg-[#2A6CB6] z-1000 markBorderG">
                    {item.children.map((liItem: any, liIndex: number) => (
                      <li key={liIndex} className={`${pattern.flexCenter} w-full h-[34px] hover:cursor-pointer`}
                        onClick={() => {
                          navigate(liItem.key)
                      }}
                      >
                        <span className="text-[#ffffff] text-[16px]">{liItem.label}</span></li>
                      ))}
                  </ul>
              )}
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
