import { createApp } from 'vue'
import { defineRule } from 'vee-validate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

import { loadFonts } from './plugins/webfontloader'
import { rules } from './validators/transactions'
import '@/styles/main.scss'
import ServicesPlugin from '@/plugins/ServicesPlugin'
import { TransactionService } from '@/modules/transactions/transactions.service'

Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule])
})

loadFonts()

createApp(App).use(router).use(ServicesPlugin, { TransactionService }).use(vuetify).mount('#app')
