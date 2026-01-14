<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">

      <section class="text-center bg-white py-16">
        <v-container>
          <h1 class="text-h2 font-weight-bold mb-6">안녕하세요! 👋</h1>
          <p class="text-h6 text-medium-emphasis mb-8">
            Spring Boot와 Vue, 그리고 Vuetify를 이용한<br>
            간단한 웹 애플리케이션 만들기 예제입니다.
          </p>

          <div class="d-flex justify-center ga-4">
            <v-btn color="primary" elevation="2" size="x-large" to="/">
              시작하기
            </v-btn>
            <v-btn href="https://vuetifyjs.com" size="x-large" target="_blank" variant="outlined">
              문서 보기
            </v-btn>
          </div>
        </v-container>
      </section>

      <v-container class="my-10">
        <v-row>
          <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4">
            <v-card class="h-100" elevation="1">
              <v-card-text class="text-center pa-6">
                <div class="text-h5 font-weight-bold mb-3">
                  {{ feature.title }}
                </div>
                <p class="text-body-1 text-medium-emphasis">
                  {{ feature.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </v-main>
  </v-app>
</template>

<script setup>
  const features = [
    {
      title: '⚡ 빠른 시작',
      description: 'Spring Boot와 Vite를 이용해 프론트/백엔드를 빠르게 구성하고 개발을 시작할 수 있습니다.',
    },
    {
      title: '🎨 Vuetify 디자인',
      description: 'Material Design 기반의 Vuetify 3 컴포넌트를 사용하여 아름다운 UI를 쉽게 구성해보세요.',
    },
    {
      title: '🐲 Vue.js',
      description: '더 이상 서버 템플릿 엔진이 아닙니다. SPA(Single Page Application)의 강력한 반응성을 경험하세요.',
    },
  ]
</script>
