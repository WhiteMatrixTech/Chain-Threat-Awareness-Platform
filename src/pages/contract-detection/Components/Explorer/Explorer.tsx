import {
  AppstoreAddOutlined,
  CloudUploadOutlined,
  FileAddOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, message, Tooltip, Tree } from 'antd';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import cn from 'classnames';
import { cloneDeep } from 'lodash';
import { Key, useMemo, useState } from 'react';

import { arrToTreeData } from '@/services/mockData/contractDetection';

import {
  ContractAction,
  ExplorerItemType,
  IExplorerItem,
  useContractContext
} from '../../ContractStore';
import { CreateFile } from './CreateFile';
import { CreateFolder } from './CreateFolder';
import { CreateProject } from './CreateProject';
import styles from './Explorer.module.less';

type ContractNode = DataNode & { data: IExplorerItem };
interface ModalShowConfig {
  type: ExplorerItemType;
  visible: boolean;
}
const NodeIcon = {
  [ExplorerItemType.PROJECT]: <ProjectOutlined />,
  [ExplorerItemType.FOLDER]: <FolderOutlined />,
  [ExplorerItemType.FILE]: <FileOutlined />
};

const getDomTree = (treeData: IExplorerItem[]): ContractNode[] => {
  return treeData.map((item) => {
    return {
      data: item,
      title: item.name,
      key: item.id,
      isLeaf: item.children?.length === 0,
      icon: NodeIcon[item.type],
      children: item?.children ? getDomTree(item?.children) : []
    };
  });
};

export function Explorer() {
  const { contractState, dispatch } = useContractContext();

  const contractTreeData = useMemo(() => {
    const explorerList = cloneDeep(contractState.explorerList);
    const treeData = arrToTreeData(explorerList);

    return getDomTree(treeData);
  }, [contractState.explorerList]);

  const [selectedNode, setSelectedNode] = useState<ContractNode | null>(null);
  const onSelect = (
    selectedKeys: Key[],
    info: {
      node: EventDataNode<ContractNode>;
    }
  ) => {
    setSelectedNode(info.node);

    if (info.node.data.type === ExplorerItemType.FILE) {
      dispatch({
        type: ContractAction.OPEN_FILE,
        data: {
          id: `${info.node.key}`,
          name: info.node.data.name,
          type: ExplorerItemType.FILE,
          content: info.node.data.content ?? ''
        }
      });
    }
  };

  const [modalShowConfig, setModalShowConfig] = useState<ModalShowConfig>({
    type: ExplorerItemType.FILE,
    visible: false
  });
  const closeModal = (type: ExplorerItemType) => {
    setModalShowConfig({
      type: type,
      visible: false
    });
  };
  const openCreateProject = () => {
    setModalShowConfig({
      type: ExplorerItemType.PROJECT,
      visible: true
    });
  };

  const openCreateFolder = () => {
    if (selectedNode?.data.type !== ExplorerItemType.PROJECT) {
      const tips =
        selectedNode?.data.type === ExplorerItemType.FILE
          ? '文件下不能创建文件'
          : '请先选中项目';
      void message.error(tips);
      return;
    }
    setModalShowConfig({
      type: ExplorerItemType.FOLDER,
      visible: true
    });
  };

  const openCreateFile = () => {
    if (
      !selectedNode?.data.type ||
      selectedNode?.data.type === ExplorerItemType.FILE
    ) {
      const tips =
        selectedNode?.data.type === ExplorerItemType.FILE
          ? '文件下不能创建文件'
          : '请先选中项目或文件夹';
      void message.error(tips);
      return;
    }
    setModalShowConfig({
      type: ExplorerItemType.FILE,
      visible: true
    });
  };

  const modal = useMemo(() => {
    if (modalShowConfig.visible) {
      switch (modalShowConfig.type) {
        case 'project':
          return (
            <CreateProject
              visible={modalShowConfig.visible}
              onCancel={closeModal}
            />
          );
        case 'folder':
          return (
            <CreateFolder
              selectedId={`${selectedNode?.key ?? ''}`}
              visible={modalShowConfig.visible}
              onCancel={closeModal}
            />
          );
        case 'file':
          return (
            <CreateFile
              selectedId={`${selectedNode?.key ?? ''}`}
              visible={modalShowConfig.visible}
              onCancel={closeModal}
            />
          );
      }
    }
    return null;
  }, [modalShowConfig.type, modalShowConfig.visible, selectedNode?.key]);

  return (
    <div className={cn(styles.Explorer, 'h-full bg-white p-3')}>
      <div className="flex items-center justify-between border-b-[0.75px] border-solid border-[#EBF0F5] px-1 pt-1 pb-4">
        <Tooltip title="新增项目">
          <AppstoreAddOutlined
            onClick={openCreateProject}
            className="cursor-pointer text-base hover:text-[#40a9ff]"
          />
        </Tooltip>
        <Tooltip title="新增合约文件夹">
          <FolderAddOutlined
            onClick={openCreateFolder}
            className="cursor-not-allowed text-base hover:text-[#40a9ff]"
          />
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
          treeData={contractTreeData}
          className="w-full overflow-x-hidden"
          selectedKeys={selectedNode?.key ? [selectedNode?.key] : undefined}
          titleRender={(nodeData) => <TreeNode nodeData={nodeData} />}
        />
      </div>
      {modal}
    </div>
  );
}

function TreeNode({ nodeData }: { nodeData: ContractNode }) {
  const { dispatch } = useContractContext();
  const onClick = ({
    key,
    domEvent
  }: {
    key: string;
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();

    if (key === 'delete') {
      dispatch({
        type: ContractAction.DELETE_ITEM,
        data: {
          id: nodeData.data.id
        }
      });
    }
  };

  const menu = (
    <Menu
      onClick={onClick}
      items={[
        // {
        //   label: '重命名',
        //   key: 'rename'
        // },
        {
          label: '删除',
          key: 'delete'
        }
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
        {nodeData.title}
      </div>
    </Dropdown>
  );
}
