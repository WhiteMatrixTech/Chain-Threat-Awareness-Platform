import { BellOutlined, FileOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tooltip } from 'antd';
import cn from 'classnames';
import { cloneDeep } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

import { DefaultButton, PrimaryButton } from '@/components/Button';
import {
  arrToTreeData,
  ContractDetectionResults,
  ResultColor,
  ResultIconColor
} from '@/services/mockData/contractDetection';
import { detectContract, IDetectContractRequest } from '@/services/transaction';
import { waitTime } from '@/utils/common';
import { originSolcVersionList } from '@/utils/constants';

import { IExplorerItem, useContractContext } from '../../ContractStore';
import styles from './Detection.module.less';

const Option = Select.Option;

export function Detection() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const {
    contractState: { openFiles, focusFileId, explorerList }
  } = useContractContext();

  useEffect(() => {
    if (focusFileId) {
      form.setFieldsValue({
        file: openFiles.find((file) => file.id === focusFileId)?.id
      });
    }
  }, [focusFileId, form, openFiles]);

  const { mutate, data, status, reset } = useMutation(
    async (params: IDetectContractRequest) => {
      const data = await detectContract(params);

      return {
        file: 'ETH_default/Storage.sol',
        result: data
      };
      // await waitTime(1000);
      // return {
      //   file: 'ETH_default/Storage.sol',
      //   result: ContractDetectionResults
      // };
    }
  );

  const handleSubmit = () => {
    void form
      .validateFields()
      .then((data: { fileContent: string; compileVersion: string }) => {
        const { fileContent, compileVersion } = data;

        mutate({
          source_code: fileContent,
          version: compileVersion,
          model: 'contractFuzzer'
        });
      });
  };

  const handleClickView = () => {
    navigate(
      `/threat-detection/detection-chart?result=${window.btoa(
        JSON.stringify(data?.result || '')
      )}`
    );
  };

  const handleReset = () => {
    reset();
    form.resetFields();
  };

  // const contractTreeData = useMemo(() => {
  //   const List = cloneDeep(explorerList);
  //   const treeData = arrToTreeData(List);

  //   return treeData;
  // }, [explorerList]);

  return (
    <div className={cn(styles.Detection, 'h-full bg-white px-2 py-[18px]')}>
      {!data && (
        <Form form={form} wrapperCol={{ span: 24 }}>
          {/* <Form.Item
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
                <Option key={file.id} value={file.name}>
                  {file.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item
            name="fileContent"
            rules={[
              {
                required: true,
                message: '请选择检测合约文件'
              }
            ]}
            initialValue={openFiles[0].content}
          >
            <Select placeholder="请选择检测合约文件">
              {openFiles.map((file) => (
                <Option key={file.id} value={file.content}>
                  {file.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contractName"
            initialValue="模糊测试"
            rules={[
              {
                required: true,
                message: '请选择检测模式'
              }
            ]}
          >
            <Select placeholder="选择检测模式">
              <Option value="模糊测试">模糊测试</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="contract0"
            rules={[
              {
                required: false,
                message: '请输入主合约部署参数'
              }
            ]}
          >
            <Input placeholder="请输入主合约部署参数" />
          </Form.Item>
          <Form.Item
            name="compileVersion"
            initialValue="0.4.26"
            rules={[
              {
                required: true,
                message: '请选择编译版本'
              }
            ]}
          >
            <Select placeholder="请选择编译版本">
              {/*  {originSolcVersionList.map((version) => (
                <Option key={version} value={version}>
                  {version}
                </Option>
              ))} */}
              <Option value="o.4.26">0.4.24</Option>
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
          <ul className="mb-20 flex flex-col items-start justify-center gap-y-2 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {data.result.map((item, index) => (
              <li
                key={`${index}-${item.description}`}
                className="flex w-full items-start justify-start"
              >
                <BellOutlined
                  className="mt-1 text-base"
                  style={{ color: ResultColor[item.security] }}
                />
                <Tooltip
                  title={`${index}.${item.description}(${item.line} line)`}
                >
                  <span className="max-w-full overflow-hidden text-ellipsis pl-[1px] text-base">{`${index}.${item.description}(${item.line} line)`}</span>
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
