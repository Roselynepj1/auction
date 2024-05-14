import { createProductElement } from '../../template-parts/listings.mjs'
import { getListings } from '../api/listings/listings.mjs'
import { hideElement, showElement } from '../utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const listingsPlaceholders = document.getElementById('listings-placeholders')
  const listingsDisplayArea = document.getElementById('listings-display-area')
  getListings()
    .then((listings) => {
      listings.forEach((listing) => {
        let elem = createProductElement(listing, 'col-lg-3')
        listingsDisplayArea.append(elem)
      })
      showElement(listingsDisplayArea)
    })
    .catch()
    .finally(() => hideElement(listingsPlaceholders))
})
