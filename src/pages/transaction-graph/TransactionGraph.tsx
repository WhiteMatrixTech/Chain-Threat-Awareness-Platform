import { DatePicker, Form, Input, Select, Spin } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { PrimaryButton } from '@/components/Button';
import {
  randomAddressData,
  randomTxDetailData
} from '@/services/mockData/transactionGraph';
import { getBaseInfo, getTransactionBaseInfo } from '@/services/transaction';
import { randomNum, waitTime } from '@/utils/common';

import {
  AddressDetailCard,
  TransactionDetailCard
} from './Components/DetailCard';
import { TransactionTraceGraph } from './Components/TransactionTraceGraph';
import styles from './TransactionGraph.module.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;

interface IGraphFormData {
  date: undefined;
  tokenType: string;
  transactionHash: string;
}

export function TransactionGraph() {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<IGraphFormData>({
    date: undefined,
    tokenType: 'ETH',
    transactionHash:
      '0x3c2eacee8cb9ea750ae4cc51f41c40e73b5099b8ed5df0fd2dd9cb72d58dbb62'
  });
  const [selectedHexData, setSelectedHexData] = useState(
    '0x3c2eacee8cb9ea750ae4cc51f41c40e73b5099b8ed5df0fd2dd9cb72d58dbb62'
  );
  const isTx = useMemo(
    () => selectedHexData.length > 42,
    [selectedHexData.length]
  );

  const { data: txDetailData, isLoading: qryTxLoading } = useQuery(
    ['getTxDetailData', selectedHexData],
    async () => {
      if (isTx) {
        const data = await getTransactionBaseInfo(selectedHexData);
        data.blockTimestamp = dayjs(Number(data.blockTimestamp) * 1000).format(
          'YYYY-MM-DD hh:mm:ss'
        );
        data.value = (Number(data.value) / 1e18).toString();
        return data;

        // await waitTime(1000);
        // return randomTxDetailData(selectedHexData);
      }
    }
  );

  const { data: addressDetailData, isLoading: qryAddressLoading } = useQuery(
    ['getAddressDetailData', selectedHexData],
    async () => {
      if (!isTx) {
        const data = await getBaseInfo(selectedHexData);
        data.balance = (Number(data.balance) / 1e18).toString();
        data.transactionInAmountSum = (
          Number(data.transactionInAmountSum) / 1e18
        ).toString();
        data.transactionOutAmountSum = (
          Number(data.transactionOutAmountSum) / 1e18
        ).toString();

        return data;
        // await waitTime(1000);
        // return randomAddressData(selectedHexData);
      }
    }
  );

  const onClickAnalysis = () => {
    void form.validateFields().then((allValues: IGraphFormData) => {
      allValues.tokenType = allValues.tokenType[0];
      setFormData(allValues);
      setSelectedHexData(allValues.transactionHash);
    });
  };

  return (
    <div className={cn(styles.TransactionGraph, 'overflow-y-auto')}>
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-black">交易图谱</div>
        <Form
          form={form}
          layout="inline"
          wrapperCol={{ span: 24 }}
          name="transaction-graph-form"
          className="flex flex-1 items-center justify-end"
        >
          <Form.Item className="max-w-3xl !flex-1">
            <Input.Group compact={true}>
              <Form.Item name="tokenType" noStyle={true} initialValue={['ETH']}>
                <Select
                  size="large"
                  style={{ width: '30%' }}
                  placeholder="请选择TOKEN类型"
                >
                  <Option value="BTC">BTC</Option>
                  <Option value="ETH">ETH</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="transactionHash"
                noStyle={true}
                initialValue="0x3c2eacee8cb9ea750ae4cc51f41c40e73b5099b8ed5df0fd2dd9cb72d58dbb62"
              >
                <Input
                  size="large"
                  allowClear={true}
                  style={{ width: '70%' }}
                  className={styles.input}
                  placeholder="请输入交易hash"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="date">
            <RangePicker size="large" className={styles.dataPicker} />
          </Form.Item>
          <PrimaryButton
            onClick={onClickAnalysis}
            className="ml-16 w-fit !px-10"
          >
            开始分析
          </PrimaryButton>
        </Form>
      </div>
      <div className="mt-6 flex min-h-[80vh] gap-x-2">
        <div className="w-80 max-w-sm rounded bg-white shadow-card">
          <Spin spinning={qryTxLoading || qryAddressLoading}>
            {isTx ? (
              <TransactionDetailCard
                unit={formData.tokenType}
                transactionData={txDetailData}
              />
            ) : (
              <AddressDetailCard
                unit={formData.tokenType}
                addressData={addressDetailData}
              />
            )}
          </Spin>
        </div>
        <div className="flex-1 overflow-hidden rounded bg-white shadow-card">
          <TransactionTraceGraph
            tokenUnit={formData.tokenType}
            handleClick={setSelectedHexData}
            queryHash={formData.transactionHash}
          />
        </div>
      </div>
    </div>
  );
}
