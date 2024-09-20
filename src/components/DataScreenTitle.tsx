/* eslint-disable prettier/prettier */
/*
 * @Description: 
 * @Author: didadida262
 * @Date: 2024-09-20 15:18:48
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-20 15:24:39
 */
import cn from "classnames";

import dataScreen_icon_dot from "@/assets/dataScreen_icon_dot.png";

interface IPropsInterface {
  imgSrc: any;
  title: string;
}
export function DataScreenTitle(props: IPropsInterface) {
  const { imgSrc, title } = props;
  return (
    <div
      className={cn(
        " flex h-[40px]  w-full items-center justify-between py-[7.5px] pl-[20px] pr-[18.5px]",
        ` bg-[#061B5A] bg-opacity-30 `,
        `border-l-solid border-l-[6px] border-l-[#00FFD1]`
      )}
    >
      <div className="flex h-full w-[calc(80%)] items-center justify-start">
        <div className="mr-[10px]">
          <img src={imgSrc} alt="" width={24} height={25} />
        </div>
        <span className="text-[22px] text-[#EFF4FF]">
          {title}
        </span>
      </div>
      <div className="flex h-full w-[calc(20%)] items-center justify-end">
        <img src={dataScreen_icon_dot} alt="" width={4} height={3} />
      </div>
    </div>
  );
}
