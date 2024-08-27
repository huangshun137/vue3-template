import { ref } from "vue";
import axios, { InternalAxiosRequestConfig } from "axios";
import { useRequestStore } from "@/store/store";

// 重写AxiosRequestConfig
interface NewAxiosRequestConfig extends InternalAxiosRequestConfig {
  isLoading?: Boolean;
}

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 60000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

const loadingCount = ref<number>(0);
let downloadLoadingInstance: any = null;

service.interceptors.request.use(
  (config: NewAxiosRequestConfig) => {
    // 将请求存储到pinia中
    const controller = new AbortController();
    config.signal = controller.signal;
    const requestStore = useRequestStore();
    requestStore.addRequests({
      controller,
      url: config.url!,
      method: config.method!,
    });

    //显示loading
    if (config.isLoading) {
      loadingCount.value++;
    }
    if (loadingCount.value > 0 && !downloadLoadingInstance) {
      // 默认不显示loading,当config.islLoading为true时显示loading
      downloadLoadingInstance = ElLoading.service({
        lock: true,
        text: "加载中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    // 是否需要设置 token
    // const isNoToken = (config.headers || {}).isToken === false;
    // if (getToken() && !isNoToken && config.headers) {
    //   config.headers["token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // get请求映射params参数
    // if (config.method === "get" && config.params) {
    //   let url = config.url + "?" + tansParams(config.params);
    //   url = url.slice(0, -1);
    //   config.params = {};
    //   config.url = url;
    // }
    // if (config.method === "post" && config.params) {
    //   let url = config.url + "?" + tansParams(config.params);
    //   url = url.slice(0, -1);
    //   config.params = {};
    //   config.url = url;
    // }
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (
      !isRepeatSubmit &&
      (config.method === "post" || config.method === "put")
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === "object"
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      };
      const sessionObj = JSON.parse(
        sessionStorage.getItem("sessionObj") || "{}"
      );
      if (Object.keys(sessionObj).length === 0) {
        sessionStorage.setItem("sessionObj", JSON.stringify(requestObj));
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          // const message = '数据正在处理，请勿重复提交';
          // console.warn(`[${s_url}]: ` + message);
          // return Promise.reject(new Error(message));
        } else {
          sessionStorage.setItem("sessionObj", JSON.stringify(requestObj));
        }
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

const loadingColse = () => {
  loadingCount.value--;
  if (loadingCount.value <= 0 && downloadLoadingInstance) {
    downloadLoadingInstance.close();
    downloadLoadingInstance = null;
  }
};

service.interceptors.response.use(
  (res) => {
    // console.log(res);
    loadingColse();
    const requestStore = useRequestStore();
    requestStore.deleteRequest(res.config.url!, res.config.method!);
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = res.data.msg || "请求失败";
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    if (code === 401) {
      // if (!isRelogin.show) {
      //   isRelogin.show = true;
      //   ElMessageBox.confirm(
      //     "登录状态已过期，您可以继续留在该页面，或者重新登录",
      //     "系统提示",
      //     {
      //       confirmButtonText: "重新登录",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //     }
      //   )
      //     .then(() => {
      //       isRelogin.show = false;
      //       //调用退出登录的方法
      //     })
      //     .catch(() => {
      //       isRelogin.show = false;
      //     });
      // }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: "error",
      });
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      ElMessage({
        message: msg,
        type: "warning",
      });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      ElNotification.error({
        title: msg,
      });
      return Promise.reject("error");
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    console.log("err" + error);
    let { message } = error;
    if (message === "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    //message为canceled时就是取消当前请求
    if (message != "canceled") {
      ElMessage({
        message: message,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
