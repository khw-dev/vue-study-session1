<template>
  <div class="d-flex w-100 mb-4" :class="message.isMine ? 'justify-end' : 'justify-start'">
    <div :style="{ maxWidth: '70%' }">

      <div v-if="!message.isMine" class="text-caption text-grey-darken-1 mb-1 ml-1">
        {{ message.username }}
      </div>

      <v-sheet
        :class="[
          'px-4 py-2 text-body-1',
          message.isMine ? 'text-white rounded-br-0' : 'text-high-emphasis rounded-bl-0'
        ]"
        :color="message.isMine ? 'primary' : 'grey-lighten-3'"
        elevation="1"
        rounded="xl"
      >
        {{ message.message }}
      </v-sheet>

    </div>
  </div>
</template>

<script setup>
// 부모로부터 message 객체를 받습니다.
  const props = defineProps({
    message: {
      type: Object,
      required: true,
    // 구조 예시: { username: 'user1', message: 'hello', isMine: true }
    },
  })
</script>
