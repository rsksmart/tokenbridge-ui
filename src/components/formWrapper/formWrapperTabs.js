import CrossForm from '@/components/crossForm/CrossForm'
import NFTWrapper from '@/components/nftForm/NFTWrapper'
import NFTWrapperCommingSoon from '@/components/nftForm/NFTWrapperCommingSoon'
import { TOKEN_TYPE_ERC_20, TOKEN_TYPE_ERC_721 } from '@/constants/tokenType.js'

const nftAvailable = process.env.VUE_APP_NFT_AVAILABLE == 'true'

const formWrapperTabs = [
  {
    tokenType: TOKEN_TYPE_ERC_20,
    label: 'ERC20 Tokens',
    component: CrossForm,
  },
  {
    tokenType: TOKEN_TYPE_ERC_721,
    label: 'NFT',
    component: nftAvailable ? NFTWrapper : NFTWrapperCommingSoon,
  },
]

export const tabsComponents = formWrapperTabs.reduce((acc, current) => {
  const component = current.component
  acc[component.name] = component
  return acc
}, {})

export default formWrapperTabs
