import {
  postApi,
  postApiWithoutLoading,
  getApi,
  getApiWithoutLoading,
} from "./http";

const testApi = (data: any) => postApi("/test", data);

export { testApi };
