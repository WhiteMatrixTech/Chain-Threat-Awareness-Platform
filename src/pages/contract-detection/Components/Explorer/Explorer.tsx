import {
  BarsOutlined,
  CloudUploadOutlined,
  DoubleRightOutlined,
  FileAddOutlined,
  FileOutlined,
  FolderAddOutlined
} from '@ant-design/icons';
import { message, Tooltip, Tree } from 'antd';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import cn from 'classnames';
import { Key, useMemo, useState } from 'react';

import {
  ContractAction,
  FileType,
  useContractContext
} from '../../ContractStore';
import { CreateFile } from './CreateFile';
import { CreateProject } from './CreateProject';
import styles from './Explorer.module.less';

type ContractNode = DataNode & { type: string; content?: string };

export function Explorer() {
  const { contractState, dispatch } = useContractContext();

  const contractTreeData: ContractNode[] = useMemo(
    () =>
      contractState.projects.map((project) => {
        return {
          type: project.type,
          title: project.name,
          key: project.name,
          isLeaf: false,
          children: project.files.map((file) => {
            return {
              type: file.type,
              title: file.name,
              key: file.name,
              content: file.content,
              icon: <FileOutlined />
            };
          })
        };
      }),
    [contractState.projects]
  );

  const [selectedNode, setSelectedNode] = useState<ContractNode | null>(null);
  const onSelect = (
    selectedKeys: Key[],
    info: {
      node: EventDataNode<ContractNode>;
    }
  ) => {
    setSelectedNode(info.node);

    if (info.node.type === FileType.FILE) {
      dispatch({
        type: ContractAction.OPEN_FILE,
        data: {
          name: `${info.node.key}`,
          type: FileType.FILE,
          content: info.node.content ?? ''
        }
      });
    }
  };

  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const openCreateProject = () => {
    setCreateProjectVisible(true);
  };
  const closeCreateProject = () => {
    setCreateProjectVisible(false);
  };

  const [createFileVisible, setCreateFileVisible] = useState(false);
  const openCreateFile = () => {
    if (selectedNode?.type !== FileType.PROJECT) {
      const tips =
        selectedNode?.type === FileType.FILE
          ? '文件下不能创建文件'
          : '请先选中项目或文件夹';
      void message.error(tips);
      return;
    }
    setCreateFileVisible(true);
  };
  const closeCreateFile = () => {
    setCreateFileVisible(false);
  };

  return (
    <div className={cn(styles.Explorer, 'h-full bg-white p-3')}>
      <div className="flex items-center justify-between border-b-[0.75px] border-solid border-[#EBF0F5] px-1 pt-1 pb-4">
        <Tooltip title="新增项目">
          <BarsOutlined
            onClick={openCreateProject}
            className="cursor-pointer text-base hover:text-[#40a9ff]"
          />
        </Tooltip>
        <Tooltip title="新增合约文件夹（功能开发中）">
          <FolderAddOutlined className="cursor-not-allowed text-base hover:text-[#40a9ff]" />
        </Tooltip>
        <Tooltip title="新增合约文件">
          <FileAddOutlined
            onClick={openCreateFile}
            className="cursor-pointer text-base hover:text-[#40a9ff]"
          />
        </Tooltip>
        <Tooltip title="上传（功能开发中）">
          <CloudUploadOutlined className="cursor-not-allowed text-base hover:text-[#40a9ff]" />
        </Tooltip>
      </div>
      <div className="my-2">
        <Tree
          showIcon={true}
          onSelect={onSelect}
          defaultExpandAll={true}
          selectedKeys={[contractState.focusFile]}
          switcherIcon={({ expanded }) =>
            expanded ? (
              <DoubleRightOutlined className="rotate-90 !text-sm" />
            ) : (
              <DoubleRightOutlined className="rotate-90 !text-sm" />
            )
          }
          treeData={contractTreeData}
        />
      </div>
      {createProjectVisible && (
        <CreateProject
          visible={createProjectVisible}
          onCancel={closeCreateProject}
        />
      )}
      {createFileVisible && (
        <CreateFile
          visible={createFileVisible}
          onCancel={closeCreateFile}
          projectName={`${selectedNode?.key ?? ''}`}
        />
      )}
    </div>
  );
}
