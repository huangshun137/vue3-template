/**
 * 模拟请求池工厂函数
 * @param {number} concurrency 最大并发数
 * @returns
 */
const requestQueue = (concurrency: number) => {
  concurrency = concurrency || 6; // 最大并发数
  const queue: Promise<any>[] = []; // 请求池
  let current = 0;

  const dequeue = () => {
    while (current < concurrency && queue.length) {
      current++;
      const requestPromiseFactory: Promise<any> = queue.shift()!; // 出列
      requestPromiseFactory.finally(() => {
        current--;
        dequeue();
      });
    }
  };

  return (requestPromiseFactory: Promise<any>) => {
    queue.push(requestPromiseFactory); // 入队
    dequeue();
  };
};

export { requestQueue };
