/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:数据仓库新增按钮弹框
 * @Author: didadida262
 * @Date: 2024-09-11 13:49:26
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-11 18:00:50
 */
import { notification } from "antd";
import cn from "classnames";
import { useState } from "react";

import btn_confirm from "@/assets/btn_confirm.png";
import dialog_close from "@/assets/dialog_close.png";
import xls_logo from '@/assets/xls_logo.png'

interface IProps {
  open: boolean;
  data: any;
  handleEvent: (data:any) => void
}

export function DialogEdit(props: IProps) {
  const { open, data, handleEvent } = props;
  console.log('data>>>', data)

  if (!open) return <></>;
  const [file, setFile] = useState<File>();
  const handleConfirm = () => {
    if (!file ) {
      notification.warning({ message: `请上传文件!!!` });
      return
    }
    const prarams = {
      ...data,
      file: file
    }
    handleEvent({
      type: 'modify',
      data: {
        ...prarams
      }
    })
  }

  return (
    <div className="z-50 absolute top-[calc(50%_-_220px)] left-[calc(50%_-_265px)] h-[440px] w-[530px] rounded-[10px] bg-[#ffffff] px-[40px] py-[20px]">
      <div
        className="absolute right-[16px] top-[16px] cursor-pointer"
        onClick={(e) => {
          console.log("closed!!!");
          void handleEvent({
            type: 'close',
            data: null
          })
        }}
      >
        <img src={dialog_close} alt="" width={30} height={30} />
      </div>

      <div className={cn("container w-full h-full")}>
        <div className="container-title w-full h-[34px]  flex justify-center items-center">
          <span className="text-[24px] text-[#0B4CD4]">区块链数据处理引擎</span>
        </div>
        <div className="container-content w-full h-[256px] mt-[20px] flex flex-col justify-between">
          <div className="w-full h-[23px] flex justify-between items-center">
            <span className="text-[#666666] text-[15px]">选择数据模板：</span>
            <span className="text-[#00A0E9] text-[13px] underline cursor-pointer" onClick={() => {
              const url = `https://chain-threat-awareness-platform.whitematrix.io/chainthreat/v1/data-house/data-source/data/${data.tableName}`
              window.open(url)
            }}>下载</span>
          </div>
          <div className="w-full h-[23px] flex justify-start items-center">
        <img src={xls_logo} alt="" width={30} height={30} />

            <span className="text-[#666666] text-[15px] ml-[9px]">模版</span>
          </div>
          <div className="w-full h-[23px] flex justify-start items-center">
            <span className="text-[#666666] text-[15px]">上传数据（请根据模板填写数据）</span>
          </div>
          <div className={cn(`w-full h-[148px]`,
          `bg-[url('./assets/dialog_upload_bg.png')] bg-cover bg-center `,
          )}>
            <input
              type="file"
              accept=".csv"
              title=""
              className="w-full h-full cursor-pointer opacity-0"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!event.target.files) return;
                setFile(event?.target.files[0]);
              }}
            />
            
          </div>

        </div>
        <div className="container-footer w-full h-[48px]  mt-[30px] cursor-pointer" onClick={() => {
          void handleConfirm()
        }}>
          <img src={btn_confirm} alt="" width={450} height={48} />
        </div>
      </div>
    </div>
  );
}
