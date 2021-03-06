import { BellOutlined, FileOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tooltip } from 'antd';
import cn from 'classnames';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

import { DefaultButton, PrimaryButton } from '@/components/Button';
import {
  ContractDetectionResults,
  ResultIconColor
} from '@/services/mockData/contractDetection';
import { waitTime } from '@/utils/common';
import { originSolcVersionList } from '@/utils/constants';

import { useContractContext } from '../../ContractStore';
import styles from './Detection.module.less';

const Option = Select.Option;

export function Detection() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const {
    contractState: { openFiles, focusFileId }
  } = useContractContext();

  useEffect(() => {
    if (focusFileId) {
      form.setFieldsValue({
        file: openFiles.find((file) => file.id === focusFileId)?.id
      });
    }
  }, [focusFileId, form, openFiles]);

  const { mutate, data, status, reset } = useMutation(async () => {
    await waitTime(1000);
    return {
      file: 'ETH_default/Storage.sol',
      result: ContractDetectionResults
    };
  });

  const handleSubmit = () => {
    void form.validateFields().then((data) => {
      mutate();
    });
  };

  const handleClickView = () => {
    navigate('/threat-detection/detection-chart');
  };

  const handleReset = () => {
    reset();
    form.resetFields();
  };

  return (
    <div className={cn(styles.Detection, 'h-full bg-white px-2 py-[18px]')}>
      {!data && (
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item
            name="file"
            rules={[
              {
                required: true,
                message: '请选择检测合约文件'
              }
            ]}
          >
            <Select placeholder="请选择检测合约文件">
              {openFiles.map((file) => (
                <Option key={file.id} value={file.id}>
                  {file.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contractName"
            rules={[
              {
                required: true,
                message: '请输入主合约名称'
              }
            ]}
          >
            <Input placeholder="请输入主合约名称" />
          </Form.Item>
          <Form.Item
            name="contract0"
            rules={[
              {
                required: true,
                message: '请输入主合约部署参数'
              }
            ]}
          >
            <Input placeholder="请输入主合约部署参数" />
          </Form.Item>
          <Form.Item
            name="compileVersion"
            rules={[
              {
                required: true,
                message: '请选择编译版本'
              }
            ]}
          >
            <Select placeholder="请选择编译版本">
              {originSolcVersionList.map((version) => (
                <Option key={version} value={version}>
                  {version}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <PrimaryButton onClick={handleSubmit} loading={status === 'loading'}>
            开始
          </PrimaryButton>
        </Form>
      )}
      {data && (
        <div>
          <div className="text-center text-xl font-semibold">检测完毕</div>
          <div className="mt-3 mb-2 flex items-center justify-center">
            <FileOutlined />
            <Tooltip title={`File:${data.file}`}>
              <span className="max-w-full overflow-hidden text-ellipsis pl-1 text-base">
                File:{data.file}
              </span>
            </Tooltip>
          </div>
          <ul className="mb-20 flex flex-col items-center justify-center gap-y-2 text-center">
            {data.result.map((item, index) => (
              <li
                key={`${index}-${item.message}`}
                className="flex items-center justify-center"
              >
                <BellOutlined
                  className="text-base"
                  style={{ color: ResultIconColor[item.type] }}
                />
                <Tooltip
                  title={`${index}.${item.message}(${item.position.line} line)`}
                >
                  <span className="max-w-full overflow-hidden text-ellipsis pl-1 text-base">{`${index}.${item.message}(${item.position.line} line)`}</span>
                </Tooltip>
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={handleClickView} className="mb-2">
            查看报告
          </PrimaryButton>
          <DefaultButton onClick={handleReset}>返回</DefaultButton>
        </div>
      )}
    </div>
  );
}
