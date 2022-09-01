import { getData } from './request';

interface ITransactionType {
  address: string;
  pageKey: string[];
}

export async function getInAddressTransaction(params: ITransactionType) {
  return await getData(`/chainthreat/v1/address/${params.address}/to`, params);
}

export async function getOutAddressTransaction(params: ITransactionType) {
  return await getData(
    `/chainthreat/v1/address/${params.address}/from`,
    params
  );
}
