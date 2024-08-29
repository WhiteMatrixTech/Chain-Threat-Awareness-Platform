/*
 * @Description: 纯展示tag
 * @Author: didadida262
 * @Date: 2024-08-29 15:19:03
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 16:07:07
 */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";

import pattern from "@/styles/pattern";

interface IProps {
  title: string;
  className?: string;
}

export function TagComponent(props: IProps) {
  const { className = "", title } = props;

  return (
    <div
      className={cn(
        `${pattern.flexCenter} `,
        className,
        `bg-[url('./assets/crosschainbg1.png')] bg-center bg-contain bg-no-repeat`
      )}
    >
      {/* <div
        className={cn(
          "text-textFourthSize relative h-full w-[calc(100%_-_12px)] select-none ",
          `border-[1px] border-solid border-[#00A0E9] border-l-0 border-r-0`,
          `${pattern.flexCenter}`
        )}
      >
        <div
          className={cn(
            "w-[10px] h-[36px]",
            "absolute left-[-4px] top-[-1px]",
            `bg-[url('./assets/inputLeft.png')] bg-cover bg-center`
          )}
        />
        <div
          className={cn(
            "w-[21px] h-[36px]",
            "absolute right-[-8px] top-[-1px]",
            `bg-[url('./assets/inputRight.png')] bg-cover bg-center`
          )}
        />
        <span className=" text-[#FFFFFF] text-[16px]">
          {title}
        </span>
      </div> */}
      <span className=" text-[#FFFFFF] text-[16px]">
        {title}
      </span>
    </div>
  );
}
