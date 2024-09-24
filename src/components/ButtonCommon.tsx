/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import cn from "classnames";
import React, {
  MouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import LoadingSvg from "@/assets/loading.png";

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
  title?: string;
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disable?: boolean;
  buttonType?: "submit" | "reset" | "button";
}
export function ButtonCommon(props: IButtonProps) {
  const [progress, setprogress] = useState(50);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const [total, settotal] = useState(250);
  let timer: any = null;

  const {
    className,
    children,
    type = EButtonType.PRIMARY,
    loading = false,
    title,
    onClick,
    buttonType,
    disable = false
  } = props;
  const [cls, bpopbg] = useMemo(
    () => {
      const resultArray = [
        " flex items-center justify-center focus:outline-none px-[16px] py-[8px]"
      ];
      const popBg = ["border-t-[#333c4a]"];
      switch (type) {
        case EButtonType.PRIMARY:
          resultArray.push(
            "bg-bgFourthColor bg-btnPrimaryHover hover:opacity-75"
          );
          break;
        case EButtonType.GHOST:
          resultArray.push("bg-[#475062] hover:opacity-75");
          popBg.push("border-t-[#475062]");
          break;
        case EButtonType.BLANK:
          resultArray.push(
            "bg-[#21222D] border-[#3272C7] border-[1px] hover:opacity-75 text-[#3272C7]"
          );
          popBg.push("border-t-[#21222D]");
          break;
        case EButtonType.SIMPLE:
          resultArray.push(
            "bg-inherit border-borderSecondColor border-[1px] border-solid hover:opacity-75 text-textPrimaryColor"
          );
          popBg.push("border-t-[#21222D]");
          break;
        default:
          break;
      }
      return [resultArray.join(" "), popBg.join(" ")];
    },
    [type]
  );
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(
    () => {
      if (loading) {
        console.warn("定时器启动>>>>");
        timer = setInterval(() => {
          setprogress(prevProgress => {
            console.warn("total>>>>", total);
            console.warn("prevProgress>>>>", prevProgress);

            if (prevProgress < total) {
              const step = Math.random() * total;
              if (prevProgress + step < total) {
                return prevProgress + step; // 每次增加10%
              } else {
                return prevProgress + 1;
              }
            } else {
              clearInterval(timer); // 达到100%后清除定时器
              return total;
            }
          });
        }, 1000);
      } else {
        if (timer) {
          clearInterval(timer);
        }
      }
    },
    [loading]
  );
  useEffect(() => {
    if (buttonContainerRef.current) {
      console.log("wonima>>>", buttonContainerRef.current.clientWidth);
      settotal(buttonContainerRef.current.clientWidth - 20);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);
  return (
    <div className="relative" ref={buttonContainerRef}>
      <button
        type={buttonType}
        onClick={e => {
          if (!loading && onClick && !disable) {
            onClick(e as any);
          }
        }}
        onMouseMove={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={cn(
          cls,
          "fontBtn",
          " whitespace-nowrap",
          disable ? "cursor-not-allowed opacity-75" : "opacity-100",
          className
        )}
      >
        {children}
        {loading &&
          <img
            src={LoadingSvg}
            width={15}
            height={15}
            className="ml-2 animate-spin"
          />}
        {loading &&
          <div className="w-full h-[5px] bg-[#0000001A] absolute left-0 bottom-[-5px] flex justify-start items-center px-[1px]">
            <div
              className="child w-[calc(95%)] h-[3px] bg-[#1EAAFB] rounded-[5px]"
              style={{ width: progress }}
            />
          </div>}
      </button>
      {isHover &&
        title &&
        <div className="absolute right-[50%] -top-[30px] z-[200] translate-x-[50%] whitespace-nowrap rounded-[4px] bg-[#333c4a] px-3 py-1">
          <div
            className={cn(
              bpopbg,
              "absolute right-[50%] bottom-0 h-0 w-0 translate-y-[100%] border-[5px] border-solid border-x-transparent  border-b-transparent opacity-75"
            )}
          />
          {title}
        </div>}
    </div>
  );
}
