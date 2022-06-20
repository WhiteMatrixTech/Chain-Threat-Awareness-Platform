import { notification } from 'antd';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || ''
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data as T
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export interface RequestBody<T> {
  code: string;
  message: string;
  status: string;
  data: {
    data: T;
  };
}
export interface RequestExecuteBody {
  code: string;
  message: string;
  status: string;
}
export interface RequestJson<T> {
  code: string;
  message: string;
  status: string;
  data: T;
}

export async function getData<T>(url: string, withoutToastError = false) {
  try {
    const response: RequestBody<T> = await AXIOS_INSTANCE.get(url);
    return response.data.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as AxiosError<RequestBody<T>>).response?.data.message ||
          'An unexpected error occurred during fetching data'
        }`,
        top: 64,
        duration: 3
      });
    throw e;
  }
}

export async function postData<D, T>(
  url: string,
  data: D,
  withoutToastError = false
) {
  try {
    const response: RequestBody<T> = await AXIOS_INSTANCE.post(`${url}`, data);
    return response.data.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as AxiosError<RequestBody<T>>).response?.data.message ||
          'post data failed'
        }`,
        top: 64,
        duration: 3
      });

    const error = (e as AxiosError<RequestBody<T>>).response?.data.message;
    if (error) throw new Error(error);
    throw e;
  }
}

export async function getJson<T>(url: string, withoutToastError = false) {
  try {
    const response: RequestJson<T> = await AXIOS_INSTANCE.get(url);

    return response.data;
  } catch (e) {
    !withoutToastError &&
      notification.error({
        message: `${
          (e as AxiosError<RequestJson<T>>).response?.data.message ||
          'An unexpected error occurred during fetching data'
        }`,
        top: 64,
        duration: 3
      });

    throw e;
  }
}

export default customInstance;
