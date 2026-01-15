<template>
  <v-app-bar color="grey-darken-4" elevation="2" theme="dark">
    <v-container class="d-flex align-center py-0">
      <v-app-bar-title class="font-weight-bold cursor-pointer" @click="$router.push('/')">
        Vue Study
      </v-app-bar-title>

      <v-spacer />

      <div class="d-none d-md-flex">
        <v-btn to="/" variant="text">홈</v-btn>
        <v-btn to="/chat/enterence" variant="text">채팅</v-btn>
        <v-btn to="/board/list" variant="text">게시판</v-btn>
        <v-btn to="/digitaltwin/robotarm" variant="text">디지털 트윈</v-btn>
      </div>

      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list>
      <v-list-item title="홈" to="/" />
      <v-list-item title="채팅" to="/chat/enterence" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

// 모바일 드로어 상태 제어
const drawer = ref(false)
</script>
