<template>
  <div id="main">
    <section class="d-flex">
      <Sider />
      <section class="d-flex flex-column w-100 justify-content-between">
        <NavBar />
        <router-view />
        <Footer />
      </section>
    </section>
    <WrapperModal ref="wrapperModal" />
  </div>
</template>

<script>
import { provide, ref } from 'vue'
import NavBar from '@/components/layouts/NavBar.vue'
import Footer from '@/components/layouts/Footer.vue'
import Sider from '@/components/layouts/Sider'
import WrapperModal from '@/components/commons/Modals/WrapperModal'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    WrapperModal,
    Sider,
  },
  setup() {
    const wrapperModal = ref(null)
    provide('$modal', wrapperModal)
    return { wrapperModal }
  },
}
</script>
