import Cards from '../Cards.vue'

describe('Cards', () => {
  it('playground', () => {
    cy.mount(Cards, { props: { points_style: '' } })
  })

  it('renders properly', () => {
    cy.mount(Cards, { props: { points_style: '' } })
    cy.get('.cards-container').first('.card-point').first('.points')
  })
})
