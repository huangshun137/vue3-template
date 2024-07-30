import { defineStore } from "pinia";
import { ref } from "vue";

interface RequestState {
  controller: AbortController;
  method: string;
  url: string;
}

export const useRequestStore = defineStore("request", () => {
  const requests = ref<RequestState[]>([]);

  // 请求开始时添加controller
  function addRequests(request: RequestState) {
    requests.value.push(request);
  }

  // 请求结束后删除controller
  function deleteRequest(url: string, method: string) {
    const controllItemIndex = requests.value.findIndex(
      (item) => item.url === url && item.method === method
    );
    if (controllItemIndex > -1) {
      requests.value.splice(controllItemIndex, 1);
    }
  }

  // 终止请求
  function AbortRequest(url?: string, method?: string) {
    if (requests.value.length === 0) return;

    requests.value.forEach((item) => {
      if ((!url || item.url === url) && (!method || item.method === method)) {
        item.controller.abort();
      }
    });
  }

  return { requests, addRequests, deleteRequest, AbortRequest };
});

export const useUserStore = defineStore("user", () => {
  const age = ref(27);
  const level = ref(5);
  const account = ref("SD77842");
  const nickname = ref("自古风流");

  return { age, level, account, nickname }; // 将数据暴露出去，共享给需要的组件
});
