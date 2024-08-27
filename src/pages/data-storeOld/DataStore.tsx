/* eslint-disable prettier/prettier */
import { SyncOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { useQuery } from "react-query";

import { AppBreadcrumb } from "@/components/Breadcrumb";
import { dataStoreList } from "@/services/mockData/dataStore";
import { waitTime } from "@/utils/common";

import styles from "./DataStore.module.less";

const breadCrumbItems = [
  {
    menuHref: "/",
    menuName: "数据仓库"
  }
];

const columns: ColumnsType<any> = [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true
  },
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true
  },
  {
    title: "数据库类型",
    dataIndex: "databaseType",
    ellipsis: true
  },
  {
    title: "描述",
    dataIndex: "description",
    ellipsis: true
  },
  {
    title: "链类型",
    dataIndex: "chainType",
    ellipsis: true
  },
  {
    title: "版本",
    dataIndex: "version",
    ellipsis: true
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    ellipsis: true,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss")
  }
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

  return (
    <div className={styles.dataStore}>
      <div
        onClick={() => void refetch()}
        className="absolute right-0 top-0 flex cursor-pointer items-center text-base text-[#166CDD]"
      >
        <SyncOutlined className={isRefetching ? "animate-spin" : ""} />
        <span className=" pl-2">更新</span>
      </div>
      <AppBreadcrumb breadCrumbItems={breadCrumbItems} />
      <Table
        rowKey="id"
        rowClassName="hover:bg-[#F4FEFF]"
        columns={columns}
        dataSource={data}
        loading={isLoading || isRefetching}
        pagination={{
          position: ["bottomCenter"]
        }}
      />
    </div>
  );
}
