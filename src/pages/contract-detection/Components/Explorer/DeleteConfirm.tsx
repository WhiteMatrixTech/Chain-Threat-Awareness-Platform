import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, Modal, notification } from 'antd';
import { useMemo } from 'react';
import { useMutation } from 'react-query';

import { waitTime } from '@/utils/common';

import {
  ContractAction,
  ExplorerItemType,
  IExplorerItem,
  useContractContext
} from '../../ContractStore';

interface IDeleteConfirmProps {
  visible: boolean;
  modalData: IExplorerItem | null;
  onCancel: (type: ExplorerItemType) => void;
}

export function DeleteConfirm(props: IDeleteConfirmProps) {
  const { visible, modalData, onCancel } = props;
  const { dispatch } = useContractContext();

  const handleClose = () => {
    onCancel(ExplorerItemType.FILE);
  };

  const { mutate, status } = useMutation(async () => {
    await waitTime(1000);

    modalData &&
      dispatch({
        type: ContractAction.DELETE_ITEM,
        data: {
          id: modalData.id
        }
      });

    notification.success({
      message: '删除成功',
      top: 64,
      duration: 3
    });
    handleClose();

    return true;
  });

  const confirmDelete = () => {
    mutate();
  };

  const title = useMemo(() => {
    if (modalData?.type === ExplorerItemType.FILE) {
      return `确定要删除文件 ${modalData.name} 吗？`;
    } else if (modalData?.type === ExplorerItemType.FOLDER) {
      return `确定要删除文件夹 ${modalData.name} 吗？`;
    } else if (modalData?.type === ExplorerItemType.PROJECT) {
      return `确定要删除项目 ${modalData.name} 吗？`;
    }
    return '';
  }, [modalData?.name, modalData?.type]);

  const modalProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '',
    onCancel: handleClose,
    footer: [
      <Button
        key="submit"
        onClick={confirmDelete}
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
      <div className="flex items-start text-lg">
        <ExclamationCircleTwoTone
          className="mt-1 text-2xl"
          twoToneColor="red"
        />
        <div className="ml-4">
          <div>删除后无法找回</div>
          <div>{title}</div>
        </div>
      </div>
    </Modal>
  );
}
