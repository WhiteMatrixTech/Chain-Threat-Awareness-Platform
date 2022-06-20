import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Input, Layout, Menu } from 'antd';
import React from 'react';

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
  return (
    <AntdHeader className={styles.Header}>
      <div className="flex flex-1 items-center">
        <div className="text-2xl font-black text-[#303133]">
          区块链安全威胁感知平台
        </div>
        <Input placeholder="Search" prefix={prefix} className={styles.search} />
      </div>
      <div className="flex items-center">
        <div className="mr-5 cursor-pointer text-[#30313399] hover:text-[#40a9ff]">
          <BellOutlined className="text-lg" />
        </div>
        <Dropdown
          placement="bottom"
          overlay={
            <Menu theme="dark">
              <Menu.Item key="loginOut">退出账号</Menu.Item>
            </Menu>
          }
        >
          <a
            className="flex items-center text-lg text-[#30313399]"
            onClick={(e) => e.preventDefault()}
          >
            <UserOutlined />
            <span className="pl-1">Admin</span>
          </a>
        </Dropdown>
      </div>
    </AntdHeader>
  );
}
