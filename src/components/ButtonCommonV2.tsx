/*
 * @Description: btn-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-28 10:55:15
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 11:13:11
 */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import React, { MouseEvent, ReactNode, useMemo, useState } from "react";

export enum EButtonType {
  PRIMARY = "PRIMARY",
  GHOST = "GHOST",
  BLANK = "BLANK",
  SIMPLE = "simple"
}
interface IButtonProps {
  className?: string;
  children: ReactNode;
  type?: EButtonType;
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disable?: boolean;
}
export function ButtonCommonV2(props: IButtonProps) {
  const {
    className,
    children,
    type = EButtonType.PRIMARY,
    loading = false,
    onClick,
    disable = false
  } = props;

  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <div
      onClick={e => {
        if (!loading && onClick && !disable) {
          onClick(e as any);
        }
      }}
      onMouseMove={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(
        "h-[38px] py-[8px] px-[18px] hover:cursor-pointer",
        `bg-[url('./assets/privacyBgButton.png')] bg-cover bg-center `,
        disable ? "cursor-not-allowed opacity-75" : "opacity-100",
        className
      )}
    >
      {children}
      {loading &&
        // <AiOutlineLoading3Quarters className="ml-2 w-[24px] animate-spin" />
        <span>loading。。。</span>}
    </div>
  );
}
