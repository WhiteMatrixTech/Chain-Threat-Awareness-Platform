import { getData, postData } from './request';

interface ITransactionType {
  address: string;
  pageKey?: string[];
  fromBlock: string;
  toBlock: string;
  count?: number;
}

interface ITransactionRequest {
  pageKey?: string[];
  fromBlock: string;
  toBlock: string;
  count?: number;
}

export interface ITransactionResponse {
  transactionInfos?: any;
  address: string;
  count: number;
  value: string;
  firstTransactionTimestamp: string;
  lastTransactionTimestamp: string;
}

export interface IBaseInfoResponse {
  address: string;
  balance: string;
  firstTransactionTimestamp: string;
  inUserCount: string;
  outUserCount: string;
  transactionCount: string;
  transactionInAmountSum: string;
  transactionMaxAmount: string;
  transactionOutAmountSum: string;
}

export interface ITransactionBaseInfoResponse {
  blockNumber: string;
  blockTimestamp: string;
  gas: string;
  from: string;
  to: string;
  hash: string;
  value: string;
  inputAddressNumber?: number;
  outputAddressNumber?: number;
  inputTxNumber?: number;
  outputTxNumber?: number;
}

export interface IDetectContractRequest {
  model: string;
  source_code: string;
  version: string;
}

interface IDetectContractResponse {
  description: string;
  line: number;
  security: 'Medium' | 'Low' | 'High';
  swcId: number;
}

export async function getInAddressTransaction(params: ITransactionType) {
  return await getData<ITransactionRequest, ITransactionResponse[]>(
    `/chainthreat/v1/address/ethereum/${params.address}/to`,
    { fromBlock: params.fromBlock, toBlock: params.toBlock },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
}

export async function getOutAddressTransaction(params: ITransactionType) {
  return getData<ITransactionRequest, ITransactionResponse[]>(
    `/chainthreat/v1/address/ethereum/${params.address}/from`,
    { fromBlock: params.fromBlock, toBlock: params.toBlock },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
}

export async function getBaseInfo(address: string) {
  return getData<null, IBaseInfoResponse>(
    `/chainthreat/v1/address/ethereum/${address}`,
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
}

export async function getTransactionBaseInfo(transaction: string) {
  return getData<null, ITransactionBaseInfoResponse>(
    `/chainthreat/v1/transaction/ethereum/${transaction}`,
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
}

export async function detectContract(data: IDetectContractRequest) {
  return postData<IDetectContractRequest, IDetectContractResponse[]>(
    '/chainthreat/v1/contract/detect',
    data
  );
}
