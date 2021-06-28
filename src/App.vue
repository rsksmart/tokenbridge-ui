<template>
  <div id="main">
    <NavBar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/layouts/NavBar.vue'
import Footer from './components/layouts/Footer.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
  },
}
</script>
