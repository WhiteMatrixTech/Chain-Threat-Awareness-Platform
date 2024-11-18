/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:数据仓库新增按钮弹框
 * @Author: didadida262
 * @Date: 2024-09-11 13:49:26
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-16 22:58:57
 */
import { notification, Upload } from 'antd';
import cn from 'classnames';
import { useState } from 'react';

import btn_confirm from '@/assets/btn_confirm.png';
import dialog_close from '@/assets/dialog_close.png';
import xls_logo from '@/assets/xls_logo.png';
import {
  dataStoreDownloadTemplateRequestType,
  dataStoreDownloadTemplateService
} from '@/services/detection';

interface IProps {
  open: boolean;
  data: any;
  handleEvent: (data: any) => void;
}

export function DialogEdit(props: IProps) {
  const { open, data, handleEvent } = props;

  if (!open) return <></>;
  const [file, setFile] = useState<File>();
  const handleConfirm = () => {
    if (!file) {
      notification.warning({ message: `请上传文件!!!` });
      return;
    }
    const prarams = {
      ...data,
      file: file
    };
    handleEvent({
      type: 'modify',
      data: {
        ...prarams
      }
    });
  };

  const downloadTemplate = async () => {
    const params: dataStoreDownloadTemplateRequestType = {
      tableName: data.tableName
    };

    const response = await dataStoreDownloadTemplateService(params);

    const blob = new Blob([response], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'templateCSV.csv';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="absolute top-[calc(50%_-_220px)] left-[calc(50%_-_265px)] z-50 h-[440px] w-[530px] rounded-[10px] bg-[#ffffff] px-[40px] py-[20px]">
      <div
        className="absolute right-[16px] top-[16px] cursor-pointer"
        onClick={(e) => {
          console.log('closed!!!');
          void handleEvent({
            type: 'close',
            data: null
          });
        }}
      >
        <img src={dialog_close} alt="" width={30} height={30} />
      </div>

      <div className={cn('container h-full w-full')}>
        <div className="container-title flex h-[34px]  w-full items-center justify-center">
          <span className="text-[24px] text-[#0B4CD4]">区块链数据处理引擎</span>
        </div>
        <div className="container-content mt-[20px] flex h-[256px] w-full flex-col justify-between">
          <div className="flex h-[23px] w-full items-center justify-between">
            <span className="text-[15px] text-[#666666]">选择数据模板：</span>
            <span
              className="cursor-pointer text-[13px] text-[#00A0E9] underline"
              onClick={() => {
                void downloadTemplate();
                // const url = `https://chain-threat-awareness-platform.whitematrix.io/chainthreat/v1/data-house/data-source/data/${data.tableName}`
                // window.open(url)
              }}
            >
              下载
            </span>
          </div>
          <div className="flex h-[23px] w-full items-center justify-start">
            <img src={xls_logo} alt="" width={30} height={30} />
            <span className="ml-[9px] text-[15px] text-[#666666]">模版</span>
          </div>
          <div className="flex h-[23px] w-full items-center justify-start">
            <span className="text-[15px] text-[#666666]">
              上传数据（请根据模板填写数据）
            </span>
          </div>
          <div
            className={cn(
              `h-[148px] w-full`,
              `relative bg-[url('./assets/dialog_upload_bg.png')] bg-cover bg-center`
            )}
          >
            {file && (
              <div className="absolute top-[calc(50%_-_40px)] left-[calc(50%_-_100px)] flex h-[80px] w-[200px] items-center justify-center bg-white">
                <img src={xls_logo} alt="" width={30} height={30} />
                <span className="ml-[9px] truncate text-[15px] text-[#666666]">
                  {file.name}
                </span>
              </div>
            )}
            <input
              type="file"
              accept=".csv"
              title=""
              className="h-full w-full cursor-pointer opacity-0"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!event.target.files) return;
                setFile(event?.target.files[0]);
              }}
            />
          </div>
        </div>
        <div
          className="container-footer mt-[30px] h-[48px]  w-full cursor-pointer"
          onClick={() => {
            void handleConfirm();
          }}
        >
          <img src={btn_confirm} alt="" width={450} height={48} />
        </div>
      </div>
    </div>
  );
}
