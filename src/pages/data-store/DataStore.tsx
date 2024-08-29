/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-29 20:26:59
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
import { dataStoreRequestType, getDataStoreList } from "@/services/detection";
import { dataStoreList } from "@/services/mockData/dataStore";
import pattern from "@/styles/pattern";
import { waitTime } from "@/utils/common";

const columns: ColumnsType<any> = [
  {
    title: "序号",
    ellipsis: true,
    width: 100
  },
  {
    title: "数据集名称",
    dataIndex: "name",
    ellipsis: true,
    width: 320
  },
  {
    title: "平台",
    dataIndex: "chainType",
    ellipsis: true,
    width: 320
  },
  {
    title: "数量",
    dataIndex: "number",
    ellipsis: true
  }
];

export function DataStore() {
  const location = useLocation();
  const [data, setData] = useState<any[]>([]);
  const [pageInfo, setpageInfo] = useState({
    pageSize: 10,
    currentPage: 1,
    total: 3
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
  useEffect(
    () => {
      const params: dataStoreRequestType = {
        currentPage: 1,
        pageSize: 20
      };
      void getDataStoreList(params).then(data => {
        console.log("data>>>", data);
      });
    },
    [location.pathname]
  );
  useEffect(() => {
    setData(dataStoreList);
  }, []);

  return (
    <div className={cn("fadeIn w-full")}>
      <TableCommon
        className=""
        data={data}
        columns={columns}
        pageInfo={pageInfo}
      />
      <div className={cn(`w-full ${pattern.flexEnd}  mt-[20px]`)}>
        <PageCommon
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
