enum HealthTag {
  LARGE_TRANSACTION = '大额交易',
  IRREGULARS_TRANSACTION = '非常规交易',
  FREQUENT_TRANSACTION = '频繁交易'
}

interface IAddressAnalysisDetail {
  address: string;
  transferInMatchAmount: number;
  transferOutMatchAmount: number;
  balance: number;
  firstTxTimestamp: string;
  txNumber: number;
  maxTxAmount: number;
  allReceivedAmount: number;
  allSendedAmount: number;
  addressHealth: number;
  healthTags: HealthTag[];
}

const AddressDetailData: IAddressAnalysisDetail = {
  address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
  transferInMatchAmount: 102,
  transferOutMatchAmount: 397,
  balance: 51.7075951,
  firstTxTimestamp: '2015-09-09 20:11:14',
  txNumber: 819,
  maxTxAmount: 499999,
  allReceivedAmount: 916202.32195907,
  allSendedAmount: 916146.62730697,
  addressHealth: 5.3,
  healthTags: [
    HealthTag.IRREGULARS_TRANSACTION,
    HealthTag.LARGE_TRANSACTION,
    HealthTag.FREQUENT_TRANSACTION
  ]
};

export { AddressDetailData };

export type { IAddressAnalysisDetail };
