/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:07:53
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { GraphinData } from '@antv/graphin';
import { notification } from 'antd';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ButtonCommonV2, EButtonType } from '@/components/ButtonCommonV2';
import { InputCommonV3 } from '@/components/InputCommonV3';
import { TableCommonV4 } from '@/components/TableCommonV4';
import { TagComponent } from '@/components/TagComponent';
import {
  detectionMaliciousSampleColumns,
  modelColumns
} from '@/services/columns';
import {
  detectActionLogRequestType,
  detectActionLogService
} from '@/services/detection';
import { modelListMaliciousMock } from '@/services/mockData/commonList';
import pattern from '@/styles/pattern';
import { isValidAddressV2 } from '@/utils/common';

export function MaliciousTransactionCopied() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState<any>('');
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [modelList, setModelList] = useState(modelListMaliciousMock);

  const startSearch = () => {
    if (!inputVal) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    if (!isValidAddressV2(inputVal)) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    // 开始查询
    navigate(
      `/threat-evidence/malicious-transaction-copied/result/${inputVal}`
    );
  };
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: 'illicit',
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        time: item.createAt,
        result: item.output ? JSON.parse(item.output).result || '无' : ''
      };
    });
    setdetectionSampleList(result);
    setInputVal(result[0].name);
    console.log('检测数据>>>>', respose);
    console.log('检测数据>>>result>', result);
  };
  useEffect(() => {
    void getActionLogList();
  }, []);

  return (
    <div className={cn(' fadeIn flex h-full w-full flex-col ')}>
      <div className={cn(`h-[calc(60%)] w-full ${pattern.flexCenter}`)}>
        <div
          className={cn(
            `relative h-[322px] w-[662px] scale-[70%] 3xl:scale-[100%]`
          )}
        >
          <div className="mx-auto max-w-7xl">
            <div className="shadow-lg relative rounded bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 pb-2">
              <div className="absolute inset-0 rounded bg-gradient-to-t from-transparent via-blue-500/30 to-white/20" />
              <div className="relative flex items-center justify-between">
                <h1
                  className="!text-white mb-0 text-2xl font-medium"
                  style={{
                    color: 'white'
                  }}
                >
                  复杂环境下的高效资产追踪
                </h1>
              </div>
            </div>
          </div>
          <div
            className={cn(
              ` absolute top-[54px] left-0 h-[calc(100%_-_54px)] w-full ${pattern.flexCenter}`,
              'bg-[#003F7A4D]',
              'border-[1px] border-t-0 border-r-0 border-l-0 border-solid border-[#D3EAFF]',
              'px-[106px] pt-[66px] pb-[40px]'
            )}
          >
            <div
              className={cn(
                `flex h-[162px] w-full flex-col items-end justify-between  gap-y-6`
              )}
            >
              <InputCommonV3
                initVal={inputVal}
                placeholder="输入交易信息"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="h-[100px] w-[450px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[16px] text-[#FFFFFF]">查询</span>
              </ButtonCommonV2>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(`flex h-[calc(40%)] w-full justify-between`)}>
        <div className="flex h-full w-[calc(50%_-_10px)] flex-col  justify-between">
          <div className="h-[36px] w-[120px]">
            <TagComponent title="模型信息" className="h-[36px] w-[120px]" />
          </div>

          <div className={cn(` h-[calc(100%_-_52px)] w-full `)}>
            <TableCommonV4
              className="h-full w-full"
              data={modelList}
              columns={modelColumns}
            />
          </div>
        </div>
        <div className="flex h-full w-[calc(50%_-_10px)] flex-col  justify-between">
          <div className="h-[36px] w-[120px]">
            <TagComponent title="检测样例" className="h-[36px] w-[120px]" />
          </div>
          <div className={cn(` h-[calc(100%_-_52px)] w-full `)}>
            <TableCommonV4
              className="h-full w-full"
              data={detectionSampleList}
              columns={detectionMaliciousSampleColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
