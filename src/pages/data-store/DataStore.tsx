import { SyncOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import { AppBreadcrumb } from '@/components/Breadcrumb';
import { dataStoreList } from '@/services/mockData/dataStore';
import { waitTime } from '@/utils/common';

import styles from './DataStore.module.less';

const breadCrumbItems = [
  {
    menuHref: '/',
    menuName: '数据仓库'
  }
];

const columns: ColumnsType<any> = [
  {
    title: 'ID',
    dataIndex: 'id',
    ellipsis: true
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '数据库类型',
    dataIndex: 'databaseType',
    ellipsis: true
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true
  },
  {
    title: '链类型',
    dataIndex: 'chainType',
    ellipsis: true
  },
  {
    title: '数据量',
    dataIndex: 'version',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
  }
];

export function DataStore() {
  const { data, refetch, isRefetching, isLoading } = useQuery(
    'getDataStore',
    async () => {
      await waitTime(1000);
      return dataStoreList;
    }
  );

  return (
    <div className={styles.dataStore}>
      <div
        onClick={() => void refetch()}
        className="absolute right-0 top-0 flex cursor-pointer items-center text-base text-[#166CDD]"
      >
        <SyncOutlined className={isRefetching ? 'animate-spin' : ''} />
        <span className=" pl-2">更新</span>
      </div>
      <AppBreadcrumb breadCrumbItems={breadCrumbItems} />
      <Row gutter={64} className="px-20">
        {data?.map((item) => (
          <Col span={8} key={item.id}>
            <Card
              title={item.name}
              className="w-full overflow-hidden rounded-md"
              hoverable={true}
              style={{
                background: 'linear-gradient(#E0E1ED, #fff)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              bodyStyle={{ backgroundColor: 'transparent' }}
              headStyle={{ backgroundColor: 'transparent' }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[#818181]">ID</span>
                  <span>{item.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#818181]">数据库类型</span>
                  <span>{item.databaseType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#818181]">描述</span>
                  <span>{item.description}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#818181]">链类型</span>
                  <span>{item.chainType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#818181]">数据量</span>
                  <span>{item.version}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#818181]">创建时间</span>
                  <span>{item.createTime}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
