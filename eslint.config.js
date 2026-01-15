import eslintConfigPrettier from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'

export default [
  {
    ignores: ['public/**', '**/node_modules/**', 'dist/**'],
  },
  ...(await vuetify()),
  eslintConfigPrettier,
  {
    rules: {
      // Prettier와 충돌할 수 있는 규칙 비활성화
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
    },
  },
]
