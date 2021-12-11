<template>
  <aside class="sider">
    <div class="h-100">
      <div class="sider-logo">
        <a class="navbar-brand" href="https://rsk.co">
          <img
            id="logo"
            src="../../assets/img/bridge-logo.png"
            class="logo"
            alt="RSK Token Bridge"
          />
        </a>
      </div>
      <Menu />
    </div>
    <div class="fixed-bottom w-100 m-4">
      <a id="help" class="text-primary" href="https://developers.rsk.co/slack/">
        Do you need help?
      </a>
    </div>
  </aside>
</template>

<script>
import Menu from '@/components/layouts/Menu'

export default {
  name: 'Sider',
  components: { Menu },
}
</script>

<style scoped>
.sider {
  width: 200px;
  background-color: #ecf0f1;
  height: 100vh;
  position: sticky;
  flex: 0 0 200px;
  top: 0;
}
.sider-logo {
  text-align: center;
}
</style>
