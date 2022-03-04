<template>
  <div class="title">
    <div v-if="sharedState.isConnected" class="bridge-info">
      <h1 id="title">
        {{ sharedState.rskConfig.name }} bridge with {{ sharedState.sideConfig.name }}
      </h1>
      <h5 class="bridge-info-subtitle">
        You can convert your tokens from {{ sharedState.rskConfig.name }} to
        {{ sharedState.sideConfig.name }} and viceversa.
      </h5>
    </div>
  </div>
</template>

<script>
import { store } from '@/store.js'

export default {
  name: 'Title',
  data() {
    return {
      sharedState: store.state,
    }
  },
}
</script>
<style scoped>
.bridge-info {
  text-align: center;
  margin-bottom: 20px;
}
.bridge-info .subtitle {
  text-align: center;
  margin-bottom: 5px;
}
#title{
  margin-bottom: 0;
}
</style>
