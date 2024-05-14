import { createProductElement } from '../../template-parts/listings.mjs'
import { getListings } from '../api/listings/listings.mjs'
import { hideElement, showElement } from '../utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const listingsPlaceholders = document.getElementById('listings-placeholder')
  const listingsDisplayArea = document.getElementById('listings-display-area')

  getListings()
    .then((listings) => {
      listings.forEach((listing) => {
        const listingElement = createProductElement(listing)
        listingsDisplayArea.append(listingElement)
      })

      showElement(listingsDisplayArea)
    })
    .catch(() => {})
    .finally(() => {
      hideElement(listingsPlaceholders)
    })
})
