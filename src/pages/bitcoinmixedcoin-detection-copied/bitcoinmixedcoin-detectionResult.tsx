/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-13 01:39:57
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useParams } from 'react-router-dom';

import { Progress } from '@/components/progres';
import { ResultComponent } from '@/components/ResultComponent';
import { TagComponent } from '@/components/TagComponent';
import {
  detectBitcoinmixedcoinRequestType,
  detectBitcoinmixedcoinService
} from '@/services/detection';
import pattern from '@/styles/pattern';

export function BitcoinmixedcoinDetectionResultCopied() {
  const { tx } = useParams();
  const [result, setResult] = useState({
    result: '',
    hash_id: '',
    time: '',
    infoData: '',
    conclusionData: '',
    dataList: [
      {
        title: '输入金额：',
        key: 'input_value',
        value: '',
        rem: ' BTC'
      },
      {
        title: '输出金额：',
        key: 'output_value',
        value: '',
        rem: ' BTC'
      },
      {
        title: '输入数量：',
        key: 'inputs_count',
        value: '',
        rem: ''
      },
      {
        title: '输出数量：',
        key: 'outputs_count',
        value: '',
        rem: ''
      },
      {
        title: '手续费：',
        key: 'fee',
        value: '',
        rem: ' BTC'
      },
      {
        title: '交易大小：',
        key: 'size',
        value: '6,387',
        rem: ' Bytes'
      },
      {
        title: '交易费率：',
        key: 'fee_per_vb',
        value: '',
        rem: ' sat/vByte'
      },
      {
        title: '交易时间：',
        key: 'broadcasted_at',
        value: '14 Mar 2020 07:08:57',
        rem: ''
      }
    ]
  });
  const [loading, setloading] = useState(true);

  const start = async () => {
    setloading(true);
    try {
      const params: detectBitcoinmixedcoinRequestType = {
        tx: tx || '',
        chain: 'btc'
      };
      const respose = await detectBitcoinmixedcoinService(params);

      console.log('respose>>>', respose);
      const re = result.dataList.map((item: any) => {
        const newValue = respose[item.key];
        return {
          ...item,
          value: newValue
        };
      });
      setResult({
        ...result,
        ...respose,
        time: (respose.cost / 1000).toFixed(1) + 's',
        dataList: [...re],
        conclusionData: respose.summary
      });

      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  useEffect(() => {
    // 请求
    void start();
  }, []);

  return loading ? (
    <div
      className={cn(
        'absolute top-0 left-0 h-full w-full',
        `${pattern.flexCenter}`
      )}
    >
      {/* <AiOutlineLoading3Quarters
          className="ml-2 animate-spin"
          style={{ color: "white", fontSize: "24px" }}
        /> */}
      <Progress />
    </div>
  ) : (
    <div className={cn(' fadeIn h-full w-full pt-[0px]', `${pattern.flexbet}`)}>
      <div className={cn(`h-full w-full `)}>
        <div className="flex h-[50px] w-full items-center justify-between">
          <ResultComponent
            title="检测时间"
            content={result.time}
            className="h-[50px] w-[174px]"
          />
          <ResultComponent
            title="检测结果"
            content={`${result.result}`}
            className="h-[50px] w-[calc(100%_-_190px)]"
          />
        </div>

        <div className="mt-7 h-[36px] w-[120px]">
          <TagComponent title="交易分布信息" className="h-[36px] w-[120px]" />
        </div>
        <div
          className={cn(
            `mt-4 h-[272px] w-full px-5 py-5`,
            'bg-[#02004D4D]',
            `border-[2px] border-solid border-[#0D53B7]`,
            'flex flex-col gap-y-5'
          )}
        >
          <div className={`flex h-[20px] w-full items-center justify-between`}>
            <span className="w-[80px] text-[15px]  text-[#ffffff] ">
              Hash ID :
            </span>
            <span className="w-[calc(100%_-_90px)] truncate text-[20px] text-[#ffffff]">
              {result.hash_id}
            </span>
          </div>
          <div className={cn(`w-full flex-1 ${pattern.flexbet}`)}>
            <div className={cn(`h-full w-[calc(50%_-_60px)] `)}>
              {result &&
                result.dataList &&
                result.dataList.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      `h-[48px] w-full ${pattern.flexbet}`,
                      `border-b-[1px] border-solid border-[#0083CF] `
                    )}
                  >
                    <span className="text-[15px] text-[#ffffff]">
                      {item.title}
                    </span>
                    <span className="text-[20px] text-[#ffffff]">
                      {item.value + item.rem}
                    </span>
                  </div>
                ))}
            </div>
            <div
              className={cn(
                `h-full w-[1px]`,
                `border-[1px] border-solid border-[#00A0E9]`
              )}
            />
            <div className={cn(`h-full w-[calc(50%_-_60px)] `)}>
              {result &&
                result.dataList &&
                result.dataList.slice(4).map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      `h-[48px] w-full ${pattern.flexbet}`,
                      `border-b-[1px] border-solid border-[#0083CF] `
                    )}
                  >
                    <span className="text-[15px] text-[#ffffff]">
                      {item.title}
                    </span>
                    <span className="text-[20px] text-[#ffffff]">
                      {item.value + item.rem}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-10 h-[36px] w-[120px]">
          <TagComponent title="交易总结" className="h-[36px] w-[120px]" />
        </div>
        <div
          className={cn(
            `mt-4 h-[calc(100%_-_500px)] w-full overflow-scroll px-5 py-5`,
            'bg-[#02004D4D]',
            `border-[2px] border-solid border-[#0D53B7]`,
            'flex flex-col gap-y-5 text-[#ffffff]'
          )}
        >
          <div className="content text-[15px]">{result.conclusionData}</div>
        </div>
      </div>
    </div>
  );
}
