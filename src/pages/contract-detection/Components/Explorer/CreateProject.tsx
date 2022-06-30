import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select
} from 'antd';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { waitTime } from '@/utils/common';

import {
  ContractAction,
  ExplorerItemType,
  ProjectType,
  useContractContext
} from '../../ContractStore';

const { Item } = Form;
const Option = Select.Option;
export const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

interface ICreateProjectProps {
  visible: boolean;
  onCancel: (type: ExplorerItemType) => void;
}

interface ICreateProjectData {
  projectName: string;
  projectType: string;
}

export function CreateProject({ visible, onCancel }: ICreateProjectProps) {
  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const handleClose = () => {
    onCancel(ExplorerItemType.PROJECT);
  };

  const { mutate, status } = useMutation(async (data: ICreateProjectData) => {
    await waitTime(1000);

    dispatch({
      type: ContractAction.ADD_ITEM,
      data: {
        id: uuidv4(),
        parentId: null,
        name: data.projectName,
        type: ExplorerItemType.PROJECT,
        projectType: ProjectType.ETH
      }
    });

    notification.success({
      message: `新增项目 ${data.projectName} 成功`,
      top: 64,
      duration: 3
    });
    handleClose();

    return true;
  });

  const handleSubmit = () => {
    void form.validateFields().then((data: ICreateProjectData) => {
      if (
        contractState.explorerList.find(
          (item) => item.projectType && item.name === data.projectName
        )
      ) {
        void message.error(`项目名称 ${data.projectName} 已存在`);
        return;
      }

      mutate(data);
    });
  };

  const modalProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '新增项目',
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
          label="项目名称"
          name="projectName"
          rules={[
            {
              required: true,
              message: '请输入项目名称'
            },
            {
              max: 100,
              message: '请输入100字符以内'
            }
          ]}
        >
          <Input required={true} placeholder="请输入项目名称" />
        </Item>
        <Item
          label="项目类型"
          name="projectType"
          rules={[
            {
              required: true,
              message: '请选择项目类型'
            }
          ]}
        >
          <Select placeholder="请选择项目类型">
            {Object.keys(ProjectType).map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}
