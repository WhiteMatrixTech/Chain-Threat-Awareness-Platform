/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/*
 * @Description:数据仓库新增按钮弹框
 * @Author: didadida262
 * @Date: 2024-09-11 13:49:26
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-11 15:34:35
 */
import cn from "classnames";
import { useEffect, useState } from "react";

import btn_confirm from "@/assets/btn_confirm.png";
import dialog_close from "@/assets/dialog_close.png";
import xls_logo from '@/assets/xls_logo.png'
import {InputLight} from '@/components/InputLight'

interface IProps {
  open: boolean;
  data: any;
  handleEvent: () => void
}

export function DialogEdit(props: IProps) {
  const { open, data, handleEvent } = props;

  if (!open) return <></>;
  const [form, setForm] = useState({
    name: data.name,
    chain: data.chainType,
    origin: '',
    downloadName: ''
  })
  // useEffect(() => {
  //   setForm({
  //     ...form,
  //     name: data.name,
  //     chain: data.chainType
  //   })
  // }, [data])
  return (
    <div className="z-50 absolute top-[calc(50%_-_349px)] left-[calc(50%_-_265px)] h-[698px] w-[530px] rounded-[10px] bg-[#ffffff] px-[40px] py-[20px]">
      <div
        className="absolute right-[16px] top-[16px] cursor-pointer"
        onClick={(e) => {
          console.log("closed!!!");
          handleEvent()
        }}
      >
        <img src={dialog_close} alt="" width={30} height={30} />
      </div>

      <div className={cn("container w-full h-full")}>
        <div className="container-title w-full h-[34px]  flex justify-center items-center ">
          <span className="text-[24px] text-[#0B4CD4]">自定义链下数据源</span>
        </div>
        <div className="container-content w-full h-[516px] flex flex-col justify-between mt-[20px]">
          <div className="w-full h-[68px] flex flex-col justify-between">
            <div className="w-full h-[23px] flex justify-start items-center">
              <span className="text-[#666666] text-[15px]">数据集名称：</span>
            </div>
            <div className="w-full h-[36px] flex justify-start items-center">
              <InputLight
                initVal={form.name}
                placeholder="请输入数据集名称"
                onInput={(val: any) => {
                  setForm({
                    ...form,
                    name: val
                  });
                }}
                className="w-[450px] h-[36px] "
              />
            </div>
          </div>
          <div className="w-full h-[68px] flex flex-col justify-between">
            <div className="w-full h-[23px] flex justify-start items-center">
              <span className="text-[#666666] text-[15px]">所在链：</span>
            </div>
            <div className="w-full h-[36px] flex justify-start items-center">
              <InputLight
                initVal={form.chain}
                placeholder="请输入所在链"
                onInput={(val: any) => {
                  setForm({
                    ...form,
                    chain: val
                  });
                }}
                className="w-[450px] h-[36px]"
              />
            </div>
          </div>
          <div className="w-full h-[68px] flex flex-col justify-between">
            <div className="w-full h-[23px] flex justify-start items-center">
              <span className="text-[#666666] text-[15px]">数据来源：</span>
            </div>
            <div className="w-full h-[36px] flex justify-start items-center">
              <InputLight
                placeholder="请输入数据来源"
                onInput={(val: any) => {
                  setForm({
                    ...form,
                    origin: val
                  });
                }}
                className="w-[450px] h-[36px] "
              />
            </div>
          </div>

          <div className="w-full h-[180px] flex flex-col justify-between">
            <div className="w-full h-[23px] flex justify-start items-center">
              <span className="text-[#666666] text-[15px]">上传数据（请根据模板填写数据）</span>
            </div>
            <div className={cn(`w-full h-[148px]`,
            `bg-[url('./assets/dialog_upload_bg.png')] bg-cover bg-center `,
            )}>
            </div>
          </div>
          <div className="w-full h-[68px] flex flex-col justify-between">

            <div className="w-full h-[23px] flex justify-start items-center">
              <span className="text-[#666666] text-[15px]">下载地址（可选填）：</span>
            </div>
            <div className="w-full h-[36px] flex justify-start items-center">
              <InputLight
                placeholder="请输入下载链接"
                onInput={(val: any) => {
                  setForm({
                    ...form,
                    name: val
                  });
                }}
                className="w-[450px] h-[36px] "
              />
            </div>
          </div>
        </div>
        <div className="container-footer w-full h-[48px] cursor-pointer mt-[30px]">
          <img src={btn_confirm} alt="" width={450} height={48} />
        </div>
      </div>
    </div>
  );
}
