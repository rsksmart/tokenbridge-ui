import { createApp } from 'vue'
import { defineRule } from 'vee-validate'
import App from './App.vue'
import router from './router'

import { rules } from './validators/transactions'
import './styles/main.css'
import ServicesPlugin from '@/plugins/ServicesPlugin'
import { TransactionService } from '@/modules/transactions/transactions.service'

Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule])
})

Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule])
})

createApp(App)
  .use(router)
  .use(ServicesPlugin, { TransactionService })
  .mount('#app')
