import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { flatMenuList, MenuList } from './_menu';
import styles from './LeftMenu.module.less';

export function LeftMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  useEffect(() => {
    const currentMenu = flatMenuList.find((menu) => menu.key === pathname);
    if (currentMenu) {
      setExpandedKeys(currentMenu.parentKeys);
      setSelectedKeys([currentMenu.key]);
    }
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
    navigate(e.key);
  };

  return (
    <div className={cn(styles.LeftMenu, 'h-screen overflow-hidden')}>
      <Menu
        mode="inline"
        onClick={onClick}
        openKeys={expandedKeys}
        selectedKeys={selectedKeys}
        onOpenChange={setExpandedKeys}
        items={MenuList}
      />
    </div>
  );
}
