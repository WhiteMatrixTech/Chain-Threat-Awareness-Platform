/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-11 11:01:49
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import plus_icon from "@/assets/plus.png";
import { AppBreadcrumb } from "@/components/Breadcrumb";
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

  return (
    <div className={cn("fadeIn w-full h-full", `${pattern.flexbetCol}`)}>
      <div className={cn(`w-full h-[calc(100%_-_40px)]`)}>
        <TableSlot
          className="w-full h-full"
          data={data}
          columns={dataStoreColumns}
          pageInfo={pageInfo}
        >
          <div className="footer w-full h-[56px] flex justify-start items-center">
            <div
              className="cursor-pointer"
              onClick={() => {
                console.log("新增>>>");
              }}
            >
              <img src={plus_icon} alt="" width={28} height={28} />
            </div>
          </div>
        </TableSlot>
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
    </div>
  );
}
