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

interface ITransactionResponse {
  address: string;
  count: number;
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
  return getData<null, { address: string; balance: number }>(
    `/chainthreat/v1/address/ethereum/${address}`,
    null,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );
}
