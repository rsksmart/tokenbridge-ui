import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/main.css'
import ServicesPlugin from '@/plugins/ServicesPlugin'
import { TransactionService } from '@/modules/transactions/transactions.service'

createApp(App)
  .use(router)
  .use(ServicesPlugin, { TransactionService })
  .mount('#app')
