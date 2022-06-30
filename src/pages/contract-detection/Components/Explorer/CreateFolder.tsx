import { Button, Form, Input, message, Modal, notification } from 'antd';
import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { waitTime } from '@/utils/common';

import {
  ContractAction,
  ExplorerItemType,
  IExplorerItem,
  useContractContext
} from '../../ContractStore';
import { formItemLayout } from './CreateProject';

const { Item } = Form;

interface ICreateFolderProps {
  visible: boolean;
  selectedId: string;
  modalData: IExplorerItem | null;
  onCancel: (type: ExplorerItemType) => void;
}

interface ICreateFolderData {
  folderName: string;
}

export function CreateFolder(props: ICreateFolderProps) {
  const { visible, selectedId, modalData, onCancel } = props;
  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const handleClose = () => {
    onCancel(ExplorerItemType.FOLDER);
  };

  const { mutate, status } = useMutation(async (data: ICreateFolderData) => {
    await waitTime(1000);

    if (modalData) {
      dispatch({
        type: ContractAction.RENAME_ITEM,
        data: {
          id: modalData.id,
          name: data.folderName
        }
      });
    } else {
      dispatch({
        type: ContractAction.ADD_ITEM,
        data: {
          id: uuidv4(),
          parentId: selectedId,
          name: data.folderName,
          type: ExplorerItemType.FOLDER,
          content: ''
        }
      });
    }

    notification.success({
      message: modalData ? '重命名' : `新增文件夹 ${data.folderName} 成功`,
      top: 64,
      duration: 2
    });
    handleClose();

    return true;
  });

  const handleSubmit = useCallback(() => {
    void form.validateFields().then((data: ICreateFolderData) => {
      const folderName = data.folderName;
      const checkSucceed = checkFileName(
        selectedId,
        folderName,
        contractState.explorerList
      );
      if (!checkSucceed) {
        return;
      }

      mutate(data);
    });
  }, [contractState.explorerList, form, mutate, selectedId]);

  const modalProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: modalData ? '重命名' : '新增合约文件夹',
    onCancel: handleClose,
    footer: [
      <Button
        key="submit"
        onClick={handleSubmit}
        loading={status === 'loading'}
        type="primary"
      >
        确定
      </Button>,
      <Button key="cancel" onClick={handleClose}>
        取消
      </Button>
    ]
  };

  return (
    <Modal {...modalProps}>
      <Form {...formItemLayout} form={form}>
        <Item
          label="文件夹名称"
          name="folderName"
          initialValue={modalData?.name}
          rules={[
            {
              required: true,
              message: '请输入合约文件名称'
            },
            {
              max: 100,
              message: '请输入100字符以内'
            }
          ]}
        >
          <Input required={true} placeholder="请输入100字符以内" />
        </Item>
      </Form>
    </Modal>
  );
}

function checkFileName(
  selectedId: string,
  folderName: string,
  itemList: IExplorerItem[]
) {
  const folders = itemList.filter(
    (item) =>
      item.type === ExplorerItemType.FOLDER && item.parentId === selectedId
  );
  const targetItem = itemList.find((item) => item.id === selectedId);

  if (folders.find((file) => file.name === folderName)) {
    void message.error(
      `项目${targetItem?.name ?? ''}下合约文件夹 ${folderName} 已存在`
    );

    return false;
  }

  return true;
}
