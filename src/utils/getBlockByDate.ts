/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import EthDater from 'ethereum-block-by-date';
import { ethers } from 'ethers';

interface getDateResponse {
  date: string;
  block: number;
  timestamp: number;
}

export async function getBlockByDate(dateTime: moment.MomentInput) {
  const provider = new ethers.providers.CloudflareProvider();

  const dater = new EthDater(provider);

  const data: getDateResponse = await dater.getDate(dateTime, true, false);

  return data.block;
}
