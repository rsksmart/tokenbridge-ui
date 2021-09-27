import CrossForm from '@/components/crossForm/CrossForm'
import NFTWrapper from '@/components/nftForm/NFTWrapper'
import NFTWrapperCommingSoon from '@/components/nftForm/NFTWrapperCommingSoon'

const nftAvailable = process.env.VUE_APP_NFT_AVAILABLE == 'true'

const formWrapperTabs = [
  {
    id: 'erc20',
    label: 'ERC20 Tokens',
    component: CrossForm,
  },
  {
    id: 'erc721',
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
