/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
/*
 * @Description: datastore模块涉及的请求
 * @Author: didadida262
 * @Date: 2024-08-28 14:03:48
 * @LastEditors: didadida262
 * @LastEditTime: 2024-10-22 10:26:13
 */
import { getData, postData } from "./request";

export interface loginRequestType {
  userId: string;
  password: string;
}
export interface dataStoreRequestType {
  currentPage: number;
  pageSize: number;
}
export interface detectPrivacyRequestType {
  address: string;
  chain: string;
}
export interface detectFishRequestType {
  address: string;
  chain: string;
}
export interface detectIdentityRequestType {
  address: string;
  chain: string;
}
export interface detectChainCodeRequestType {
  code: string;
  chain: string;
}
export interface detectCrossChainRequestType {
  tx: string;
  chain: string;
}
export interface detectBitcoinmixedcoinRequestType {
  tx: string;
  chain: string;
}
export interface detectMaliciousRequestType {
  tx: string;
  chain: string;
}
export interface detectFewSamplesRequestType {
  address: string;
  samples: string;
  chain: string;
}
export interface detectActionLogRequestType {
  action: string;
  count?: number;
}
export interface dataStoreCreateRequestType {
  chain: string;
  source: string;
  datasetName: string;
  downloadName?: any;
  file: File;
}
// 数据仓库接口
// 创建
export async function dataStoreCreateService(params: FormData) {
  return await postData<FormData, any>(
    `/chainthreat/v1/data-house/data-source`,
    params
  );
}
// 编辑
export async function dataStoreModifyService(params: any) {
  return await postData<any, any>(
    `/chainthreat/v1/data-house/data/${params.getAll("tableName")}`,
    params
  );
}
export interface dataStoreDownloadTemplateRequestType {
  tableName: string;
}
// 下载模版
export async function dataStoreDownloadTemplateService(
  params: dataStoreDownloadTemplateRequestType
) {
  return await getData<dataStoreDownloadTemplateRequestType, any>(
    `/chainthreat/v1/data-house/data-source/template/${params.tableName}`
  );
}

// 列表数据
export async function dataStoreListService() {
  return await getData<null, any>(`/chainthreat/v1/data-house/data-source`);
}

// 抢跑攻击
export interface detectAttackRequestType {
  blockNumber: any;
}
export async function detectAttackService(params: detectAttackRequestType) {
  return await getData<detectAttackRequestType, any>(
    `/chainthreat/v1/evidence/front-running`,
    params
  );
}

// 钓鱼
export interface detectPhishingRequestType {
  address: string;
}
export async function detectPhishingService(params: detectPhishingRequestType) {
  return await getData<detectPhishingRequestType, any>(
    `/chainthreat/v1/evidence/phishing`,
    params
  );
}

// 自私挖矿
export interface detectSelfishminingRequestType {
  chain: any;
  endBlock: string;
  // endDate: any;
  startBlock: string;
  // startDate: any;
}
export async function detectSelfishminingService(
  params: detectSelfishminingRequestType
) {
  return await getData<detectSelfishminingRequestType, any>(
    `/chainthreat/v1/evidence/selfish-mining`,
    params
  );
}

// 获取自私挖矿区块有效范围
export async function detectPrivacyBlockRangeService(params: any) {
  return await getData<any, any>(
    `/chainthreat/v1/data-house/block-height/${params.chain}`
  );
}

// 检测样例
export async function detectActionLogService(
  params: detectActionLogRequestType
) {
  return await getData<detectActionLogRequestType, any>(
    `/chainthreat/v1/action-log/${params.action}`
  );
}
// 少样本
export async function detectFewSamplesService(
  params: detectFewSamplesRequestType
) {
  return await getData<detectFewSamplesRequestType, any>(
    `/chainthreat/v1/detection/fsl`,
    params
  );
}

// 链码
export async function detectChainCodeService(
  params: detectChainCodeRequestType
) {
  return await postData<detectChainCodeRequestType, any>(
    `/chainthreat/v1/detection/chaincode`,
    params
  );
}

// 南信大-钓鱼结果
export async function detectFishService(params: detectFishRequestType) {
  return await getData<detectFishRequestType, any>(
    `/chainthreat/v1/detection/phishing`,
    params
  );
}
// 身份推断
export async function detectIdentityService(params: detectIdentityRequestType) {
  return await getData<detectIdentityRequestType, any>(
    `/chainthreat/v1/detection/i2gt`,
    params
  );
}
export interface getTransactionsRequestType {
  address: string;
  limit: number;
}
// 查询交易数据接口
export async function getTransactionsService(
  params: getTransactionsRequestType
) {
  return await getData<getTransactionsRequestType, any>(
    `/chainthreat/v1/data-house/eth/transactions/second`,
    params
  );
}
// 跨链
export async function detectCrossChainService(
  params: detectCrossChainRequestType
) {
  return await getData<detectCrossChainRequestType, any>(
    `/chainthreat/v1/detection/cross-chain`,
    params
  );
}
// 混币
export async function detectBitcoinmixedcoinService(
  params: detectBitcoinmixedcoinRequestType
) {
  return await getData<detectBitcoinmixedcoinRequestType, any>(
    `/chainthreat/v1/detection/mix-coin`,
    params
  );
}
// 非法交易
export async function detectMaliciousService(
  params: detectMaliciousRequestType
) {
  return await getData<detectMaliciousRequestType, any>(
    `/chainthreat/v1/detection/illicit`,
    params
  );
}
//

export async function getDataStoreList(params: dataStoreRequestType) {
  return await getData<dataStoreRequestType, any>(
    `/chainthreat/v1/user/profile`,
    params
  );
}

// 大屏
// 检测样例
export async function dataScreenService() {
  return await getData<any, any>(`/chainthreat/v1/data-house/mock-data`);
}
