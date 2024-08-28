/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-08-28 15:40:46
 */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import arrowLeft from "@/assets/arrowleft.png";
import arrowRight from "@/assets/arrowright.png";
import { AppBreadcrumb } from "@/components/Breadcrumb";
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
    total: 0
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
        <div
          className={cn(`w-[200px] h-[20px] flex items-center gap-x-[10px]`)}
        >
          <div className={cn(`${pattern.flexCenter} info w-[50px] h-full`)}>
            <span className="text-[15px] text-[#ffffff]">
              共{pageInfo.total}条
            </span>
          </div>
          <div
            className={cn(`num  flex-1 flex gap-x-[10px]  h-full select-none`)}
          >
            <div
              className={cn(
                `arrowleft w-[20px] h-full  ${pattern.flexCenter}  hover:cursor-pointer`
              )}
              onClick={() => {
                if (pageInfo.currentPage === 0) return;
                setpageInfo({
                  ...pageInfo,
                  currentPage: pageInfo.currentPage - 1
                });
              }}
            >
              <img className="" src={arrowLeft} width={6} height={7} />
            </div>
            <div
              className={cn(
                `numContent flex items-center gap-x-[19px] flex-1 h-full hover:cursor-pointer`
              )}
            >
              {[1, 2, 3].map((item, index) =>
                <div key={index} className={cn(" hover:cursor-pointer")}>
                  <span
                    className={cn(
                      "text-[15px] text-[#ffffff]",
                      pageInfo.currentPage === item
                        ? "opacity-100"
                        : "opacity-60"
                    )}
                    onClick={() => {
                      setpageInfo({
                        ...pageInfo,
                        currentPage: item
                      });
                    }}
                  >
                    {item}
                  </span>
                </div>
              )}
            </div>
            <div
              className={cn(
                `arrowright w-[20px] h-full  ${pattern.flexCenter}  hover:cursor-pointer`
              )}
              onClick={() => {
                if (pageInfo.currentPage === 3) return;
                setpageInfo({
                  ...pageInfo,
                  currentPage: pageInfo.currentPage + 1
                });
              }}
            >
              <img className="" src={arrowRight} width={6} height={7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
