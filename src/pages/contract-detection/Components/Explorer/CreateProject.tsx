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

import { waitTime } from '@/utils/common';

import {
  ContractAction,
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
  onCancel: () => void;
}

interface ICreateProjectData {
  projectName: string;
  projectType: string;
}

export function CreateProject({ visible, onCancel }: ICreateProjectProps) {
  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const { mutate, status } = useMutation(async (data: ICreateProjectData) => {
    await waitTime(1000);

    notification.success({
      message: `新增项目 ${data.projectName} 成功`,
      top: 64,
      duration: 3
    });
    onCancel();

    return true;
  });

  const handleSubmit = () => {
    void form.validateFields().then((data: ICreateProjectData) => {
      if (
        contractState.projects.find(
          (project) => project.name === data.projectName
        )
      ) {
        void message.error(`项目名称 ${data.projectName} 已存在`);
        return;
      }

      dispatch({
        type: ContractAction.ADD_PROJECT,
        data: {
          name: data.projectName
        }
      });

      mutate(data);
    });
  };

  const modalProps = {
    visible: visible,
    closable: true,
    destroyOnClose: true,
    title: '新增项目',
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
