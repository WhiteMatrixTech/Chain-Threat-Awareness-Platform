/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:34:32
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-29 23:19:23
 */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { BellOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { sortBy } from 'lodash';
import { useSearchParams } from 'react-router-dom';

import { ERROR_DETAIL, ERROR_TIPS } from '@/constant';
import { ResultIconColor } from '@/services/mockData/contractDetection';

import styles from './DetectionChart.module.less';

export function DetectionDetail() {
  const [searchParams] = useSearchParams();

  let DetectionResults: any[] = [];
  try {
    DetectionResults = JSON.parse(
      window.atob(searchParams.get('result') || '') || ''
    );
    console.log('DetectionResults>>>', DetectionResults);
  } catch (e) {}
  const unique = (data: any) => {
    return data.reduce((acc: any, currentValue: any) => {
      if (
        !acc.filter(
          (item: any) =>
            item.src === currentValue.src && item.dst === currentValue.dst
        ).length
      ) {
        acc.push(currentValue);
      }
      return acc;
    }, []);
  };
  return (
    <div
      className={cn(
        styles.detectResultCard,
        '  h-full  flex-col bg-white py-[18px] px-6'
      )}
    >
      <div className=" text-xl font-medium">
        {/* {`检测结果详述：${DetectionResults.length}`} */}
        {`检测结果详述：${
          DetectionResults.reduce((acc: any, current: any) => {
            if (
              !acc.filter((item: any) => item.swcId === current.swcId).length
            ) {
              acc.push(current);
            }
            return acc;
          }, []).length
        }`}
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-y-8 overflow-y-auto">
        {sortBy(
          DetectionResults.map((o) => {
            const indexes: any = { High: 0, Medium: 1, Low: 2 };
            return {
              ...o,
              type: indexes[o.security]
            };
          }),
          'type'
        )
          .reduce((acc: any, currentValue: any) => {
            if (
              !acc.filter((item: any) => item.swcId === currentValue.swcId)
                .length
            ) {
              acc.push(currentValue);
            }
            return acc;
          }, [])
          .map((i: any, dex: any) => {
            return {
              ...i,
              index:dex
            }
          })
          .map((item: any, index: any) => (
            <DetectionDetailItem key={index} {...item} />
          ))}
      </div>
    </div>
  );
}

function DetectionDetailItem(data: any) {
  return (
    <div className="text-base">
      <div className="item-center mb-3 flex">
        <div
          className="flex h-6 w-6 items-center justify-center p-2"
          style={{
            backgroundColor:
              ResultIconColor[data.security as 'Low' | 'High' | 'Medium']
          }}
        >
          <BellOutlined style={{ color: '#fff' }} />
        </div>
        <div className="ml-2"> 第{data.index + 1}个漏洞</div>
      </div>
      <div className="ml-5 mb-2">
        <span>{ERROR_DETAIL[data.swcId]?.desc}</span>
      </div>
      <div className="ml-5">
        <span>修复建议:{ERROR_DETAIL[data.swcId]?.handle}</span>
        <span>
          <a
            href={ERROR_TIPS[data.swcId] || ''}
            target="_blank"
            rel="noreferrer"
            className="text-[#166CDD] underline hover:text-[#166CDD]"
          >
            点击此处查看文档详情
          </a>
        </span>
      </div>
    </div>
  );
}
