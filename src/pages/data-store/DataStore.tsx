/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-04 15:25:58
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import { AppBreadcrumb } from "@/components/Breadcrumb";
import { PageCommon } from "@/components/PageCommon";
import { TableCommon } from "@/components/TableCommon";
import { dataStoreColumns } from "@/services/columns";
import { dataStoreRequestType, getDataStoreList } from "@/services/detection";
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
  useEffect(() => {
    setData(dataStoreList);
  }, []);

  return (
    <div className={cn("fadeIn w-full h-full", `${pattern.flexbetCol}`)}>
      <div className={cn(`w-full h-[calc(100%_-_40px)]`)}>
        <TableCommon
          className="w-full h-full"
          data={data}
          columns={dataStoreColumns}
          pageInfo={pageInfo}
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
    </div>
  );
}
