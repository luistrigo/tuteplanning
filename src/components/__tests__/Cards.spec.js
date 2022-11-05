import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Cards from '../Cards.vue'

describe('Cards', () => {
  it('playground', () => {
    const wrapper = mount(Cards, { props: { points_style: 'fibonacci' } })
  })
  it('renders properly', () => {
    const wrapper = mount(Cards, { props: { points_style: 'fibonacci' } })
    const cards = wrapper.find('.card-point').length;
    expect(cards ==10)
  })
  
})
