export default [
  {
    url: "/api/test",
    method: "POST",
    response: (request: any) => {
      // 如果有返回成功信息
      return { code: 200, data: { results: [] } };
    },
    timeout: 1000,
  },
];
