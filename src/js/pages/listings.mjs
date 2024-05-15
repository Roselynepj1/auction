import { isLoggedIn, profile } from '../api/auth/state.mjs'
import { getProfileListings } from '../api/profile/profile.mjs'
import { hideElement, showElement } from '../utilities.mjs'
import { createListingTableRow } from '../../template-parts/listings.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const listingsPlaceholders = document.getElementById('listings-placeholders')
  const listingsDisplayArea = document.getElementById('listings-display-area')
  const noListings = document.getElementById('no-listings')

  if (isLoggedIn()) {
    const { name } = profile()
    getProfileListings(name)
      .then((listings) => {
        if (listings.length === 0) {
          console.log('Section executed', noListings)
          showElement(noListings)
        } else {
          listings.forEach((listing) => {
            let row = createListingTableRow(listing)
            listingsDisplayArea.append(row)
          })
        }
        showElement(listingsDisplayArea)
      })
      .catch()
      .finally(() => {
        hideElement(listingsPlaceholders)
      })
  } else {
    alert('Log in to view listings')
    window.location.href = '/pages/login.html'
  }
})
