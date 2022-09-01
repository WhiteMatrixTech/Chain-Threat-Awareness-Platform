import { notification } from 'antd';
import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import store from 'store2';

import { emitter, EmitterEvent } from './event';

const baseURL =
  process.env.REACT_APP_API_BASE_URL || 'https://alpha.api.whitematrixdev.com';

export interface ResponseBody<R> {
  code: string;
  message: string;
  status: string;
  data: R;
}
export interface AuthResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string[];
  tokenType?: string;
}

interface RefreshTokenParams {
  refreshToken: string;
}

function genAuthorization() {
  const authInfo = store.get('authInfo') as AuthResponse;
  const Authorization =
    `${authInfo?.tokenType || ''} ${authInfo?.accessToken || ''}` || '';

  return Authorization;
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { headers, ...rest } = config;
    return {
      ...rest,
      headers: { ...headers, Authorization: genAuthorization() }
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ResponseBody<null>>) => {
    if (error.response?.status === 403) {
      await checkToken();

      const Authorization = genAuthorization();

      return axiosInstance.request({
        ...error.config,
        headers: {
          ...error.config.headers,
          Authorization
        }
      });
    }

    const errorMsg = (error as AxiosError<ResponseBody<any>>).response?.data;
    if (errorMsg) throw errorMsg;
    throw error;
  }
);

let isExpireNotified = false;
async function checkToken() {
  const authInfo = store.get('authInfo') as AuthResponse;
  const refresh_token = authInfo?.refreshToken || '';

  const goLogin = () => {
    if (!isExpireNotified) {
      notification.error({ message: 'Login expired, please login again!' });
      isExpireNotified = true;
    }

    store.clearAll();
    emitter.emit(EmitterEvent.logout);

    if (window.location.pathname !== '/login') {
      setTimeout(() => {
        window.location.replace(
          `${window.location.origin}/login?redirectUri=${window.location.pathname}`
        );
        isExpireNotified = false;
      }, 1000);
    }
  };

  if (refresh_token) {
    try {
      await refreshToken({
        refreshToken: refresh_token
      });
    } catch (e) {
      goLogin();
    }
  } else {
    goLogin();
  }
}

async function refreshToken(data: RefreshTokenParams) {
  const res = await axios.post<RefreshTokenParams, ResponseBody<AuthResponse>>(
    `${baseURL}/chainthreat/v1/user/refresh`,
    data
  );

  store.set('authInfo', { ...res.data, signTime: new Date().getTime() });
  return res.data;
}

export async function getData<P, T>(
  url: string,
  params?: P,
  withoutToastError = false
) {
  try {
    const response: ResponseBody<T> = await axiosInstance.get(url, { params });
    return response.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as ResponseBody<T>).message ||
          'An unexpected error occurred during fetching data'
        }`,
        top: 64,
        duration: 2
      });
    throw e;
  }
}

export async function postData<D, T>(
  url: string,
  data: D,
  headers?: AxiosRequestHeaders,
  withoutToastError = false
) {
  try {
    const response: ResponseBody<T> = await axiosInstance.post(`${url}`, data, {
      headers
    });
    return response.data;
  } catch (e) {
    console.log({ e });

    !withoutToastError &&
      notification.error({
        message: `${
          (e as ResponseBody<T>).message ||
          'An unexpected error occurred during posting data'
        }`,
        top: 64,
        duration: 2
      });

    const error = (e as ResponseBody<T>).message;
    if (error) throw new Error(error);
    throw e;
  }
}

export async function putData<D, T>(
  url: string,
  data: D,
  withoutToastError = false
) {
  try {
    const response: ResponseBody<T> = await axiosInstance.put(`${url}`, data);
    return response.data;
  } catch (e) {
    console.log({ e });

    !withoutToastError &&
      notification.error({
        message: `${
          (e as ResponseBody<T>).message ||
          'An unexpected error occurred during posting data'
        }`,
        top: 64,
        duration: 2
      });

    const error = (e as ResponseBody<T>).message;
    if (error) throw new Error(error);
    throw e;
  }
}

export async function getJson<T>(url: string, withoutToastError = false) {
  try {
    const response: ResponseBody<T> = await axiosInstance.get(url);

    return response.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as ResponseBody<T>).message ||
          'An unexpected error occurred during fetching data'
        }`,
        top: 64,
        duration: 2
      });

    throw e;
  }
}

export async function deleteData<D, T>(
  url: string,
  data: D,
  withoutToastError = false
) {
  try {
    const response: ResponseBody<T> = await axiosInstance.delete(`${url}`, {
      data
    });
    return response.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as ResponseBody<T>).message ||
          'An unexpected error occurred during fetching data'
        }`,
        top: 64,
        duration: 2
      });
    throw e;
  }
}

export default axiosInstance;
