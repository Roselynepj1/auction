import {
  showElement,
  hideElement,
  formatDate,
  getSearchParams,
  updateCountdownTimer,
  calculateTimeRemaining,
  createElement,
  createBidTableRow,
} from '../utilities.mjs'
import { getListing, placeBid } from '../api/listings/listings.mjs'
import { profile, isLoggedIn, updateLoggedInUser } from '../api/auth/state.mjs'
import { getCredits } from '../api/profile/profile.mjs'

/**
 * Validates place bid form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
function placeBidValidation() {
  const placeBidForm = document.getElementById('place-bid')
  const errorMsg = document.getElementById('error')
  const successMsg = document.getElementById('success')
  //get the helpers
  const bidHelper = document.getElementById('bid-helper')
  const loader = document.getElementById('status-loader')
  //create a form data object to capture user input
  const formData = new FormData(placeBidForm)
  const bid = formData.get('bid')
  let errors = {
    bid: false,
  }

  const showErrorMsg = (message) => {
    errorMsg.innerHTML = message
    hideElement(loader)
    showElement(errorMsg)
    errorMsg.focus()
  }

  const hideErrorMsg = () => {
    hideElement(errorMsg)
  }
  //Success form submission
  const success = (msg) => {
    hideErrorMsg()
    hideElement(loader)
    placeBidForm.reset()
    successMsg.innerHTML = msg
    showElement(successMsg)
    successMsg.focus()
  }

  if (bid <= 0) {
    errors['bid'] = true
    bidHelper.textContent = 'Bid value cannot be less than or equal to zero'
  } else if (bid > 1000) {
    errors['bid'] = true
    bidHelper.textContent = 'Bid value cannot be greater than 1000'
  } else {
    errors['bid'] = false
    bidHelper.textContent = null
  }

  //check if no errors have been raised
  if (!errors['bid']) {
    showElement(loader)
    return {
      loader,
      success,
      bid,
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getSearchParams('id')
  const listingPlaceholders = document.getElementById('listing-placeholders')
  const listingItem = document.getElementById('listing-item')
  const listingFeaturedImage = document.getElementById('listing-featured-img')
  const listingOtherImages = document.getElementById('listing-other-images')
  const listingTitle = document.getElementById('listing-title')
  const listingTotalBids = document.getElementById('listing-total-bids')
  const listingDescription = document.getElementById('listing-description')
  const listingDateDay = document.getElementById('listing-date-day')
  const listingDateHour = document.getElementById('listing-date-hour')
  const listingDateMin = document.getElementById('listing-date-min')
  const listingDateSec = document.getElementById('listing-date-sec')
  const listingEndDate = document.getElementById('listing-end-date')
  const placeBidBtn = document.getElementById('place-bid-btn')
  const loginToBidBtn = document.getElementById('login-to-bid-btn')
  const allBidders = document.getElementById('all-bidders')
  const auctionEnd = document.getElementById('auction-end')
  const auctionTimer = document.getElementById('auction-timer')
  const placeBidForm = document.getElementById('place-bid')
  const listingDateCreated = document.getElementById('listing-date-created')

  if (isLoggedIn()) {
    showElement(placeBidBtn)
    hideElement(loginToBidBtn)
  }

  if (id) {
    getListing(id)
      .then((listing) => {
        const {
          id,
          title,
          description,
          media,
          tags,
          endsAt,
          seller,
          bids,
          _count,
          created,
        } = listing
        // update dom
        hideElement(listingPlaceholders)
        listingFeaturedImage.setAttribute('src', media[0])

        listingTitle.textContent = title
        listingTotalBids.textContent = _count['bids']
        listingDescription.textContent = description
        listingEndDate.textContent = formatDate(endsAt)
        listingDateCreated.textContent = formatDate(created)

        //add corresponding images to the list
        media.forEach((item, index) => {
          const divContainer = createElement(
            'div',
            ['col-sm-4', 'col-md-4', 'col-lg-3'],
            {},
          )
          const img = createElement('img', ['img-fluid', 'img-thumbnail'], {
            src: item,
            alt: title + index,
          })

          img.addEventListener('click', () => {
            listingFeaturedImage.setAttribute('src', item)
          })
          divContainer.appendChild(img)
          listingOtherImages.appendChild(divContainer)
        })
        //find end time
        const remainingTime = calculateTimeRemaining(endsAt)
        // set time
        remainingTime &&
          updateCountdownTimer(
            endsAt,
            listingDateDay,
            listingDateHour,
            listingDateMin,
            listingDateSec,
          )

        if (!remainingTime) {
          showElement(auctionEnd)
          hideElement(auctionTimer)
          hideElement(placeBidForm)
        }
        //sort bids
        bids.sort((a, b) => b.amount - a.amount)
        //show all bidders

        bids.forEach((bid) => {
          const tr = createBidTableRow(bid.bidderName, bid.created, bid.amount)
          allBidders.append(tr)
        })
        //The user who created a listing can not bid on it
        if (isLoggedIn()) {
          //get currently logged in user
          const { name } = profile()
          name === seller.name && hideElement(placeBidForm)
        }

        //show the listing item
        showElement(listingItem)
      })
      .catch((error) => {})
  } else {
    alert('No product id was provided')
    hideElement(listingPlaceholders)
  }

  //handle place bid
  placeBidForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = placeBidValidation()

    if (formData) {
      const { bid, success, loader, showErrorMsg } = formData
      placeBid(id, Number(bid))
        .then((listing) => {
          success('Bid has been placed successfully')
          //update the bidders table
          const { bids } = listing
          //sort the bids
          bids.sort((a, b) => b.amount - a.amount)
          allBidders.innerHTML = ''
          bids.forEach((bid) => {
            const tr = createBidTableRow(
              bid.bidderName,
              bid.created,
              bid.amount,
            )
            allBidders.append(tr)
          })
          //get new user remaining credits
          const { name } = profile()
          getCredits(name)
            .then((res) => {
              updateLoggedInUser('credits', res.credits)
            })
            .catch((error) => console.error(error))
          //hide successMsg after 2 seconds
          setTimeout(() => {
            hideElement(document.getElementById('success'))
          }, 2000)
        })
        .catch((error) => {
          showErrorMsg(error)
        })
        .finally(() => hideElement(loader))
    }
  })
})
