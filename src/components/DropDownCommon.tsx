/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import cn from "classnames";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

import pattern from "@/styles/pattern";

interface IDropProps {
  className?: string;
  children: ReactNode;
  handleEvent: () => void;
}

export function DropDownCommon(props: IDropProps) {
  const { className, children, handleEvent } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useClickAway(ref, () => {
    setShow(false);
  });

  return (
    <div
      className={cn(
        "rounded-[4px] border-[1px] border-solid relative w-[120px] hover:cursor-pointer px-[8px] py-[8px] relative",
        className
      )}
      ref={ref}
    >
      <div
        onClick={() => {
          setShow(!show);
        }}
        className="flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap "
      >
        {children}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.9999 7.99545C16.0004 8.12349 15.9721 8.25 15.9172 8.36568C15.8624 8.48137 15.7823 8.58329 15.6828 8.66395L10.5405 12.8036C10.3871 12.9296 10.1947 12.9985 9.99622 12.9985C9.7977 12.9985 9.60534 12.9296 9.45199 12.8036L4.30962 8.51825C4.13459 8.37278 4.02452 8.16373 4.00363 7.9371C3.98273 7.71047 4.05272 7.48482 4.1982 7.3098C4.34367 7.13477 4.55272 7.0247 4.77935 7.00381C5.00598 6.98291 5.23163 7.0529 5.40665 7.19838L10.0005 11.0294L14.5944 7.32694C14.7202 7.22213 14.8734 7.15556 15.0358 7.13509C15.1983 7.11463 15.3632 7.14113 15.5111 7.21145C15.6589 7.28178 15.7835 7.39299 15.8702 7.53193C15.9568 7.67087 16.0019 7.83172 15.9999 7.99545Z"
            fill="currentColor"
            className={cn(
              "text-[#ffffff] origin-center duration-300",
              show && "rotate-180"
            )}
          />
        </svg>
      </div>
      {show &&
        <ul
          className={`${pattern.flexCenter} w-[120px] h-[34px] bg-[#2A6CB6] absolute top-[38px] left-0 `}
          onClick={() => {
            handleEvent();
          }}
        >
          <span className="text-[#ffffff] text-[16px]">退出登录</span>
        </ul>}
    </div>
  );
}
