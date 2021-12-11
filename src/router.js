import { createWebHistory, createRouter } from 'vue-router'

// 1. Define route components.
// These can be imported from other files
import Home from '@/views/Home.vue'
import TransactionsPage from '@/views/TransactionsPage'
import TokenListPage from '@/views/TokenListPage'
import NetworkInfoPage from '@/views/NetworkInfoPage'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/transactions',
    component: TransactionsPage,
  },
  {
    path: '/network-info',
    component: NetworkInfoPage,
  },
  {
    path: '/token-list',
    component: TokenListPage,
  },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
  scrollBehavior: function(to) {
    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
  },
})

export default router
