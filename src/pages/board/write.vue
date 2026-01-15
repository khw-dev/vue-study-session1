<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center py-4 px-6 bg-grey-lighten-5">
            <span class="text-h5 font-weight-bold">✏️ 게시글 작성</span>
          </v-card-title>

          <v-divider />

          <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-card-text class="pa-6">
              <v-text-field
                v-model="post.writer"
                class="mb-2"
                label="작성자"
                placeholder="이름을 입력하세요"
                prepend-inner-icon="mdi-account"
                required
                :rules="nameRules"
                variant="outlined"
              />

              <v-text-field
                v-model="post.title"
                class="mb-2"
                label="제목"
                placeholder="제목을 입력하세요"
                prepend-inner-icon="mdi-format-title"
                required
                :rules="titleRules"
                variant="outlined"
              />

              <v-textarea
                v-model="post.content"
                auto-grow
                hide-details="auto"
                label="내용"
                placeholder="내용을 입력하세요"
                prepend-inner-icon="mdi-text-box-outline"
                rows="8"
                variant="outlined"
              />
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-4 d-flex justify-end">
              <v-btn
                color="grey-darken-1"
                :disabled="loading"
                size="large"
                to="/board/list"
                variant="outlined"
              >
                취소
              </v-btn>

              <v-btn
                color="primary"
                :disabled="!valid"
                :loading="loading"
                size="large"
                type="submit"
                variant="elevated"
              >
                등록하기
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref(null)
const valid = ref(false)
const loading = ref(false)

// 전송할 데이터 객체
const post = reactive({
  writer: '',
  title: '',
  content: '',
})

// 유효성 검사 규칙
const nameRules = [
  (v) => !!v || '작성자를 입력해주세요.',
  (v) => (v && v.length <= 10) || '작성자는 10자 이내여야 합니다.',
]

const titleRules = [
  (v) => !!v || '제목을 입력해주세요.',
  (v) => (v && v.length >= 2) || '제목은 2자 이상이어야 합니다.',
]

async function submitForm() {
  // 유효성 검증
  if (!valid.value) return

  loading.value = true

  try {
    const response = await axios.post('/api/board', post)

    if (response.status === 200 || response.status === 201) {
      alert('게시글이 성공적으로 등록되었습니다! 🎉')

      // 성공 시 목록 페이지로 이동
      router.push('/board/list')
    }
  } catch (error) {
    console.error('게시글 저장 실패:', error)
    alert('게시글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}
</script>
