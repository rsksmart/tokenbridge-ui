import { reactive } from 'vue'
import { TOKEN_TYPE_ERC_20 } from '@/constants/tokenType.js'

const globalStore = {
  state: reactive({
    actualTokenType: TOKEN_TYPE_ERC_20,
  }),
}

export default globalStore
