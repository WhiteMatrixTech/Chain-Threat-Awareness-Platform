/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 18:22:50
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-26 18:38:44
 */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import { useNavigate } from "react-router";

import { MenuList } from "@/components/LeftMenu/_menu";
import pattern from "@/styles/pattern";

interface MenuItem {
  label: string;
  key: string;
  children?: [MenuItem];
}

export function Nav() {
  const navigate = useNavigate();

  return (
    <div className={`${pattern.flexbet}  ml-[74px] w-[683px] h-full px-[9px]`}>
      {MenuList &&
        MenuList.map((item: any, index) =>
          <div
            key={index}
            className={cn(
              `w-[146px] h-[64px]  py-[13px] px-[8px] ${pattern.flexCenter} hover:cursor-pointer`
            )}
          >
            <span
              className={`${pattern.flexCenter} w-full h-full bg-[#6A707C33] text-[#EFF4FF] text-[24px] font-[500]`}
              onClick={() => {
                navigate(item.key);
              }}
            >
              {item.label}
            </span>
          </div>
        )}
    </div>
  );
}
