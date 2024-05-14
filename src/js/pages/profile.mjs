import { createProductCard } from '../../template-parts/listings.mjs'
import { isLoggedIn, profile } from '../api/auth/state.mjs'
import { getProfile } from '../api/profile/profile.mjs'
import { getUrlParam, hideElement, showElement } from '../utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const urlName = getUrlParam('name')
  const myBids = document.getElementById('profile-user-bids')
  const myWins = document.getElementById('profile-user-wins')
  const username = document.getElementById('profile-username')
  const avatar = document.getElementById('profile-user-image')
  const email = document.getElementById('profile-user-email')
  const credits = document.getElementById('profile-user-credits')
  const listingsPlaceholders = document.getElementById('listings-placeholders')
  const listingsDisplayArea = document.getElementById('listings-display-area')
  //Show the two tabs if user is logged in

  if (urlName) {
    //fetch the user details
    getProfile(urlName)
      .then((user) => {
        username.textContent = user.name
        avatar.setAttribute('src', user.avatar)
        email.textContent = user.email
        credits.textContent = `${user.credits} credits`

        user.listings.forEach((listing) => {
          listingsDisplayArea.appendChild(createProductCard(listing))
        })

        showElement(listingsDisplayArea)
      })
      .finally(() => {
        hideElement(listingsPlaceholders)
      })
  }
  if (isLoggedIn()) {
    const { name } = profile()

    if (urlName == name) {
      // showElement(myBids)
      // showElement(myWins)

      //Add event listeners to fetch the user bids and wins

      myBids.querySelector('button').addEventListener('click', (event) => {
        const { target } = event
        //target tab pane
        const tabPane = document.querySelector(
          target.getAttribute('data-bs-target'),
        ) 
      })
    } //if its logged user visting this page
  }
  //fetch user bids
})
