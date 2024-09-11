/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-11 14:13:33
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import plus_icon from "@/assets/plus.png";
import plus_light_icon from "@/assets/plus_light.png";
import { AppBreadcrumb } from "@/components/Breadcrumb";
import { Dialog } from "@/components/Dialog";
import { PageCommon } from "@/components/PageCommon";
import { TableSlot } from "@/components/TableSlot";
import { dataStoreColumns } from "@/services/columns";
import {
  dataStoreListService,
  dataStoreRequestType,
  getDataStoreList
} from "@/services/detection";
import { dataStoreList } from "@/services/mockData/dataStore";
import pattern from "@/styles/pattern";
import { waitTime } from "@/utils/common";

export function DataStore() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const [data, setData] = useState<any[]>([]);
  const [pageInfo, setpageInfo] = useState({
    pageSize: 10,
    currentPage: 1,
    total: 4
  });

  // const {
  //   data,
  //   refetch,
  //   isRefetching,
  //   isLoading
  // } = useQuery("getDataStore", async () => {
  //   await waitTime(1000);
  //   return dataStoreList || [];
  // });
  // useEffect(
  //   () => {
  //     const params: dataStoreRequestType = {
  //       currentPage: 1,
  //       pageSize: 20
  //     };
  //     void getDataStoreList(params).then(data => {
  //       console.log("data>>>", data);
  //     });
  //   },
  //   [location.pathname]
  // );
  const getData = async () => {
    const respose = await dataStoreListService();
    console.log("response>>>", respose);
    const listData = dataStoreList;
    setData(listData);
    // setpageInfo({
    //   ...pageInfo,
    //   total: respose.data.length
    // });
  };
  useEffect(() => {
    void getData();
  }, []);
  // const TableOperationDom: React.FC = () => {
  //   return (
  //     <div className={cn(`w-full h-full`, ` flex justify-end items-center`)}>
  //       <div
  //         className="cursor-pointer group relative"
  //         onClick={() => {
  //           console.log("编辑>>>");
  //         }}
  //       >
  //         <img src={plus_icon} alt="" width={28} height={28} />
  //         <img
  //           className="absolute top-0 left-0 hidden group-hover:block"
  //           src={plus_light_icon}
  //           alt=""
  //           width={28}
  //           height={28}
  //         />
  //       </div>
  //     </div>
  //   );
  // };
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
          // operationColumn={TableOperationDom({})}
          footer={TableFooterDom({})}
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
      <Dialog
        open={isDialogOpen}
        handleEvent={() => {
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
