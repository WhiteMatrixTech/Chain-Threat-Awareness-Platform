/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from "classnames";
import * as GIO from "giojs";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import pattern from "@/styles/pattern";

import data from "../../utils/json/sampleData.json";
import styles from "./index.module.less";

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
  const [countryData, setCountryData] = useState<countryDataType>({
    name: "CHINA",
    ISOCode: "CN"
  });

  const [relatedCountries, setRelatedCountries] = useState<countryDataType[]>([
    {
      name: "CHINA",
      ISOCode: "CN"
    }
  ]);

  const screenData1 = [
    {
      tab: "地址标签",
      number: 17,
      unit: "M"
    },
    {
      tab: "已溯源分析地址",
      number: 91.8,
      unit: "K"
    },
    {
      tab: "金额阈值监控",
      number: 81.8,
      unit: "M"
    },
    {
      tab: "交易所地址监控",
      number: 31.8,
      unit: "K"
    },
    {
      tab: "地址标签类型",
      number: 393,
      unit: ""
    },
    {
      tab: "已监控地址",
      number: 18.7,
      unit: "K"
    },
    {
      tab: "转出监控",
      number: 2.81,
      unit: "M"
    },
    {
      tab: "清零交易",
      number: 23566,
      unit: ""
    }
  ];

  const screenData2 = [
    {
      tab: "已审计智能合约",
      number: 8,
      unit: "M"
    },
    {
      tab: "可监测漏洞类型",
      number: 28,
      unit: ""
    },
    {
      tab: "接入智能合约",
      number: 10,
      unit: "M"
    },
    {
      tab: "开发者",
      number: 300,
      unit: "K"
    },
    {
      tab: "已发现漏洞合约",
      number: 150,
      unit: "K"
    },
    {
      tab: "合约漏洞库",
      number: 4,
      unit: "K"
    },
    {
      tab: "区块链项目",
      number: 250,
      unit: "K"
    }
  ];

  useEffect(() => {
    const container = document.getElementById("screen");

    const controller = new GIO.Controller(container);

    controller.configure({
      color: {
        surface: 0x1890ff,
        selected: "#FF6868",
        related: "#FF686899",
        halo: "#FF686899"
      }
    });

    controller.addData(data);
    controller.adjustOceanBrightness(0.9);
    controller.setTransparentBackground(true);
    controller.setAutoRotation(true, 1);
    controller.onCountryPicked(
      (selectedCountry: any, relatedCountries: any) => {
        setCountryData(selectedCountry);
        setRelatedCountries(relatedCountries);
      }
    );
    controller.init();
  }, []);

  return <div className={cn("fadeIn w-full h-full", `markBorderR`)} />;
}
