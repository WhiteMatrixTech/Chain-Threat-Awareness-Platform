import {
  CloudUploadOutlined,
  DoubleRightOutlined,
  FileAddOutlined,
  FileOutlined,
  FolderAddOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Tree } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import cn from 'classnames';
import { useMemo } from 'react';

import { useContractContext } from '../../ContractStore';
import styles from './Explorer.module.less';

export function Explorer() {
  const { contractState, dispatch } = useContractContext();

  const contractTreeData: DataNode[] = useMemo(
    () =>
      contractState.files.map((folder) => {
        return {
          title: folder.name,
          key: folder.name,
          children: folder.files.map((file) => {
            return {
              title: file.name,
              key: file.name,
              icon: <FileOutlined />
            };
          })
        };
      }),
    [contractState.files]
  );

  return (
    <div className={cn(styles.Explorer, 'h-full bg-white p-3')}>
      <div className="flex items-center justify-between border-b-[0.75px] border-solid border-[#EBF0F5] px-1 pt-1 pb-4">
        <MenuOutlined className="cursor-pointer text-base hover:text-[#40a9ff]" />
        <FolderAddOutlined className="cursor-pointer text-base hover:text-[#40a9ff]" />
        <FileAddOutlined className="cursor-pointer text-base hover:text-[#40a9ff]" />
        <CloudUploadOutlined className="cursor-pointer text-base hover:text-[#40a9ff]" />
      </div>
      <div className="my-2 mx-1">
        <Tree
          showIcon={true}
          switcherIcon={({ expanded }) =>
            expanded ? (
              <DoubleRightOutlined className="rotate-90" />
            ) : (
              <DoubleRightOutlined className="rotate-90" />
            )
          }
          treeData={contractTreeData}
        />
      </div>
    </div>
  );
}
