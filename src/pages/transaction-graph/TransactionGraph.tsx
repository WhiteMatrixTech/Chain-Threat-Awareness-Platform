import { DatePicker, Form, Input, Select } from 'antd';
import cn from 'classnames';

import { PrimaryButton } from '@/components/Button';
import { TransactionDetailExample } from '@/services/mockData/transactionGraph';

import { TransactionDetailCard } from './Components/DetailCard';
import styles from './TransactionGraph.module.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export function TransactionGraph() {
  const [form] = Form.useForm();

  return (
    <div className={cn(styles.TransactionGraph, 'overflow-y-auto')}>
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-black">交易图谱</div>
        <Form
          form={form}
          wrapperCol={{ span: 24 }}
          name="transaction-graph-form"
          layout="inline"
          className="flex flex-1 items-center"
        >
          <Form.Item className="max-w-3xl !flex-1">
            <Input.Group compact={true}>
              <Form.Item
                name={['chain', 'tokenType']}
                noStyle={true}
                initialValue={['BTC']}
              >
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
                name={['chain', 'transactionHash']}
                noStyle={true}
                initialValue="a893e394120135be6431254bc5b7184b33ec1fe8eb38e88a4ba05e30f04e3966"
              >
                <Input
                  size="large"
                  allowClear={true}
                  style={{ width: '70%' }}
                  className={styles.input}
                  placeholder="请输入交易哈希"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="date">
            <RangePicker size="large" className={styles.dataPicker} />
          </Form.Item>
          <PrimaryButton className="ml-16 w-fit !px-10">开始分析</PrimaryButton>
        </Form>
      </div>
      <div className="mt-6 flex gap-x-2 ">
        <div className="w-80 max-w-sm rounded bg-white shadow-card">
          <TransactionDetailCard transactionData={TransactionDetailExample} />
        </div>
        <div className="flex-1 rounded bg-white p-6 shadow-card">
          <div id="TransactionGraphContainer"></div>
        </div>
      </div>
    </div>
  );
}
