<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-6">📢 공지사항</h2>

        <v-card elevation="2" rounded="lg">
          <v-data-table
            class="elevation-0"
            :headers="headers"
            hover
            :items="boardList"
            :loading="loading"
          >
            <template #item.title="{ item, index }">
              <span class="text-decoration-none text-high-emphasis font-weight-bold">
                {{ item.title }}
              </span>

              <v-chip
                v-if="index === 0"
                class="ml-2"
                color="error"
                label
                size="x-small"
                variant="flat"
              >
                NEW
              </v-chip>
            </template>

            <template #item.writer="{ item }">
              <v-chip color="secondary" size="small" variant="tonal">
                {{ item.writer }}
              </v-chip>
            </template>

            <template #item.createDateTime="{ item }">
              <span class="text-caption text-medium-emphasis">
                {{ formatDate(item.createDateTime) }}
              </span>
            </template>

            <template #no-data>
              <div class="py-10 text-center text-grey">
                <v-icon class="mb-2" icon="mdi-alert-circle-outline" size="large" />
                <p>등록된 게시글이 없습니다.</p>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <div class="d-flex justify-end mt-4">
          <v-btn
            color="primary"
            elevation="2"
            prepend-icon="mdi-pencil"
            rounded="pill"
            size="large"
            to="/board/write"
          >
            글쓰기
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import moment from 'moment'
import { onMounted, ref } from 'vue'

const loading = ref(false)

const headers = [
  { title: '#', key: 'id', align: 'center', width: '80px', sortable: false },
  { title: '제목', key: 'title', align: 'start' },
  { title: '작성자', key: 'writer', align: 'center', width: '120px' },
  { title: '작성일시', key: 'createDateTime', align: 'center', width: '180px' },
]

const boardList = ref([])

async function fetchBoardList() {
  loading.value = true
  try {
    const response = await axios.get('/api/board')

    boardList.value = response.data
  } catch (error) {
    console.error('게시글 로드 실패:', error)
    alert('데이터를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  return moment(dateString).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  fetchBoardList()
})
</script>
