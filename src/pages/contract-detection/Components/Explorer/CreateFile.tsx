import { Button, Form, Input, message, Modal, notification } from 'antd';
import { useMutation } from 'react-query';

import { waitTime } from '@/utils/common';

import { ContractAction, useContractContext } from '../../ContractStore';
import { formItemLayout } from './CreateProject';

const { Item } = Form;
const FileSuffix = '.sol';

interface ICreateFileProps {
  visible: boolean;
  projectName: string;
  onCancel: () => void;
}

interface ICreateFileData {
  fileName: string;
}

export function CreateFile({
  visible,
  projectName,
  onCancel
}: ICreateFileProps) {
  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const { mutate, status } = useMutation(async (data: ICreateFileData) => {
    await waitTime(1000);

    notification.success({
      message: `新增文件 ${data.fileName} 成功`,
      top: 64,
      duration: 3
    });
    onCancel();

    return true;
  });

  const handleSubmit = () => {
    void form.validateFields().then((data: ICreateFileData) => {
      const fileName = `${data.fileName}${FileSuffix}`;
      const project = contractState.projects.find(
        (project) => project.name === projectName
      );
      if (project?.files.find((file) => file.name === fileName)) {
        void message.error(`项目${projectName}下合约文件 ${fileName} 已存在`);
        return;
      }

      dispatch({
        type: ContractAction.ADD_FILE,
        data: {
          fileName: fileName,
          fileContent: '',
          projectName
        }
      });

      mutate(data);
    });
  };

  const modalProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '新增合约文件',
    onCancel: onCancel,
    footer: [
      <Button
        key="submit"
        onClick={handleSubmit}
        loading={status === 'loading'}
        type="primary"
      >
        确定
      </Button>,
      <Button key="cancel" onClick={onCancel}>
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
