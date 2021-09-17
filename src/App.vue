<template>
  <div id="main">
    <NavBar />
    <router-view />
    <Footer />
    <WrapperModal ref="wrapperModal" />
  </div>
</template>

<script>
import { provide, ref } from 'vue'
// import Connection from '@/components/commons/Connection.vue'
import NavBar from '@/components/layouts/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'
import WrapperModal from '@/components/commons/Modals/WrapperModal'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    WrapperModal,
  },
  setup() {
    const wrapperModal = ref(null)
    provide('$modal', wrapperModal)
    return { wrapperModal }
  },
}
</script>
