import axios from 'axios';
import { message } from 'antd';
import { storages } from 'storages';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ResponseType<T> {
  code: string;
  message: string;
  data: T;
}

const publicRuntimeConfig = {
  basePath: '/symbolmarket',
};

class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: `${publicRuntimeConfig.basePath}/api`, timeout: 60000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign({}, this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // add token
        const token = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}').token;
        if (token && !config.baseURL?.includes('cms')) {
          config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
        return config;
      },
      (error) => {
        console.error(`something were wrong when fetch ${config?.url}`, error);
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      <T>(response: AxiosResponse<ResponseType<T>>) => {
        const res = response.data;
        // console.log('axios ', res);
        const { code, data, message: errorMessage } = response.data;
        if (config.baseURL?.includes('cms')) {
          return data;
        }
        if (config.baseURL?.includes('connect')) {
          return res;
        }

        switch (code) {
          case '20000':
            return data;
          case '20001':
            return {};
          case '50000':
            message.error(errorMessage);
            return Promise.reject(errorMessage);
          // return null;
          default:
            message.error(errorMessage);
            return Promise.reject(errorMessage);
          // return res;
        }
      },
      (error) => {
        let errMessage = '';

        switch (error?.response?.status) {
          case 400:
            errMessage = error?.response?.data?.error_description || 'Bad Request';
            break;

          case 401:
            message.error('The signature has expired. Please log in again.');
            setTimeout(() => {
              location.pathname = '/';
            }, 3000);
            break;

          case 404:
            errMessage = 'Not Found';
            break;

          case 500:
          case 501:
          case 502:
          case 503:
          case 504:
            errMessage = `${error?.response?.status || ''}: something went wrong in server`;
            break;

          default:
            // errMessage = `${error?.response?.status || ''}: something went wrong, please try again later`;
            break;
        }
        if (error.message == 'Network Error') {
          errMessage = 'Network Error';
        }
        if (config.baseURL?.includes('connect')) {
          return Promise.reject(errMessage);
        }
        message.error(errMessage);
        return Promise.reject(errMessage);
      },
    );
  }

  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post(url, data, config);
  }

  public put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

const tokenRequest = new Request({
  baseURL: `${publicRuntimeConfig.basePath}/connect`,
});
const cmsRequest = new Request({ baseURL: `${publicRuntimeConfig.basePath}/cms` });

export default new Request({});
export { tokenRequest, cmsRequest };
