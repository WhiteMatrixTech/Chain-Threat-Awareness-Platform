/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Description: 大屏重构
 * @Author: didadida262
 * @Date: 2024-09-03 17:58:07
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-14 10:38:13
 */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import { useEffect, useState } from "react";

import dataScreen_graph from "@/assets/dataScreen_graph.png";
import dataScreen_icon_dot from "@/assets/dataScreen_icon_dot.png";
import dataScreen_icon_type from "@/assets/dataScreen_icon_type.png";
import dataScreen_icon1 from "@/assets/dataScreen_icon1.png";
import dataScreen_icon2 from "@/assets/dataScreen_icon2.png";
import dataScreen_icon3 from "@/assets/dataScreen_icon3.png";
import dataScreen_icon4 from "@/assets/dataScreen_icon4.png";
import dataScreen_icon5 from "@/assets/dataScreen_icon5.png";
import dataScreen_icon6 from "@/assets/dataScreen_icon6.png";
import { ChartLine } from "@/components/chartLine";
import { ChartLineAddress } from "@/components/chartLineAddress";
import { Earth } from "@/components/Earth";
import pattern from "@/styles/pattern";

interface dataScreensProps {
  className?: string;
}

export function DataScreens(props: dataScreensProps) {
  const [date, setDate] = useState("2024年9月10日");
  const reg = /(?!^)(?=(\d{3})+$)/g;
  const leftTopList = [
    {
      title: "疑似钓鱼诈骗地址",
      icon: dataScreen_icon1,
      value: "5918"
    },
    {
      title: "交易所地址",
      icon: dataScreen_icon2,
      value: "374"
    },
    {
      title: "区块链项目",
      icon: dataScreen_icon3,
      value: "54,646"
    },
    {
      title: "已存储区块链数据",
      icon: dataScreen_icon4,
      value: "100,002,989"
    },
    {
      title: "接入智能合约数量",
      icon: dataScreen_icon5,
      value: "164,065"
    },
    {
      title: "平台性能开销占区块链全节点开销",
      icon: dataScreen_icon6,
      value: "3%"
    }
  ];
  const [leftBottomList, setleftBottomList] = useState([
    {
      title: "断言失败漏洞",
      value: "7.12%",
      color: "#FF3335"
    },
    {
      title: "任意存储位置存取漏洞",
      value: "17.88%",
      color: "#60B82E"
    },
    {
      title: "区块参数依赖漏洞",
      value: "1.08%",
      color: "#FF6629"
    },
    {
      title: "整数溢出漏洞",
      value: "15.28%",
      color: "#14CC8F"
    },
    {
      title: "以太币泄露漏洞",
      value: "8.88%",
      color: "#FFB60A"
    },
    {
      title: "以太币锁定漏洞",
      value: "5.43%",
      color: "#008CFF"
    },
    {
      title: "可重入漏洞",
      value: "14.12%",
      color: "#FAD905"
    },
    {
      title: "交易顺序依赖漏洞",
      value: "7.12%",
      color: "#2555F4"
    },
    {
      title: "未检查返回值漏洞",
      value: "9.00%",
      color: "#A7CC22"
    },
    {
      title: "无保护自毁漏洞",
      value: "2.82%",
      color: "#6025F4"
    },
    {
      title: "不安全委托调用漏洞",
      value: "11.27%",
      color: "#FA7305"
    }
  ]);
  const [middleBottomList, setmiddleBottomList] = useState([
    {
      title: "地址标签",
      value: 0,
      max: 3500
    },
    {
      title: "标签类型",
      value: 0,
      max: 3500
    },
    {
      title: "监控地址",
      value: 0,
      max: 3500
    }
  ]);
  const getDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1并补零
    const day = String(currentDate.getDate()).padStart(2, "0"); // 补零
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  };

  useEffect(() => {
    getDate();
    // const timer = setInterval(() => {
    //   setmiddleBottomList(prevObj => {
    //     console.log("prevObj>>", prevObj);

    //     return prevObj.map((item: any) => {
    //       const newVal = Math.ceil(Math.random() * 10);
    //       let step = 0;
    //       if (newVal + item.value <= item.max) {
    //         step = newVal;
    //       } else {
    //         step = item.value - newVal;
    //       }
    //       return {
    //         ...item,
    //         value: item.value + step
    //       };
    //     });
    //   });
    // }, 2000);
    // return () => {
    //   clearInterval(timer);
    // };
  }, []);

  return (
    <div className={cn(`w-full h-full fadeIn flex flex-col justify-between`)}>
      <div className="w-full h-[120px]  flex justify-center items-center">
        <div
          className={cn(
            ` w-[1373px] h-full flex justify-center pt-[30px]`,
            `bg-[url('./assets/dataScreen_header_bg.png')] bg-cover bg-center relative`
          )}
        >
          <span className={cn(`text-[28px] text-[#97CDFF]`)}>
            {date}
          </span>
        </div>
      </div>
      <div className=" w-full h-[calc(100%_-_125px)] flex justify-between items-center">
        <div className=" w-[439px] h-full  flex flex-col justify-between">
          <div
            className={cn(
              `w-full h-[250px] px-[16px] py-[16px] flex flex-col justify-between items-center`,
              ` bg-[#061B5A] bg-opacity-30 `,
              `border-[2px] border-[#0D53B7] border-solid border-t-[4px] border-t-[#00FFD1]`
            )}
          >
            {leftTopList.map((item: any, index: number) =>
              <div
                key={index}
                className={cn(
                  `w-full h-[24px] flex justify-between items-center`
                )}
              >
                <div className="left w-[calc(70%)] h-full flex justify-start items-center">
                  <div className="img">
                    <img src={item.icon} alt="" width={16} height={16} />
                  </div>
                  <div className="ml-[10px]">
                    <span className="text-[16px] text-[#ffffff]">
                      {item.title}
                    </span>
                  </div>
                </div>
                <div className="right w-[calc(30%)] h-full flex items-center justify-end">
                  <span className="text-[24px] text-[#00FFE0]">
                    {item.value}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div
            className={cn(
              ` w-full h-[calc(100%_-_260px)] 3x:h-[calc(100%_-_270px)] flex flex-col justify-between`
            )}
          >
            <div
              className={cn(
                "title w-full h-[40px]  py-[7.5px] pl-[20px] pr-[18.5px] flex justify-between items-center",
                ` bg-[#061B5A] bg-opacity-30 `,
                `border-l-[6px] border-l-solid border-l-[#00FFD1]`
              )}
            >
              <div className="w-[calc(80%)] h-full flex justify-start items-center">
                <div className="mr-[10px]">
                  <img
                    src={dataScreen_icon_type}
                    alt=""
                    width={24}
                    height={25}
                  />
                </div>
                <span className="text-[#EFF4FF] text-[22px]">监测漏洞类型 11种</span>
              </div>
              <div className="w-[calc(20%)] h-full flex justify-end items-center">
                <img src={dataScreen_icon_dot} alt="" width={4} height={3} />
              </div>
            </div>
            <div
              className={cn(
                "w-full h-[calc(100%_-_44px)] pt-[10px] py-[5px] flex flex-col justify-between items-center",
                ` bg-[#061B5A] bg-opacity-30 `,
                `overflow-scroll`
              )}
            >
              <div className="graph w-full h-[153px] flex justify-center items-center">
                <img src={dataScreen_graph} alt="" width={154} height={153} />
              </div>
              <div className="content w-full h-[calc(100%_-_173px)] px-[20px]">
                <div className="w-full flex justify-start flex-wrap gap-y-2">
                  {leftBottomList.map((item: any, index: number) =>
                    <div
                      className="w-[calc(49%)] h-[52px] flex justify-start items-center"
                      key={index}
                    >
                      <div className="dot w-[24px] h-full pt-[8px] pl-[8px]">
                        <div
                          className="w-[8px] h-[8px] rounded-[4px]"
                          style={{ backgroundColor: `${item.color}` }}
                        />
                      </div>
                      <div className="dot w-[160px] h-full">
                        <div className="w-full">
                          <span className="text-[16px] text-[#ffffff]">
                            {item.title}
                          </span>
                        </div>
                        <div className="w-full">
                          <span className="text-[18px] text-[#BFE7F9]">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[calc(100%_-_903px)] h-full flex justify-between flex-col items-center">
          <div className="earthContainer w-full h-[calc(100%_-_196px)]  flex justify-center items-center  ">
            <Earth />
          </div>
          <div className="w-full min-w-[850px] h-[196px] flex justify-around items-center 3xl:scale-100 scale-50 transform origin-bottom">
            {middleBottomList.map((item: any, index: number) =>
              <div
                key={index}
                className={cn(
                  "w-[270px] h-[177px] flex justify-center items-center relative",
                  `bg-[url('./assets/dataScreen_num_bg.png')] bg-cover bg-center`
                )}
              >
                <span className="text-[31px] text-[#BFE7F9]  w-[105px] h-full flex justify-center items-center">
                  {String(item.value).replace(reg, ",")}
                </span>
                <span className="text-[22px] text-[#00FFE0] absolute bottom-0 left-[91px]">
                  {item.title}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className=" w-[404px] h-full overflow-scroll 3xl:overflow-hidden">
          <div className="  w-full h-[400px]">
            <div
              className={cn(
                " title w-full h-[40px] py-[7.5px] pl-[20px] pr-[18.5px] flex justify-between items-center",
                ` bg-[#061B5A] bg-opacity-30 `,
                `border-l-[6px] border-l-solid border-l-[#00FFD1]`
              )}
            >
              <div className="w-[calc(80%)] h-full flex justify-start items-center">
                <span className="text-[#EFF4FF] text-[20px]">实时交易</span>
              </div>
              <div className="w-[calc(20%)] h-full flex justify-end items-center">
                <img src={dataScreen_icon_dot} alt="" width={4} height={3} />
              </div>
            </div>
            <div
              className={cn(
                " 折线图 w-full h-[342px] px-3 py-3 mt-[8px] 3xl:mt-[12px]",
                ` bg-[#061B5A] bg-opacity-30 `
              )}
            >
              <ChartLine />
            </div>
          </div>
          <div className=" w-full h-[400px] ">
            <div
              className={cn(
                "title w-full h-[40px]  py-[7.5px] pl-[20px] pr-[18.5px] flex justify-between items-center",
                ` bg-[#061B5A] bg-opacity-30 `,
                `border-l-[6px] border-l-solid border-l-[#00FFD1]`
                // `mt-[8px] 3xl:mt-[12px]`
              )}
            >
              <div className="w-[calc(80%)] h-full flex justify-start items-center">
                <span className="text-[#EFF4FF] text-[20px]">已分析地址数量</span>
              </div>
              <div className="w-[calc(20%)] h-full flex justify-end items-center">
                <img src={dataScreen_icon_dot} alt="" width={4} height={3} />
              </div>
            </div>

            <div
              className={cn(
                "折线图2 w-full h-[342px]  px-3 py-3",
                ` bg-[#061B5A] bg-opacity-30 `,
                `mt-[8px] 3xl:mt-[12px]`
              )}
            >
              <ChartLineAddress />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="h-[120px]  w-full flex flex-col items-center">
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
      </div> */}
    </div>
  );
}
