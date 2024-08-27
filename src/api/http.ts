import { AxiosRequestConfig } from "axios";
import service from "@/utils/request";

type CustomAxiosRequestConfig = AxiosRequestConfig & {
  isLoading?: boolean;
};
const postApi = (url: string, data: any = {}) =>
  service.post(url, data, { isLoading: true } as CustomAxiosRequestConfig);

const postApiWithoutLoading = (url: string, data: any = {}) =>
  service.post(url, data, { isLoading: false } as CustomAxiosRequestConfig);

const getApi = (url: string, params: any = {}) =>
  service.get(url, { params, isLoading: true } as CustomAxiosRequestConfig);

const getApiWithoutLoading = (url: string, params: any = {}) =>
  service.get(url, { params, isLoading: false } as CustomAxiosRequestConfig);

export { postApi, postApiWithoutLoading, getApi, getApiWithoutLoading };
