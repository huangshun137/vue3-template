import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // "/api": {
        //   target: "http://127.0.0.1:3000",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, ""),
        // },
      },
    },
  };
});
