import { isLoggedIn, profile, updateLoggedInUser } from '../api/auth/state.mjs'
import { getProfile, updateProfileMedia } from '../api/profile/profile.mjs'
import {
  getUrlParam,
  hideElement,
  isValidUrl,
  showElement,
} from '../utilities.mjs'

/**
 * Validates user avatar update form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
export function updateAvatarFormValidation() {
  const updateAvatarForm = document.getElementById('update-avatar-form')
  const successMsg = document.getElementById('success')
  const errorMsg = document.getElementById('error')
  //get the helpers
  const avatarHelper = document.getElementById('avatar-helper')
  const loader = document.getElementById('status-loader')
  //create a form data object to capture user input
  const formData = new FormData(updateAvatarForm)
  const avatar = formData.get('avatar')

  let errors = {
    avatar: false,
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
    updateAvatarForm.reset()
    successMsg.innerHTML = message
    showElement(successMsg)
    successMsg.focus()
  }
  const hideSuccessMsg = () => {
    hideElement(successMsg)
  }

  if (!isValidUrl(avatar)) {
    errors['avatar'] = true
    avatarHelper.textContent = 'Please provide a valid url'
  } else {
    errors['avatar'] = false
    avatarHelper.textContent = null
  }

  //check if no errors have been raised
  if (!errors['avatar']) {
    //return the data from the form
    //return a function to clear the form when submission is done
    return {
      loader,
      showSuccessMsg,
      avatar,
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const username = document.getElementById('profile-username')
  const avatar = document.getElementById('profile-user-image')
  const email = document.getElementById('profile-user-email')
  const credits = document.getElementById('profile-user-credits')
  const urlName = getUrlParam('name')
  const updateAvatarForm = document.getElementById('update-avatar-form')

  if (urlName) {
    //fetch the user details
    getProfile(urlName).then((user) => {
      username.textContent = user.name
      avatar.setAttribute('src', user.avatar)
      email.textContent = user.email
      credits.textContent = `${user.credits} credits`
    })

    updateAvatarForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = updateAvatarFormValidation()
      if (formData) {
        const { avatar: newAvatar, loader, showErrorMsg, showSuccessMsg } = formData
        showElement(loader)
        updateProfileMedia(urlName, newAvatar)
          .then((res) => {
            showSuccessMsg('Profile avatar updated successfully')
            avatar.setAttribute('src', newAvatar)
            updateLoggedInUser('avatar', newAvatar)
          })
          .catch((error) => showErrorMsg(error))
          .finally(() => hideElement(loader))
      }
    })
  }
})
