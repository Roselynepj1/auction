import { login } from '../api/auth/login.mjs'
import {
  validateEmail,
  validateLength,
  hideElement,
  showElement,
} from '../utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Validates user login form and returns an object containing functions and data if successful,
   * or `false` if validation fails.
   *
   * @returns {object|boolean} An object containing functions and data if validation succeeds,
   *                          or `false` if validation fails.
   *
   */
  function loginValidation() {
    const loginForm = document.getElementById('login-form')
    const error = document.getElementById('error')
    //get the helpers
    const emailHelper = document.getElementById('email-helper')
    const passwordHelper = document.getElementById('password-helper')
    const loader = document.getElementById('status-loader')
    //create a form data object to capture user input
    const formData = new FormData(loginForm)
    const email = formData.get('email')
    const password = formData.get('password')
    let errors = {
      email: false,
      password: false,
    }

    const showErrorMsg = (message) => {
      error.innerHTML = message
      loader.classList.add('d-none')
      error.classList.remove('d-none')
    }

    const hideErrorMsg = () => {
      error.classList.add('d-none')
    }
    //Success form submission
    const success = () => {
      hideErrorMsg()
      loader.classList.add('d-none')
      signupForm.reset()
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

    if (!validateLength(password, 8)) {
      errors['password'] = true
      passwordHelper.textContent =
        'Password length must be 8 or more characters'
    } else {
      errors['password'] = false
      passwordHelper.textContent = null
    }

    //check if no errors have been raised
    if (!errors['email'] && !errors['password']) {
      loader.classList.remove('d-none')
      return {
        loader,
        success,
        user: { email, password },
        showErrorMsg,
        hideErrorMsg,
      }
    } else {
      return null
    }
  }

  document
    .getElementById('login-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault()
      const formData = loginValidation()

      if (formData) {
        //log user in
        const { user, loader, success, showErrorMsg, hideErrorMsg } = formData
        showElement(loader)
        try {
          const res = await login(user.email, user.password)
          hideElement(loader)
          // redirect user
          const { name } = res
          window.location.href = '/pages/profile.html?name=' + name
        } catch (error) {
          showErrorMsg(error)
          hideElement(loader)
        }
      }
    })
})
