/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cn from 'classnames';
import * as GIO from 'giojs';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import data from '../../utils/json/sampleData.json';
import styles from './index.module.less';

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
    name: 'CHINA',
    ISOCode: 'CN'
  });

  const [relatedCountries, setRelatedCountries] = useState<countryDataType[]>([
    {
      name: 'CHINA',
      ISOCode: 'CN'
    }
  ]);

  const screenData1 = [
    {
      tab: '地址标签',
      number: 17,
      unit: 'M'
    },
    {
      tab: '已溯源分析地址',
      number: 91.8,
      unit: 'K'
    },
    {
      tab: '金额阈值监控',
      number: 81.8,
      unit: 'M'
    },
    {
      tab: '交易所地址监控',
      number: 31.8,
      unit: 'K'
    },
    {
      tab: '地址标签类型',
      number: 393,
      unit: ''
    },
    {
      tab: '已监控地址',
      number: 18.7,
      unit: 'K'
    },
    {
      tab: '转出监控',
      number: 2.81,
      unit: 'M'
    },
    {
      tab: '清零交易',
      number: 23566,
      unit: ''
    }
  ];

  const screenData2 = [
    {
      tab: '已审计智能合约',
      number: 8,
      unit: 'M'
    },
    {
      tab: '可监测漏洞类型',
      number: 28,
      unit: ''
    },
    {
      tab: '接入智能合约',
      number: 10,
      unit: 'M'
    },
    {
      tab: '开发者',
      number: 300,
      unit: 'K'
    },
    {
      tab: '已发现漏洞合约',
      number: 150,
      unit: 'K'
    },
    {
      tab: '合约漏洞库',
      number: 4,
      unit: 'K'
    },
    {
      tab: '区块链项目',
      number: 250,
      unit: 'K'
    }
  ];

  useEffect(() => {
    const container = document.getElementById('screen');

    const controller = new GIO.Controller(container);

    controller.configure({
      color: {
        surface: 0x1890ff,
        selected: '#FF6868',
        related: '#FF686899',
        halo: '#FF686899'
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

  return (
    <div className={cn(styles.dataScreens, className)}>
      <div className="flex justify-between">
        <div className="shadow-[0_4px_12px_rgba(163, 174, 191, 0.2)] flex w-[49%] flex-wrap  rounded-[4px] bg-[#FFFFFF] p-[11px] px-[22px]">
          {screenData1.map((item, index) => (
            <div key={index} className="my-[11px] w-[25%]">
              <div className="text-[24px] font-[1000] leading-[24px] text-[#166CDD]">
                <CountUp end={item.number} duration={3} />
                <span className="ml-1 text-[14px] leading-[19px]">
                  {item.unit}
                </span>
              </div>
              <div className="text-[14px] text-[#303133B2]">{item.tab}</div>
            </div>
          ))}
        </div>
        <div className="flex w-[49%] flex-wrap  ">
          {screenData2.map((item, index) => (
            <div
              key={index}
              className={cn(
                'shadow-[0_4px_12px_rgba(163, 174, 191, 0.2)] mr-[8px] mb-[8px] w-[22%] rounded-[4px] bg-[#FFFFFF] px-[22px] py-[15px]',
                index > 3 && 'mb-0'
              )}
            >
              <div className="text-[24px] font-[1000] leading-[24px] text-[#303133]">
                <CountUp end={item.number} duration={3} />
                <span className="ml-1 text-[14px] leading-[19px]">
                  {item.unit}
                </span>
              </div>
              <div className="text-[14px] text-[#303133B2]">{item.tab}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          id="screen"
          className={cn('mt-[20px] min-h-[1000px] w-[100%]', styles.screen)}
        />
        <div className="shadow-[0px_6px_20px_rgba(96, 111, 148, 0.2)] absolute top-[10px] right-[10px] min-w-[240px] rounded-[4px] bg-[#FFFFFF] bg-opacity-[0.9] p-[15px] text-[20px]">
          <div>{countryData.name}</div>
          <div className="my-[5px] flex items-center justify-between">
            <div className="text-[14px] text-[#303133B2]">地址标签：</div>
            <div>{countryData.ISOCode}</div>
          </div>
          <div className="my-[5px] flex items-center justify-between">
            <div className="text-[14px] text-[#303133B2]">已监控地址：</div>
            <div>{relatedCountries.length}</div>
          </div>
          <div className="my-[5px] flex items-center justify-between">
            <div className="text-[14px] text-[#303133B2]">转出监控：</div>
            <div>
              {Math.floor(Math.random() * 10) || 8}
              <span>M</span>
            </div>
          </div>
          <div className="my-[5px] flex items-center justify-between">
            <div className="text-[14px] text-[#303133B2]">已审计智能合约：</div>
            <div>
              {Math.floor(Math.random() * 100)}
              <span>M</span>
            </div>
          </div>
          <div className="my-[5px] flex items-center justify-between">
            <div className="text-[14px] text-[#303133B2]">已发现漏洞合约：</div>
            <div>
              {Math.floor(Math.random() * 200)}
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
