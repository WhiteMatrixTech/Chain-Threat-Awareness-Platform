/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";

import circlePng from "@/assets/dataScreenCircle.png";
import datascreenlog1 from "@/assets/datascreenlog1.png";
import datascreenlog2 from "@/assets/datascreenlog2.png";
import datascreenlog3 from "@/assets/datascreenlog3.png";
import pattern from "@/styles/pattern";

interface dataScreensProps {
  className?: string;
}

interface countryDataType {
  name: string;
  ISOCode: string;
  lat?: number;
}

export function DataScreens(props: dataScreensProps) {
  const { className } = props;

  return (
    <div
      className={cn("fadeIn w-full h-full px-32", `flex flex-col gap-y-60px`)}
    >
      <div className="h-[220px]  w-[1010px] mx-auto flex flex-col items-center">
        <div
          className={cn(
            `w-[668px] h-[66px]`,
            `bg-[url('./assets/datascreenBg1.png')] bg-cover bg-center`
          )}
        />
        <div
          className={cn(
            `w-full h-[155px]`,
            `bg-[url('./assets/datascreenBg2.png')] bg-cover bg-center`
          )}
        />
      </div>
      <div className={cn(`flex-1 w-full  flex items-center justify-around`)}>
        <div
          className={cn(
            ` w-[293px] h-full pt-[180px] flex flex-col gap-y-[25px]`
          )}
        >
          <div
            className={cn(
              `relative w-full h-[116px]  py-[21px] px-[18px] flex flex-col gap-y-[11.8px]`,
              `bg-[url('./assets/dataScreenBg3.png')] bg-cover bg-center`
            )}
          >
            <div className={cn(`absolute right-[28.24px] top-[16.2px]`)}>
              <img className="" src={datascreenlog1} width={87} height={76} />
            </div>

            <span className="text-[18px] text-[#ffffff]">监测漏洞类型</span>
            <span className="text-[30px] text-[#ffffff]">10</span>
          </div>
          <div
            className={cn(
              `relative w-full h-[116px]  py-[21px] px-[18px] flex flex-col gap-y-[11.8px]`,
              `bg-[url('./assets/dataScreenBg3.png')] bg-cover bg-center`
            )}
          >
            <div className={cn(`absolute right-[28.24px] top-[16.2px]`)}>
              <img className="" src={datascreenlog2} width={87} height={76} />
            </div>

            <span className="text-[18px] text-[#ffffff]">接入智能合约</span>
            <span className="text-[30px] text-[#ffffff]">164065</span>
          </div>
          <div
            className={cn(
              `relative w-full h-[116px]  py-[21px] px-[18px] flex flex-col gap-y-[11.8px]`,
              `bg-[url('./assets/dataScreenBg3.png')] bg-cover bg-center`
            )}
          >
            <div className={cn(`absolute right-[28.24px] top-[16.2px]`)}>
              <img className="" src={datascreenlog3} width={87} height={76} />
            </div>

            <span className="text-[18px] text-[#ffffff]">区块链项目</span>
            <span className="text-[30px] text-[#ffffff]">54646</span>
          </div>
        </div>
        <div className={cn(` w-[614px] h-full ${pattern.flexCenter}`)}>
          <img className="" src={circlePng} width={614} height={600} />
        </div>
        <div className={cn(`  w-[293px] h-full`)}>right</div>
      </div>
    </div>
  );
}
