interface ITransactionDetailData {
  transactionHash: string;
  type: string;
  gas: number;
  timestamp: string;
  inputValue: number;
  outputValue: number;
  inputAddressNumber: number;
  outputAddressNumber: number;
  inputTxNumber: number;
  outputTxNumber: number;
}

interface IAddressDetailData {
  address: string;
  balance: number;
  inflowAmount: number;
  outflowAmount: number;
}

const TransactionDetailExample: ITransactionDetailData = {
  transactionHash:
    'a893e394120135be6431254bc5b7184b33ec1fe8eb38e88a4ba05e30f04e3966',
  type: '混币',
  gas: 0.00356989,
  timestamp: '2019-05-08 10:58:58',
  inputValue: 15002.99912123,
  outputValue: 15002.99555134,
  inputAddressNumber: 1,
  outputAddressNumber: 2,
  inputTxNumber: 46,
  outputTxNumber: 2
};

const AddressDetailDataExample: IAddressDetailData = {
  address: '14BWH6GmVoL5nTwbVxQJKJDtzv4y5EbTVm',
  balance: 0.000024,
  inflowAmount: 101550.37345869,
  outflowAmount: 101550.37343469
};

export { AddressDetailDataExample, TransactionDetailExample };

export type { IAddressDetailData, ITransactionDetailData };
