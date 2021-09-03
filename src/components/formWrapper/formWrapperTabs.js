import CrossForm from '@/components/crossForm/CrossForm'
import NFTWrapper from '@/components/nftForm/NFTWrapper'

const formWrapperTabs = [
  {
    label: 'Token',
    component: CrossForm,
  },
  {
    label: 'NFT',
    component: NFTWrapper,
  },
]

export const tabsComponents = formWrapperTabs.reduce((acc, current) => {
  const component = current.component
  acc[component.name] = component
  return acc
}, {})

export default formWrapperTabs
