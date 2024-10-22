/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:25:58
 */
import { SyncOutlined } from "@ant-design/icons";
import { notification } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import plus_icon from "@/assets/plus.png";
import plus_light_icon from "@/assets/plus_light.png";
import { AppBreadcrumb } from "@/components/Breadcrumb";
import { DialogAdd } from "@/components/DialogAdd";
import { DialogEdit } from "@/components/DialogEdit";
import { PageCommon } from "@/components/PageCommon";
import { TableSlot } from "@/components/TableSlot";
import { dataStoreColumns } from "@/services/columns";
import {
  dataStoreCreateRequestType,
  dataStoreCreateService,
  dataStoreListService,
  dataStoreModifyService,
  dataStoreRequestType,
  getDataStoreList
} from "@/services/detection";
import { dataStoreList } from "@/services/mockData/dataStore";
import pattern from "@/styles/pattern";
import { NumberDeal } from "@/utils/common";

export function DataStore() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const [dialogData, setDialogData] = useState();
  const [data, setData] = useState<any[]>([]);
  const [pageInfo, setpageInfo] = useState({
    pageSize: 10,
    currentPage: 1,
    total: 4
  });
  function genFormData(data: any) {
    const _data = new FormData();
    Object.keys(data).forEach(k => {
      _data.append(k, data[k]);
    });
    return _data;
  }
  const getData = async () => {
    const respose = await dataStoreListService();

    const listData = respose.data.map((item: any) => {
      return {
        ...item,
        total: NumberDeal(item.recordCount),
        downloadUrl: item.downloadUrl
          ? item.downloadUrl
          : `https://chain-threat-awareness-platform-api.whitematrix.io/chainthreat/v1/data-house/data-source/data/${item.tableName}`
      };
    });
    setData(listData);
    setpageInfo({
      ...pageInfo,
      total: respose.data.length
    });
  };
  const creatData = async (info: any) => {
    const params: dataStoreCreateRequestType = {
      ...info.data
    };
    const params2 = genFormData(params);

    const respose = await dataStoreCreateService(params2);
    // console.log("respose>>>>creatData", respose);

    await getData();
    setIsDialogOpen(false);
  };
  const modifyData = async (info: any) => {
    const params = {
      ...info.data
    };
    const params2 = genFormData(params);
    const respose = await dataStoreModifyService(params2);
    // console.log("respose>>>>modifyData", respose);
    if (respose.status === "BAD_REQUEST") {
      notification.warning({ message: `${respose.message}` });
      return;
    }
    await getData();
    setIsDialogEditOpen(false);
  };

  useEffect(() => {
    void getData();
  }, []);
  const TableOperationDom: React.FC = () => {
    return (
      <div className={cn(`w-full h-full`, ` flex justify-end items-center`)}>
        <div
          className="cursor-pointer group relative"
          onClick={() => {
            setIsDialogEditOpen(true);
          }}
        >
          <img src={plus_icon} alt="" width={28} height={28} />
          <img
            className="absolute top-0 left-0 hidden group-hover:block"
            src={plus_light_icon}
            alt=""
            width={28}
            height={28}
          />
        </div>
      </div>
    );
  };
  const TableFooterDom: React.FC = () => {
    return (
      <div className="footer w-full h-[56px] flex justify-start items-center">
        <div
          className="cursor-pointer group relative"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <img src={plus_icon} alt="" width={28} height={28} />
          <img
            className="absolute top-0 left-0 hidden group-hover:block"
            src={plus_light_icon}
            alt=""
            width={28}
            height={28}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("fadeIn w-full h-full", `${pattern.flexbetCol}`)}>
      <div className={cn(`w-full h-[calc(100%_-_40px)]`)}>
        <TableSlot
          className="w-full h-full"
          data={data}
          columns={dataStoreColumns}
          pageInfo={pageInfo}
          operationColumn={TableOperationDom({})}
          footer={TableFooterDom({})}
          handleEvent={(data: any) => {
            setDialogData(data);
            setIsDialogEditOpen(true);
          }}
        />
      </div>

      <div className={cn(`w-full h-[20px] ${pattern.flexEnd}`)}>
        <PageCommon
          className=""
          pageInfo={pageInfo}
          handleEvent={(params: any) => {
            setpageInfo({
              ...params
            });
          }}
        />
      </div>
      <DialogAdd
        open={isDialogOpen}
        handleEvent={(info: any) => {
          if (info.type === "close") {
            setIsDialogOpen(false);
          } else if (info.type === "create") {
            void creatData(info);
          }
        }}
      />
      <DialogEdit
        data={dialogData}
        open={isDialogEditOpen}
        handleEvent={(info: any) => {
          if (info.type === "close") {
            setIsDialogEditOpen(false);
          } else if (info.type === "modify") {
            console.log("修改info", info);
            void modifyData(info);
          }
        }}
      />
    </div>
  );
}
