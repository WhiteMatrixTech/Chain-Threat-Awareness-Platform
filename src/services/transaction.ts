import { getData } from './request';

interface ITransactionType {
  address: string;
  pageKey?: string[];
  fromBlock: string;
  toBlock: string;
}

interface ITransactionRequest {
  pageKey?: string[];
  fromBlock: string;
  toBlock: string;
}

export interface ITransactionResponse {
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

interface ITransactionBaseInfoResponse {
  blockNumber: string;
  blockTimestamp: string;
  from: string;
  to: string;
  hash: string;
  value: string;
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
  return await getData<ITransactionRequest, ITransactionResponse[]>(
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
