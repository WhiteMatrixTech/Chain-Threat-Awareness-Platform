/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-27 15:07:05
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useQuery } from "react-query";

import { AppBreadcrumb } from "@/components/Breadcrumb";
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
  // {
  //   title: "数据库类型",
  //   dataIndex: "databaseType",
  //   ellipsis: true
  // },
  // {
  //   title: "描述",
  //   dataIndex: "description",
  //   ellipsis: true
  // },

  // {
  //   title: "版本",
  //   dataIndex: "version",
  //   ellipsis: true
  // },
  // {
  //   title: "创建时间",
  //   dataIndex: "createTime",
  //   ellipsis: true,
  //   render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss")
  // }
];

export function DataStore() {
  const {
    data,
    refetch,
    isRefetching,
    isLoading
  } = useQuery("getDataStore", async () => {
    await waitTime(1000);
    return dataStoreList;
  });
  useEffect(
    () => {
      console.log(data);
    },
    [data]
  );

  return (
    <div className={cn(" w-full h-full")}>
      <div className="table w-full bg-[#02004D4D] max-h-[calc(100%_-_40px)] px-[20px] py-[20px] border-[2px] border-solid border-[#0D53B7]">
        <div
          className={cn(
            `header flex bg-[#00D2D51A] h-[40px] items-center w-full `
          )}
        >
          {columns &&
            columns.map((col: any, colkey: number) =>
              <div
                className={cn("px-[16px] ")}
                style={col.width ? { width: col.width } : { flexGrow: 1 }}
                key={colkey}
              >
                <span className={cn("text-[15px] text-[#ffffff]")}>
                  {col.title}
                </span>
              </div>
            )}
        </div>
        <div className="content w-full ">
          {data &&
            data.map((item: any, index: number) =>
              <div
                className="w-full h-[40px] flex border-solid border-[0px] border-b-[1px] border-[#083FAA]"
                key={index}
              >
                {columns &&
                  columns.map((col: any, colkey: number) =>
                    <div
                      className={cn("px-[16px]  flex items-center ")}
                      style={col.width ? { width: col.width } : { flexGrow: 1 }}
                      key={colkey}
                    >
                      <span className={cn("text-[15px] text-[#ffffff]")}>
                        {col.dataIndex ? item[col.dataIndex] : index + 1}
                      </span>
                    </div>
                  )}
              </div>
            )}
        </div>
      </div>
      <div className="pag  mt-[20px] h-[20px]" />
    </div>
  );
}
