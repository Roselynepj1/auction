import { createProductElement } from '../../template-parts/listings.mjs'
import { getListings } from '../api/listings/listings.mjs'
import { hideElement, showElement, validateLength } from '../utilities.mjs'

/**
 * Validates shop form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
function shopValidation() {
  const shopForm = document.getElementById('shop-form')
  const errorMsg = document.getElementById('error')
  const successMsg = document.getElementById('success')
  //get the helpers
  const sortbyHelper = document.getElementById('sortby-helper')
  const tagHelper = document.getElementById('tag-helper')
  const bidAmountHelper = document.getElementById('bid-amount-helper')
  const loader = document.getElementById('status-loader-item')
  //create a form data object to capture user input
  const formData = new FormData(shopForm)
  const bidFrom = formData.get('bid-from')
  const bidTo = formData.get('bid-to')
  const tag = formData.get('tag')
  const sortby = formData.get('sortby')
  let errors = {
    bidFrom: false,
    bidTo: false,
    tag: false,
    sortby: false,
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
    shopForm.reset()
    successMsg.innerHTML = msg
    showElement(successMsg)
    successMsg.focus()
  }

  if (bidFrom < 0) {
    errors['bidFrom'] = true
    bidAmountHelper.textContent = 'Bid From value cannot be less than zero'
  } else if (bidFrom > 1000) {
    errors['bidFrom'] = true
    bidAmountHelper.textContent = 'Bid From value cannot be greater than 1000'
  } else {
    errors['bidFrom'] = false
    bidAmountHelper.textContent = null
  }

  if (bidTo <= 0) {
    errors['bidTo'] = true
    bidAmountHelper.textContent =
      'Bid From value cannot be less than or equal to zero'
  } else if (bidTo > 1000) {
    errors['bidTo'] = true
    bidAmountHelper.textContent = 'Bid From value cannot be greater than 1000'
  } else if (bidTo < bidFrom) {
    errors['bidTo'] = true
    bidAmountHelper.textContent =
      'Bid To value cannot be less than Bid From value'
  } else {
    errors['bidTo'] = false
    bidAmountHelper.textContent = null
  }

  //check if no errors have been raised
  if (!errors['bidTo'] && !errors['bidFrom']) {
    showElement(loader)
    return {
      loader,
      success,
      data: { bidFrom, bidTo, tag, sortby },
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const listingsPlaceholders = document.getElementById('listings-placeholder')
  const listingsDisplayArea = document.getElementById('listings-display-area')
  const loadMore = document.getElementById('load-more')
  const loader = document.getElementById('status-loader')
  const shopForm = document.getElementById('shop-form')
  let filter = false
  const limit = 20
  let offset = 0

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
    console.log('clicked')
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

  shopForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = shopValidation()

    if (formData) {
      const { data, loader, hideErrorMsg, successMsg } = formData
      showElement(loader)
      filter = true
      showElement(listingsPlaceholders)
      //clear display area
      listingsDisplayArea.innerHTML = ''
      getListings({ sortOrder: data.sortby, _tag: data.tag })
        .then((listings) => {
          listings.forEach((listing) => {
            //filter out listings that dont match the bids
            const { _count } = listing

            if (_count.bids >= data.bidFrom && _count.bids <= data.bidTo) {
              const listingElement = createProductElement(listing)
              listingsDisplayArea.append(listingElement)
            }
          })
        })
        .finally(() => {
          hideElement(listingsPlaceholders)
          hideElement(loader)
        })
    }
  })
})
