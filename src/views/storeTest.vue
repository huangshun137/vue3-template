<script setup>
import { useUserStore } from "@/store/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

// 获取 UserStore 实例
const user_store = useUserStore();

// 通过 computed() 将 store 中 state 映射成当前组件中的计算属性，具有响应性，但是是只读的
const user_age = computed(() => user_store.age);
const user_level = computed(() => user_store.level);
const user_account = computed(() => user_store.account);
const user_nickname = computed(() => user_store.nickname);

// storeToRefs 将 store 中 state 解构为组件的数据，具有响应性，还可以响应式修改
const {
  age,
  level,
  account: userAccount,
  nickname: userNickname,
} = storeToRefs(user_store);
</script>

<template>
  <h2>从 store 直接取 state</h2>
  <ul>
    <li>年龄：{{ user_store.age }}</li>
    <li>等级：{{ user_store.level }}</li>
    <li>账号：{{ user_store.account }}</li>
    <li>昵称：{{ user_store.nickname }}</li>
  </ul>
  <button @click="user_store.age += 10">更改年龄</button>
  |
  <button @click="user_store.nickname += '='">更改昵称</button>

  <hr />
  <h2>computed 映射为计算属性</h2>
  <ul>
    <li>年龄：{{ user_age }}</li>
    <li>等级：{{ user_level }}</li>
    <li>账号：{{ user_account }}</li>
    <li>昵称：{{ user_nickname }}</li>
  </ul>
  <button @click="user_age += 10">更改年龄</button>
  |
  <button @click="user_nickname += '='">更改昵称</button>

  <hr />
  <h2>storeToRefs 解构成自己的数据</h2>
  <ul>
    <li>年龄：{{ age }}</li>
    <li>等级：{{ level }}</li>
    <li>账号：{{ userAccount }}</li>
    <li>昵称：{{ userNickname }}</li>
  </ul>
  <button @click="age += 10">更改年龄</button>
  |
  <button @click="userNickname += '='">更改昵称</button>
</template>
