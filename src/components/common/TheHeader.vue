<template>
  <v-app-bar color="grey-darken-4" theme="dark" elevation="2">
    <v-container class="d-flex align-center py-0">
      <v-app-bar-title class="font-weight-bold cursor-pointer" @click="$router.push('/')">
        Vue Study
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex">
        <v-btn variant="text" to="/">홈</v-btn>
        <v-btn variant="text" to="/chat/enterence">채팅</v-btn>
        <v-btn variant="text" to="/board/list">게시판</v-btn>
      </div>

      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list>
      <v-list-item title="홈" to="/"></v-list-item>
      <v-list-item title="채팅" to="/chat/enterence"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

// 모바일 드로어 상태 제어
const drawer = ref(false);
</script>