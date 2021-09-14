import { createApp } from 'vue'
import { defineRule } from 'vee-validate'
import App from './App.vue'
import router from './router'

import { rules } from './validators/transactions'
import './styles/main.css'

Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule])
})

createApp(App)
  .use(router)
  .mount('#app')
