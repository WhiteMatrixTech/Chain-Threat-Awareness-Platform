/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-02 15:35:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-02 16:09:28
 */
import cn from "classnames";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import pattern from "@/styles/pattern";

interface IProps {
  className?: string;
}

export function SpinCommon(props: IProps) {
  const { className } = props;
  return (
    <div className={cn(`w-full h-full relative`, className)}>
      <div className="absolute top-0 left-0 bg-white opacity-10 w-full h-full" />
      <div className={cn(`${pattern.flexCenter} scale-150 w-full h-full`)}>
        <span className="text-[#ffffff] text-[16px]">处理中...</span>
        {/* <AiOutlineLoading3Quarters className="animate-spin" /> */}
      </div>
    </div>
  );
}
