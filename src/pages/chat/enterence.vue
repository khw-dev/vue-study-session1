<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="pa-4" elevation="10" rounded="xl">
          <v-card-item>
            <div class="text-center mb-6 mt-4">
              <div class="text-h1 mb-2">💬</div>
              <h2 class="text-h4 font-weight-bold mb-2">채팅방 입장</h2>
              <p class="text-body-2 text-medium-emphasis">사용할 닉네임을 입력해주세요.</p>
            </div>

            <v-form v-model="formValid" @submit.prevent="submitForm">
              <v-text-field
                v-model="nickname"
                autofocus
                class="mb-2"
                clearable
                counter="10"
                label="닉네임 (2~10자)"
                placeholder="닉네임"
                :rules="nicknameRules"
                variant="outlined"
              />

              <div class="d-grid gap-2 mt-4 mb-2">
                <v-btn
                  block
                  color="primary"
                  :disabled="!formValid"
                  elevation="4"
                  rounded="pill"
                  size="x-large"
                  type="submit"
                >
                  입장하기 🚀
                </v-btn>
              </div>
            </v-form>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formValid = ref(false) // 폼 전체 유효성 상태
const nickname = ref('')

// 유효성 검사 규칙 (Array of Functions)
const nicknameRules = [
  (v) => !!v || '닉네임을 입력해주세요.',
  (v) => (v && v.length >= 2) || '2글자 이상 입력해주세요.',
  (v) => (v && v.length <= 10) || '10글자 이하로 입력해주세요.',
]

// 입장 버튼 클릭 시 동작
function submitForm() {
  if (!formValid.value) return

  router.push({
    path: '/chat/room',
    query: { username: nickname.value },
  })
}
</script>
