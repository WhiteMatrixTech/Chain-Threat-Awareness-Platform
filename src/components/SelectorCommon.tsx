/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-07-16 21:48:47
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-26 18:00:29
 */
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import pattern from '../styles/pattern';

export interface ISelectorItemProps {
  value: number | string;
  label: string;
}

interface ISelectorProps {
  value: ISelectorItemProps;
  setValue: (value: ISelectorItemProps) => void;
  className?: string;
  options: ISelectorItemProps[];
}

export function SelectorCommon(props: ISelectorProps) {
  const { value, setValue, className, options } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [activeValue, setActiveValue] = useState() as any;

  useClickAway(ref, () => {
    setShow(false);
  });
  useEffect(() => {
    if (value?.value) {
      setActiveValue(value.value);
    }
  }, [value]);
  return (
    <div
      className={cn(
        'text-textFourthSize relative w-[120px] select-none',
        className
      )}
      ref={ref}
    >
      <div
        onClick={() => {
          setShow(!show);
        }}
        className="border-borderUlColor bg-bgUlColor flex h-[36px] w-full shrink-0 cursor-pointer items-center justify-between whitespace-nowrap rounded-[4px] border-[1px] border-solid pl-4 pr-[10px]"
      >
        <span className="text-textFifthSize text-textThirdColor line-clamp-1 w-[80px]">
          {value.label}
        </span>
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
              'text-textTertiaryColor origin-center duration-300',
              show && 'rotate-180'
            )}
          />
        </svg>
      </div>
      <ul
        className={cn(
          'border-borderFirstColor bg-bgUlColor absolute top-[40px] max-h-[144px] w-full flex-col overflow-y-auto rounded-[4px] border-[1px] border-solid duration-300',
          'chain-select',
          show
            ? 'shadow-common z-10 flex opacity-100'
            : '-z-10 hidden opacity-0'
        )}
      >
        {options.map((item: ISelectorItemProps) => {
          return (
            <li
              key={item.value}
              onClick={() => {
                setValue(item);
                setShow(false);
              }}
              className={cn(
                `text-textFifthSize hover:bg-bgLinkHoverColor flex h-[36px] cursor-pointer items-center gap-x-[6px] overflow-y-auto pl-4`,
                item.value === activeValue && 'bg-bgLinkHoverColor'
              )}
            >
              <span className="text-textFifthSize text-textSixColor">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
