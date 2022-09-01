import { AuthResponse, getData, postData } from './request';

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

export async function loginService(params: loginRequestType) {
  return await postData<loginRequestType, AuthResponse>(
    `/chainthreat/v1/user/login`,
    params
  );
}

export async function registerService(params: registerRequestType) {
  return await postData(`/chainthreat/v1/user/register`, params);
}

export async function getProfile() {
  return await getData<null, profileResponseType>(
    `/chainthreat/v1/user/profile`
  );
}
