/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-29 10:18:39
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:07:04
 */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */

import { notification } from 'antd';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ButtonCommonV2, EButtonType } from '@/components/ButtonCommonV2';
import { InputCommonV2 } from '@/components/InputCommonV2';
import { TableCommonV4 } from '@/components/TableCommonV4';
import { TagComponent } from '@/components/TagComponent';
import {
  detectionSampleBitCoinColumns,
  modelColumns
} from '@/services/columns';
import {
  detectActionLogRequestType,
  detectActionLogService
} from '@/services/detection';
import { modelListBitCoinMock } from '@/services/mockData/commonList';
import pattern from '@/styles/pattern';
import { isValidAddressV2 } from '@/utils/common';

export function BitcoinmixedcoinDetectionCopied() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState<any>('');
  const [detectionSampleList, setdetectionSampleList] = useState([]) as any;
  const [modelList, setModelList] = useState(modelListBitCoinMock);
  const startSearch = () => {
    // 开始查询
    if (!inputVal) {
      notification.warning({ message: `请输入信息！` });
      return;
    }
    if (!isValidAddressV2(inputVal)) {
      notification.warning({ message: `请输入正确的待检测内容` });
      return;
    }
    navigate(
      `/threat-evidence/bitcoinmixedcoin-detection-copied/result/${inputVal}`
    );
  };
  const getActionLogList = async () => {
    const params: detectActionLogRequestType = {
      action: 'mix_coin',
      count: 10
    };
    const respose = await detectActionLogService(params);
    const result: any[] = respose.data.map((item: any) => {
      return {
        name: item.input,
        time: item.createAt,
        result: item.output ? JSON.parse(item.output).result : ''
      };
    });
    setdetectionSampleList(result);
    setInputVal(result[0].name);
  };

  useEffect(() => {
    void getActionLogList();
  }, []);

  return (
    <div className={cn(' fadeIn flex h-full w-full flex-col ')}>
      <div className={cn(`h-[calc(60%)] w-full ${pattern.flexCenter}`)}>
        <div
          className={cn(
            `relative h-[258px] w-[662px] scale-[70%] bg-[url('./assets/attackBg1.png')] bg-cover bg-center 3xl:scale-[100%]`
          )}
        >
          <div className="mx-auto max-w-7xl">
            <div className="shadow-lg relative rounded bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
              <div className="absolute inset-0 rounded bg-gradient-to-t from-transparent via-blue-500/30 to-white/20" />
              <div className="relative flex items-center justify-between">
                <h1
                  className="!text-white mb-0 text-2xl font-medium"
                  style={{
                    color: 'white'
                  }}
                >
                  区块链攻击溯源模型
                </h1>
              </div>
            </div>
          </div>
          <div
            className={cn(
              ` absolute top-[54px] left-0 h-[calc(100%_-_54px)] w-full ${pattern.flexCenter}`
            )}
          >
            <div className={cn(` flex flex-col items-end gap-y-6`)}>
              <InputCommonV2
                initVal={inputVal}
                placeholder="输入64位交易ID"
                onInput={(val: any) => {
                  setInputVal(val);
                }}
                className="h-[36px] w-[450px] "
              />

              <ButtonCommonV2
                onClick={() => {
                  startSearch();
                }}
              >
                <span className="text-[16px] text-[#FFFFFF]">检测</span>
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
              columns={detectionSampleBitCoinColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
