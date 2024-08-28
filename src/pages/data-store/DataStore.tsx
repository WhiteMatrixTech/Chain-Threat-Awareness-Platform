/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 14:50:33
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import { AppBreadcrumb } from "@/components/Breadcrumb";
import { TableCommon } from "@/components/TableCommon";
import { dataStoreRequestType, getDataStoreList } from "@/services/detection";
import { dataStoreList } from "@/services/mockData/dataStore";
import { waitTime } from "@/utils/common";

const breadCrumbItems = [
  {
    menuHref: "/",
    menuName: "数据仓库"
  }
];

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
    currentPage: 1
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

      <div className="pag  mt-[20px] h-[20px]" />
    </div>
  );
}
