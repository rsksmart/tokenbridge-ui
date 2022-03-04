<template>
  <ul class="menu">
    <li
      v-for="menuItem in menuItems"
      :key="menuItem.path"
      class="menu-item"
      :class="{ 'menu-item-active': activePath === menuItem.path }"
    >
      <router-link :to="menuItem.path">
        <span v-if="menuItem.icon" :class="`fa ${menuItem.icon} mr-2`"></span>
        <span>{{ menuItem.title }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      selectedMenu: null,
      menuActiveClassName: 'menu-item-active',
      menuItems: [
        {
          path: '/',
          title: 'Cross',
          icon: null,
        },
        {
          path: '/transactions',
          title: 'Transactions',
          icon: null,
        },
        {
          path: '/network-info',
          title: 'Network Info',
          icon: null,
        },
        {
          path: '/token-list',
          title: 'Token List',
          icon: null,
        },
      ],
    }
  },
  computed: {
    activePath() {
      return this.$router.currentRoute.value.fullPath
    },
  },
}
</script>

<style scoped>
.menu {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-align: left;
  list-style: none;
  transition: background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
}

.menu:before {
  display: table;
  content: '';
}

.menu-item {
  width: 100%;
  left: 0;
  margin-bottom: 8px;
  margin-left: 0;
  margin-top: 4px;
  padding: 0 16px;
  border-right: 0;
  display: flex;
  align-items: center;
  transition: border-color 0.3s, background 0.3s, padding 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  white-space: nowrap;
  color: var(--primary);
  font-size: 12px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.3);
}

.menu-item:hover {
  opacity: 0.7;
}

.menu-item:after {
  transform: scaleY(1);
  opacity: 1;
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.menu-item.menu-item-active {
  border-bottom: 2px solid var(--primary);
}

.menu-item > * {
  width: 100%;
  color: var(--primary) !important;
}
</style>
