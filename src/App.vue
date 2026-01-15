<template>
  <v-app>
    <TheHeader />

    <v-main>
      <router-view />
    </v-main>

    <TheFooter />
  </v-app>
</template>

<script setup>
import TheFooter from '@/components/common/TheFooter.vue'
import TheHeader from '@/components/common/TheHeader.vue'
</script>
