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
  IExplorerItem,
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
  modalData: IExplorerItem | null;
  onCancel: (type: ExplorerItemType) => void;
}

interface ICreateProjectData {
  projectName: string;
  projectType: string;
}

export function CreateProject(props: ICreateProjectProps) {
  const { visible, modalData, onCancel } = props;

  const [form] = Form.useForm();
  const { contractState, dispatch } = useContractContext();

  const handleClose = () => {
    onCancel(ExplorerItemType.PROJECT);
  };

  const { mutate, status } = useMutation(async (data: ICreateProjectData) => {
    await waitTime(1000);

    if (modalData) {
      dispatch({
        type: ContractAction.RENAME_ITEM,
        data: {
          id: modalData.id,
          name: data.projectName
        }
      });
    } else {
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
    }

    notification.success({
      message: modalData ? '修改项目成功' : `新增项目 ${data.projectName} 成功`,
      top: 64,
      duration: 2
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
    title: modalData ? '修改项目' : '新增项目',
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
          initialValue={modalData?.name}
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
          initialValue={modalData?.projectType}
          rules={[
            {
              required: true,
              message: '请选择项目类型'
            }
          ]}
        >
          <Select disabled={!!modalData} placeholder="请选择项目类型">
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
