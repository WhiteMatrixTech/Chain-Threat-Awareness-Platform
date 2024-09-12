/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 18:22:50
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-12 14:55:53
 */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import { useEffect, useRef,useState } from "react";
import { useNavigate } from "react-router";
import { useClickAway } from "react-use";

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
  const ref = useRef<HTMLDivElement | null>(null);

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
  useClickAway(ref, () => {
    setArrowRotate("");
  });


  return (
    <div className={`flex  ml-[24px] 3xl:ml-[74px] h-full px-[9px]`}
    ref={ref}
    >
      {MenuList &&
        MenuList.map((item: any, index) =>
        item.key?   (
            <div
              key={index}
              className={cn(
                `min-w-[146px] h-[64px]  py-[13px] px-[19px] ${pattern.flexCenter} hover:cursor-pointer relative`,
                activeNav === item.key
                  ? "bg-[#3BA4FF33] border-[2px] border-solid border-[#3BA4FF]"
                  : ""
              )}
            >
              <div
                className={cn(
                  ` ${pattern.flexCenter} min-w-[130px] h-full  text-[24px] font-[500] text-[#EFF4FF] `,

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
                  {/* 待ui更新图 */}
                  {item.src && (
                    <div className={` mr-2 w-[30px] h-[30px] ${pattern.flexCenter}`}>
                      <img src={item.src}  alt="" className="" />
                   </div>                
                )}
    
                <span className="select-none">
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
                  <ul className="py-[8px] w-[289px] absolute top-[68px] left-[0px] bg-[#07266A] z-[100] duration-300">
                    {item.children.map((liItem: any, liIndex: number) => (
                      <li key={liIndex} className={`px-[16px] flex justify-start items-center select-none w-full h-[34px] hover:cursor-pointer hover:bg-[#0083CF]`}
                        onClick={() => {
                          setArrowRotate("");
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
              key={index}

            >
              <img className="" src={SplitPg} width={1} height={24} />
            </div>
          )

        )}
    </div>
  );
}
