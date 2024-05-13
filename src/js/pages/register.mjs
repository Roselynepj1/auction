import { register } from '../api/auth/register.mjs'
import {
  hideElement,
  showElement,
  equal,
  validateEmail,
  validateLength,
  isValidUrl,
} from '../utilities.mjs'

/**
 * Validates user signup form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
export function signupValidation() {
  const registerForm = document.getElementById('register-form')
  const successMsg = document.getElementById('success')
  const errorMsg = document.getElementById('error')
  //get the helpers
  const usernameHelper = document.getElementById('username-helper')
  const avatarHelper = document.getElementById('avatar-helper')
  const emailHelper = document.getElementById('email-helper')
  const passwordHelper = document.getElementById('password-helper')
  const confirmPasswordHelper = document.getElementById(
    'confirm-password-helper',
  )
  const loader = document.getElementById('status-loader')
  //create a form data object to capture user input
  const formData = new FormData(registerForm)
  const username = formData.get('username')
  const avatar = formData.get('avatar')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirm-password')
  let errors = {
    email: false,
    username: false,
    avatar: false,
    password: false,
    cpassword: false,
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

  if (!validateLength(email)) {
    emailHelper.textContent = 'Email is required'
    errors['email'] = true
  } else if (!validateEmail(email)) {
    errors['email'] = true
    emailHelper.textContent = 'Please provide a valid email address'
  } else {
    errors['email'] = false
    emailHelper.textContent = null
  }

  if (!validateLength(username, 3)) {
    errors['username'] = true
    usernameHelper.textContent = 'Password length must be 3 or more characters'
  } else {
    errors['username'] = false
    usernameHelper.textContent = null
  }
  if (!validateLength(password, 8)) {
    errors['password'] = true
    passwordHelper.textContent = 'Password length must be 8 or more characters'
  } else {
    errors['password'] = false
    passwordHelper.textContent = null
  }

  if (!equal(confirmPassword, password)) {
    errors['cpassword'] = true
    confirmPasswordHelper.textContent = 'Password should match'
  } else {
    errors['cpassword'] = false
    confirmPasswordHelper.textContent = null
  }
  if (!isValidUrl(avatar)) {
    errors['avatar'] = true
    avatarHelper.textContent = 'Please provide a valid url'
  } else {
    errors['avatar'] = false
    avatarHelper.textContent = null
  }

  //check if no errors have been raised
  if (!errors['email'] && !errors['password'] && !errors['cpassword']) {
    //return the data from the form
    //return a function to clear the form when submission is done
    return {
      loader,
      showSuccessMsg,
      user: { email, password, avatar, name: username },
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('register-form')
    .addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = signupValidation()

      if (formData) {
        const { loader, showSuccessMsg, user, showErrorMsg, hideErrorMsg } =
          formData

        showElement(loader)
        register(user.name, user.email, user.password, user.avatar)
          .then((res) => {
            console.log(res)
            hideElement(loader)
            showSuccessMsg('Profile registered successfull. You can now login')
          })
          .catch((error) => {
            showErrorMsg(error)
            hideElement(loader)
          })
      }
    })
})
