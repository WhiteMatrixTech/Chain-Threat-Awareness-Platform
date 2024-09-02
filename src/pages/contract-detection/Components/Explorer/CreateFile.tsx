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
const FileSuffix = '.sol';

interface ICreateFileProps {
  visible: boolean;
  selectedId: string;
  modalData: IExplorerItem | null;
  onCancel: (type: ExplorerItemType) => void;
}

interface ICreateFileData {
  fileName: string;
}

export function CreateFile(props: ICreateFileProps) {
  const { visible, selectedId, modalData, onCancel } = props;
  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const handleClose = () => {
    onCancel(ExplorerItemType.FILE);
  };

  const { mutate, status } = useMutation(async (data: ICreateFileData) => {
    await waitTime(1000);
    if (modalData) {
      dispatch({
        type: ContractAction.RENAME_ITEM,
        data: {
          id: modalData.id,
          name: data.fileName
        }
      });
    } else {
      dispatch({
        type: ContractAction.ADD_ITEM,
        data: {
          id: uuidv4(),
          parentId: selectedId,
          name: data.fileName,
          type: ExplorerItemType.FILE,
          content: ''
        }
      });
    }

    notification.success({
      message: modalData ? '重命名' : `新增文件 ${data.fileName} 成功`,
      top: 64,
      duration: 2
    });
    handleClose();

    return true;
  });

  const handleSubmit = useCallback(() => {
    void form.validateFields().then((data: ICreateFileData) => {
      data.fileName = `${data.fileName}${FileSuffix}`;
      const checkSucceed = checkFileName(
        selectedId,
        data.fileName,
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
    title: modalData ? '重命名' : '新增合约文件',
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
          label="合约文件名称"
          name="fileName"
          initialValue={modalData?.name.replace('.sol', '')}
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
          <Input
            required={true}
            suffix={FileSuffix}
            placeholder="请输入100字符以内"
          />
        </Item>
      </Form>
    </Modal>
  );
}

function checkFileName(
  selectedId: string,
  fileName: string,
  itemList: IExplorerItem[]
) {
  const files = itemList.filter(
    (item) =>
      item.type === ExplorerItemType.FILE && item.parentId === selectedId
  );
  const targetItem = itemList.find((item) => item.id === selectedId);

  if (files.find((file) => file.name === fileName)) {
    void message.error(
      `${targetItem?.type === ExplorerItemType.PROJECT ? '项目' : '文件夹'}${
        targetItem?.name ?? ''
      }下合约文件 ${fileName} 已存在`
    );

    return false;
  }

  return true;
}
