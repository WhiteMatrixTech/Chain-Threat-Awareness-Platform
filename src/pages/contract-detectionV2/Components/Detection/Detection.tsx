/* eslint-disable @typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { BellOutlined, FileOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tooltip } from 'antd';
import cn from 'classnames';
import { cloneDeep, sortBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

import { DefaultButton, PrimaryButton } from '@/components/Button';
import { ButtonCommon } from '@/components/ButtonCommon';
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
  const defaultAbiCode = JSON.stringify([
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      inputs: [],
      name: 'Admin',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'BurnRecords',
      outputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'Community',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'DAOLab',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'DEXDisable',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'NODE',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'NoFee',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'NoWhiteListSell',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'Owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'PerDAYSecond',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'USDT',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: 'accounts',
          type: 'address[]'
        },
        { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }
      ],
      name: 'addLockTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' }
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'user', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' }
      ],
      name: 'calcCurrectStakeReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'day', type: 'uint256' }
      ],
      name: 'calcPerDayStakeReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        {
          internalType: 'uint256',
          name: 'subtractedValue',
          type: 'uint256'
        }
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }],
      name: 'getDay',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }],
      name: 'getMonth',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: '_day', type: 'uint256' }],
      name: 'getRateFromDay',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'getUserTokenLock',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'account', type: 'address' },
            {
              internalType: 'uint256',
              name: 'totalAmount',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'paidReward',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'perMonthReward',
              type: 'uint256'
            }
          ],
          internalType: 'struct WTOS.lockData[]',
          name: '',
          type: 'tuple[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
      name: 'getUserTokenStake',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'account', type: 'address' },
            { internalType: 'uint256', name: 'day', type: 'uint256' },
            { internalType: 'uint256', name: 'rate', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'perDayReward',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'stakeAmount',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'paidReward',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'startTime',
              type: 'uint256'
            },
            { internalType: 'bool', name: 'finish', type: 'bool' }
          ],
          internalType: 'struct WTOS.stakeData[]',
          name: '',
          type: 'tuple[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'addedValue', type: 'uint256' }
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'initialSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: '_day', type: 'uint256' }],
      name: 'isValidDay',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
      name: 'newOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'originERC20',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'ownerSender',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'permission',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'setDex',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'setNoFee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'setOriginERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256[4]',
          name: '_stakeDays',
          type: 'uint256[4]'
        }
      ],
      name: 'setStakeDays',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_stakeMinAmount',
          type: 'uint256'
        }
      ],
      name: 'setStakeDays',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
      name: 'setWhiteList',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256[4]',
          name: '_stakeRate',
          type: 'uint256[4]'
        }
      ],
      name: 'setstakeRate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: '_day', type: 'uint256' }
      ],
      name: 'stake',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'stakeDays',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'stakeMinAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'stakeRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: '', type: 'address' },
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
      name: 'tokenLock',
      outputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'paidReward', type: 'uint256' },
        { internalType: 'uint256', name: 'startTime', type: 'uint256' },
        {
          internalType: 'uint256',
          name: 'perMonthReward',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: '', type: 'address' },
        { internalType: 'uint256', name: '', type: 'uint256' }
      ],
      name: 'tokenStake',
      outputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'day', type: 'uint256' },
        { internalType: 'uint256', name: 'rate', type: 'uint256' },
        {
          internalType: 'uint256',
          name: 'perDayReward',
          type: 'uint256'
        },
        { internalType: 'uint256', name: 'stakeAmount', type: 'uint256' },
        { internalType: 'uint256', name: 'paidReward', type: 'uint256' },
        { internalType: 'uint256', name: 'startTime', type: 'uint256' },
        { internalType: 'bool', name: 'finish', type: 'bool' }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalLockAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalStakeAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'uniswapV2Pair',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'uniswapV2Router',
      outputs: [
        {
          internalType: 'contract IPancakeSwapV2Router01',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
      name: 'unstake',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'whiteList',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
      name: 'withdrawStakeReward',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
      name: 'withdrawUnlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAfterChain] = Form.useForm();
  const [loading, setloading] = useState(false);

  const {
    contractState: { openFiles, focusFileId, explorerList, chainFlag }
  } = useContractContext();

  useEffect(() => {
    if (focusFileId) {
      if (chainFlag === 'offchain') {
        form.setFieldsValue({
          fileId: openFiles.find((file) => file.id === focusFileId)?.id
        });
      } else {
        formAfterChain.setFieldsValue({
          abi_code: openFiles.find((file) => file.id === focusFileId)?.content
        });
      }
    }
  }, [focusFileId, form, openFiles]);

  const { mutate, data, status, reset } = useMutation(async (params: any) => {
    try {
      console.log('params>>>', params);
      const data = await detectContract(params);
      console.log('data>>>', data);
      setloading(false);
      const currentfocusFileIdInfo = explorerList.filter(
        (item: any) => item.id === focusFileId
      )[0];
      if (!currentfocusFileIdInfo) return;
      const parentInfo = explorerList.filter(
        (item: any) => item.id === currentfocusFileIdInfo.parentId
      )[0];
      if (!parentInfo) return;

      return {
        file: parentInfo.name + '/' + currentfocusFileIdInfo.name,
        result: data
      };
    } catch (error) {
      setloading(false);
    }

    // await waitTime(1000);
    // return {
    //   file: 'ETH_default/Storage.sol',
    //   result: ContractDetectionResults
    // };
  });

  const handleSubmit = () => {
    void form
      .validateFields()
      .then((data: { fileId: string; version: string }) => {
        setloading(true);
        const { fileId, version } = data;
        const realContent = explorerList.filter(
          (item: any) => item.id === fileId
        )[0];
        // 打点
        setTimeout(() => {
          mutate({
            source_code: realContent.content,
            version: version,
            model: 'contractFuzzer'
          });
        }, 20000);
      });
  };

  const handleSubmitChainAffter = () => {
    void formAfterChain.validateFields().then((data: any) => {
      setloading(true);
      setTimeout(() => {
        const params = {
          ...data,
          block: Number(data.block)
        };
        console.log('params>>>', params);
        mutate({
          ...params
        });
      }, 20000);
    });
  };

  const handleClickView = () => {
    if (chainFlag !== 'offchain') {
      navigate(
        `/threat-detection/detection-chart-afterchain?result=${window.btoa(
          JSON.stringify(data?.result || '')
        )}`
      );
    } else {
      navigate(
        `/threat-detection/detection-chart?result=${window.btoa(
          JSON.stringify(data?.result || '')
        )}`
      );
    }
  };

  const handleReset = () => {
    reset();
    form.resetFields();
    formAfterChain.resetFields();
  };

  useEffect(() => {
    handleReset();
  }, [chainFlag]);

  // const contractTreeData = useMemo(() => {
  //   const List = cloneDeep(explorerList);
  //   const treeData = arrToTreeData(List);

  //   return treeData;
  // }, [explorerList]);

  return (
    <div
      className={cn(
        styles.Detection,
        'h-full overflow-scroll bg-white px-2 py-[18px]'
      )}
    >
      {!data && chainFlag === 'offchain' && (
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item
            name="fileId"
            rules={[
              {
                required: true,
                message: '请选择检测合约文件'
              }
            ]}
            initialValue={openFiles[0].id}
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
            name="model"
            initialValue={'conFuzzer'}
            rules={[
              {
                required: true,
                message: '请输入模型名称'
              }
            ]}
          >
            <Input placeholder="请输入模型名称" />
          </Form.Item>
          {/* <Form.Item
            name="contract0"
            rules={[
              {
                required: false,
                message: '请输入主合约部署参数'
              }
            ]}
          >
            <Input placeholder="请输入主合约部署参数" />
          </Form.Item> */}
          <Form.Item
            name="platform"
            rules={[
              {
                required: true,
                message: '请选择区块链平台'
              }
            ]}
            initialValue={'eth'}
          >
            <Select
              placeholder="请选择区块链平台"
              options={[
                { value: 'eth', label: 'ETH' },
                { value: 'bsc', label: 'BSC' }
              ]}
            ></Select>
          </Form.Item>
          {/* <Form.Item
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
              <Option value="o.4.26">0.4.24</Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            name="version"
            initialValue={'0.4.26'}
            rules={[
              {
                required: true,
                message: '请输入版本号'
              }
            ]}
          >
            <Input placeholder="请输入版本号" />
          </Form.Item>

          {/* <PrimaryButton onClick={handleSubmit} loading={status === 'loading'}>
            开始
          </PrimaryButton> */}
          <ButtonCommon
            disable={loading}
            loading={loading}
            className="w-full bg-[#1c6cdc]"
            onClick={handleSubmit}
          >
            <span className="text-[#ffffff]">开始</span>
          </ButtonCommon>
        </Form>
      )}
      {!data && chainFlag === 'onchain' && (
        <Form form={formAfterChain} wrapperCol={{ span: 24 }}>
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            name="model"
            initialValue={'conFuzzer'}
            rules={[
              {
                required: true,
                message: '请输入模型名称'
              }
            ]}
          >
            <Input placeholder="请输入模型名称" />
          </Form.Item>
          <Form.Item
            initialValue={defaultAbiCode}
            name="abi_code"
            rules={[
              {
                required: true,
                message: '请输入abi_code'
              }
            ]}
          >
            <Input.TextArea placeholder="请输入abi_code" rows={5} />
          </Form.Item>
          <Form.Item
            name="contract_addr"
            rules={[
              {
                required: true,
                message: '请输入contract_addr'
              }
            ]}
          >
            <Input placeholder="请输入contract_addr" />
          </Form.Item>
          <Form.Item
            name="platform"
            rules={[
              {
                required: true,
                message: '请选择区块链平台'
              }
            ]}
            initialValue={'eth'}
          >
            <Select
              placeholder="请选择区块链平台"
              options={[
                { value: 'eth', label: 'ETH' },
                { value: 'bsc', label: 'BSC' }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            name="block"
            rules={[
              {
                required: true,
                message: '请输入block'
              }
            ]}
          >
            <Input placeholder="请输入block" />
          </Form.Item>
          <Form.Item
            name="evm"
            rules={[
              {
                required: true,
                message: '请选择evm'
              }
            ]}
            initialValue={'byzantium'}
          >
            <Select
              placeholder="请选择platform"
              options={[
                { value: 'homestead', label: 'homestead' },
                { value: 'byzantium', label: 'byzantium' },
                { value: 'petersburg', label: 'petersburg' },
                { value: 'istanbul', label: 'istanbul' }
              ]}
            ></Select>
          </Form.Item>
          {/* <PrimaryButton
            onClick={handleSubmitChainAffter}
            loading={status === 'loading'}
          >
            开始
          </PrimaryButton> */}
          <ButtonCommon
            disable={loading}
            loading={loading}
            className="w-full bg-[#1c6cdc]"
            onClick={handleSubmitChainAffter}
          >
            <span className="text-[#ffffff]">开始</span>
          </ButtonCommon>
        </Form>
      )}
      {data && (
        <div className="">
          <div className="text-center text-xl font-semibold">检测完毕</div>
          <div className="mt-3 mb-2 flex items-center justify-start">
            <FileOutlined className="h-[16px] w-[16px]" />
            <Tooltip title={`File:${data.file}`}>
              <span className="max-w-full overflow-hidden text-ellipsis text-base">
                File:{data.file}
              </span>
            </Tooltip>
          </div>
          <ul className="mb-10 flex flex-col items-start justify-center gap-y-2 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {sortBy(
              data.result.map((o) => {
                const indexes: any = { High: 0, Medium: 1, Low: 2 };
                return {
                  ...o,
                  type: indexes[o.security]
                };
              }),
              'type'
            ).map((item, index) => (
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
