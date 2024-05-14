import { createProductElement } from '../../template-parts/listings.mjs'
import { getListings } from '../api/listings/listings.mjs'
import { hideElement, showElement } from '../utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const listingsPlaceholders = document.getElementById('listings-placeholder')
  const listingsDisplayArea = document.getElementById('listings-display-area')
  const loadMore = document.getElementById('load-more')
  const loader = document.getElementById('status-loader')
  let offset = 0
  const limit = 20

  getListings()
    .then((listings) => { 
      listings.forEach((listing) => {
        listingsDisplayArea.append(createProductElement(listing))
      })

      showElement(listingsDisplayArea)
    })
    .catch(() => {})
    .finally(() => {
      hideElement(listingsPlaceholders)
    })

  loadMore.addEventListener('click', () => {
    offset += limit
    showElement(loader)
    getListings({ limit, offset })
      .then((listings) => {
        listings.forEach((listing) => {
          const listingElement = createProductElement(listing)
          listingsDisplayArea.append(listingElement)
        })
      })
      .catch(() => {})
      .finally(() => hideElement(loader))
  })
})
