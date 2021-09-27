import { reactive } from 'vue'

const globalStore = {
  state: reactive({
    tokenTypeSelected: null,
  }),
}

export default globalStore
