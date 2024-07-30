import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// vue项目自带路由
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home.vue"),
  },
  {
    path: "/storeTest",
    name: "StoreTest",
    component: () => import("@/views/storeTest.vue"),
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const routers = [...routes];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: routers,
});

export default router;
