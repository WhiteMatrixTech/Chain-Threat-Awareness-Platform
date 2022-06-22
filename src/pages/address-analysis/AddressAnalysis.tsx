import { DatePicker, Form, Input, Select } from 'antd';
import cn from 'classnames';

import { PrimaryButton } from '@/components/Button';
import { AddressDetailData } from '@/services/mockData/addressAnalysis';

import styles from './AddressAnalysis.module.less';
import { AddressDetail } from './Components/AddressDetail';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export function AddressAnalysis() {
  const [form] = Form.useForm();

  return (
    <div className={styles.AddressAnalysis}>
      <div className="flex items-center gap-x-3">
        <div className="text-2xl font-black">地址分析</div>
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
                name={['chain', 'address']}
                noStyle={true}
                initialValue="0xab5801a7d398351b8be11c439e05c5b3259aec9b"
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
      <div className={cn(styles.transactionDataContainer, 'mt-6 flex gap-x-2')}>
        <div className="w-80 max-w-sm rounded bg-white shadow-card">
          <AddressDetail addressData={AddressDetailData} />
        </div>
        <div className="flex-1 rounded bg-white p-6 shadow-card">
          <div id="TransactionGraphContainer"></div>
        </div>
      </div>
    </div>
  );
}
