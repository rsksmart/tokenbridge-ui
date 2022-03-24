import { shallowMount } from '@vue/test-utils'

import CrossForm from '@/components/crossForm/CrossForm.vue'

describe('CrossForm.vue Test', () => {
  let wrapper = null
  // SETUP
  beforeEach(() => {})

  // TEAR DOWN
  afterEach(() => {})

  it('renders initial values when component is created', () => {
    // Update the props passed in to the Weather component
    wrapper = shallowMount(CrossForm, {
      propsData: {
        typesLimits: [],
        rskFee: 0.2,
        sideFee: 0.2,
        rskConfirmations: {},
        sideConfirmations: {},
      },
    })

    // check the props of the component
    expect(wrapper.vm.rskFee).toEqual(0.2)
    expect(wrapper.vm.sideFee).toEqual(0.2)
  })
})
