import { Empty } from 'antd';
import { get } from 'lodash';

import { DescriptionCard, DescriptionItem } from '@/components/DescriptionCard';
import {
  IAddressDetailData,
  ITransactionDetailData
} from '@/services/mockData/transactionGraph';

const TransactionDetailField: { [key: string]: string } = {
  type: '类型',
  gas: '交易手续费',
  timestamp: '交易时间',
  inputValue: '输入金额',
  outputValue: '输出金额'
};

const AddressDetailField: { [key: string]: string } = {
  balance: '余额',
  inflowAmount: '流入金额',
  outflowAmount: '流出金额'
};

export function TransactionDetailCard({
  transactionData,
  unit
}: {
  transactionData: ITransactionDetailData | undefined;
  unit: string;
}) {
  if (!transactionData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  return (
    <DescriptionCard
      title="交易信息"
      hashOrAddress={transactionData.transactionHash}
      copyTip="复制哈希"
    >
      {Object.keys(TransactionDetailField).map((fieldLey) => (
        <DescriptionItem
          key={fieldLey}
          label={TransactionDetailField[fieldLey]}
          content={get(transactionData, `${fieldLey}`, '') as string}
          unit={unit}
        />
      ))}
      <DescriptionItem
        label="输入/输出地址数"
        content={`${transactionData.inputAddressNumber}/${transactionData.outputAddressNumber}`}
      />
      <DescriptionItem
        label="输入/输出笔数"
        content={`${transactionData.inputTxNumber}/${transactionData.outputTxNumber}`}
      />
    </DescriptionCard>
  );
}

export function AddressDetailCard({
  addressData,
  unit
}: {
  addressData: IAddressDetailData | undefined;
  unit: string;
}) {
  if (!addressData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <DescriptionCard
      title="地址信息"
      hashOrAddress={addressData?.address}
      copyTip="复制地址"
    >
      {Object.keys(AddressDetailField).map((fieldLey) => (
        <DescriptionItem
          unit={unit}
          key={fieldLey}
          label={AddressDetailField[fieldLey]}
          content={get(addressData, `${fieldLey}`, '') as string}
        />
      ))}
    </DescriptionCard>
  );
}
