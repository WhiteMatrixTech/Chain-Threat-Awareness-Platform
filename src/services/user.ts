/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-24 15:20:33
 */
import { AuthResponse, getData, postData } from "./request";

export interface loginRequestType {
  userId: string;
  password: string;
}

export interface metadataType {
  institutionName: string;
  contactName: string;
  contactAddress: string;
  mobileNumber: string;
  userName: string;
}

export interface profileResponseType {
  authorities: string[];
  metadata: metadataType;
  userId: string;
}

export interface registerRequestType {
  code?: string;
  metadata: metadataType;
  password: string;
  userId: string;
}

// 注册接口字段变更
export interface registerRequestTypeV2 {
  institution: string;
  username: string;
  address: string;
  mobile: string;
  email: string;
  password: string;
  nickname: string;
  createAt: string;
}
export async function loginService(params: loginRequestType) {
  return await postData<loginRequestType, AuthResponse>(
    `/chainthreat/v1/user/login`,
    params
  );
}

export async function registerService(params: registerRequestTypeV2) {
  return await postData(`/chainthreat/v1/user/register`, params);
}

export async function getProfile() {
  return await getData<null, profileResponseType>(
    `/chainthreat/v1/user/profile`
  );
}
