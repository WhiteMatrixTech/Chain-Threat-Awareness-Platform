import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Input, Layout, Menu } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import store from 'store2';

import { UserContext } from '@/services/context';
import { emitter, EmitterEvent } from '@/services/event';
import { ellipsisAddress } from '@/utils/common';

import styles from './Header.module.less';

const { Header: AntdHeader } = Layout;

const prefix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      color: 'rgba(48, 49, 51, 0.4)'
    }}
  />
);

export function Header() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const handleLogout = ({ key }: { key: string }) => {
    if (key === 'loginOut') {
      emitter.emit(EmitterEvent.logout);

      store.clearAll();
      navigate('/login');
    }
  };

  return (
    <AntdHeader className={styles.Header}>
      <div className="flex flex-1 items-center">
        <div className="text-3xl font-black text-common">
          区块链链上交易可视化平台
        </div>
        <Input placeholder="Search" prefix={prefix} className={styles.search} />
      </div>
      <div className="flex items-center">
        <div className="mr-5 cursor-pointer text-[#30313399] hover:text-[#40a9ff]">
          <BellOutlined className="text-xl" />
        </div>
        <Dropdown
          placement="bottom"
          overlay={
            <Menu
              theme="dark"
              onClick={handleLogout}
              items={[{ label: '退出账号', key: 'loginOut' }]}
            />
          }
        >
          <a
            className="flex items-center text-xl text-[#30313399]"
            onClick={(e) => e.preventDefault()}
          >
            <UserOutlined />
            <span className="pl-1">
              {ellipsisAddress(userInfo?.userId || '')}
            </span>
          </a>
        </Dropdown>
      </div>
    </AntdHeader>
  );
}
