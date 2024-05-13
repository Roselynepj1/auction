import { isLoggedIn } from '../api/auth/state.mjs'
import { addListing, getListing, updateListing } from '../api/listings/listings.mjs'
import {
  getSearchParams,
  hideElement,
  isValidDateTime,
  showElement,
  validateLength,
  isValidUrl,
} from '../utilities.mjs'

/**
 * Validates create listing  form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
export function createListingValidation() {
  const registerForm = document.getElementById('listings-form')
  const successMsg = document.getElementById('success')
  const errorMsg = document.getElementById('error')
  //get the helpers
  const titleHelper = document.getElementById('title-helper')
  const descriptionHelper = document.getElementById('description-helper')
  const mediaHelper = document.getElementById('media-helper')
  const tagsHelper = document.getElementById('tags-helper')
  const endsAtHelper = document.getElementById('endsAt-helper')
  const loader = document.getElementById('status-loader')
  //create a form data object to capture user input
  const formData = new FormData(registerForm)
  const title = formData.get('title')
  const description = formData.get('description')
  const media = formData.get('media')
  const tags = formData.get('tags')
  const endsAt = formData.get('endsAt')
  let errors = {
    title: false,
    description: false,
    media: false,
    tags: false,
    endsAt: false,
  }
  const showErrorMsg = (message) => {
    hideSuccessMsg()
    hideElement(loader)
    errorMsg.innerHTML = message
    showElement(errorMsg)
    errorMsg.focus()
  }

  const hideErrorMsg = () => {
    hideElement(errorMsg)
  }
  //Success form submission
  const showSuccessMsg = (message) => {
    hideErrorMsg()
    hideElement(loader)
    registerForm.reset()
    successMsg.innerHTML = message
    showElement(successMsg)
    successMsg.focus()
  }
  const hideSuccessMsg = () => {
    hideElement(successMsg)
  }

  if (!validateLength(title, 3)) {
    errors['title'] = true
    titleHelper.textContent = 'Title length must be 3 or more characters'
  } else {
    errors['title'] = false
    titleHelper.textContent = null
  }
  if (!validateLength(tags, 3)) {
    errors['tags'] = true
    tagsHelper.textContent = 'Tags length must be 3 or more characters'
  } else {
    errors['tags'] = false
    tagsHelper.textContent = null
  }
  if (!isValidDateTime(endsAt)) {
    errors['endsAt'] = true
    endsAtHelper.textContent = 'Please provide a valid date'
  } else {
    errors['endsAt'] = false
    endsAtHelper.textContent = null
  }
  if (!validateLength(description, 25)) {
    errors['description'] = true
    descriptionHelper.textContent =
      'Description length must be 25 or more characters'
  } else {
    errors['description'] = false
    descriptionHelper.textContent = null
  }

  media.split(',').forEach((item)=>{ 
    if (!isValidUrl(item)) {
      errors['media'] = true
      mediaHelper.textContent = 'Please provide valid urls'
    } else {
      errors['media'] = false
      mediaHelper.textContent = null
    }
  })

  //check if no errors have been raised
  if (
    !errors['title'] &&
    !errors['description'] &&
    !errors['media'] &&
    !errors['tags'] &&
    !errors['endsAt']
  ) {
    //return the data from the form
    //return a function to clear the form when submission is done
    return {
      loader,
      showSuccessMsg,
      listing: { title, description, media: media.split(','), tags: tags.split(','), endsAt },
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const goToLogin = document.querySelector('.goto-login')
  const listingId = getSearchParams('id')
  const listingSaveBtn = document.querySelector('.submit-btn')
  const listingsForm = document.getElementById('listings-form')

  if (isLoggedIn()) {
    //hide goto login link
    hideElement(goToLogin)
    showElement(listingSaveBtn)
  }

  if(listingId){
    //fetch the listing content
    getListing(listingId).then((res)=>{
      const { title, description, media, tags, endsAt } = res
      document.getElementById('title').setAttribute('value', title)
      document.getElementById('description').textContent = description
      document.getElementById('media').setAttribute('value', media.join(','))
      document.getElementById('tags').setAttribute('value', tags.join(','))
      // Assuming you have a datetime string from the API
      const apiDateTimeString = endsAt

      // Convert the datetime string to a JavaScript Date object
      const dateTime = new Date(apiDateTimeString)

      // Format the date and time to match the expected format of datetime-local input
      const formattedDateTime = dateTime.toISOString().slice(0, 16)

      document.getElementById('endsAt').setAttribute('value', formattedDateTime)
    }).catch((error)=>{
        alert("Could not find listing details")
    })
  }

  listingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = createListingValidation()
    if (formData) {
      const { listing, showSuccessMsg, showErrorMsg, loader } = formData
      //get listing id if availabe to update
      if (!listingId) {
        showElement(loader)
        addListing(listing)
          .then((res) => {
            showSuccessMsg('Listing has been created successfully')
            const {id} = res
            //redirect to edit page
            setTimeout(()=>{
                window.location.href = "/pages/create-listing.html?id="+id
            },3000)
          })
          .catch((error) => {
            showErrorMsg(error)
          })
          .finally(() => {
            hideElement(loader)
          })
      } else {
        showElement(loader)
        updateListing(listingId, listing)
          .then((res) => {
            showSuccessMsg('Listing has been updated successfully')
          })
          .catch((error) => {
            showErrorMsg(error)
          })
          .finally(() => {
            hideElement(loader)
          })
      }
      //Add listing if id is invalid
    }
  })
})
