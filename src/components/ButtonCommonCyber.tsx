/*
 * @Description: btn-赛博朋克风
 * @Author: didadida262
 * @Date: 2024-08-28 10:55:15
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-05 23:56:33
 */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import React, { MouseEvent, ReactNode, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import pattern from "@/styles/pattern";

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
export function ButtonCommonCyber(props: IButtonProps) {
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
        "py-[8px] px-[18px] bg-themePrimary rounded-md",
        // `bg-[url('./assets/privacyBgButton.png')] bg-cover bg-center `,
        disable
          ? "cursor-not-allowed opacity-75"
          : "opacity-100 hover:cursor-pointer",
        `${pattern.flexCenter}`,
        className
      )}
    >
      {children}
    </div>
  );
}
