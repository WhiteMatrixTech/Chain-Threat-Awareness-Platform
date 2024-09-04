/* eslint-disable prettier/prettier */
/*
 * @Description: datastore模块涉及的请求
 * @Author: didadida262
 * @Date: 2024-08-28 14:03:48
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-04 16:08:42
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
export interface detectFishRequestType {
  address: string;
  chain: string;
}
export interface detectIdentityRequestType {
  address: string;
  chain: string;
}

// export async function registerService(params: registerRequestType) {
//   return await postData(`/chainthreat/v1/user/register`, params);
// }
// 钓鱼模块
export async function detectFishService(params: detectFishRequestType) {
  return await getData<detectFishRequestType, any>(
    `/chainthreat/v1/detection/phishing`,
    params
  );
}

export async function detectIdentityService(params: detectIdentityRequestType) {
  return await getData<detectFishRequestType, any>(
    `/chainthreat/v1/detection/i2gt`,
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
