/**
 * Retrieves the value of a specified search parameter from the URL query string.
 * @param {string} key - The key of the search parameter to retrieve.
 * @returns {string|null} The value of the search parameter, or null if not found.
 */
export const getSearchParams = (key) => {
  const searchString = window.location.search
  const urlSearchParams = new URLSearchParams(searchString)
  return urlSearchParams.get(key)
}

/**
 * Hides the specified HTML element by adding the 'd-none' class.
 * @param {HTMLElement} element - The element to hide.
 */
export const hideElement = (element) => {
  element.classList.add('d-none')
}

/**
 * Shows the specified HTML element by removing the 'd-none' class.
 * @param {HTMLElement} element - The element to show.
 */
export const showElement = (element) => {
  element.classList.remove('d-none')
}

/**
 * Creates a DOM element with the specified tag, class names, and attributes.
 *
 * @param {string} tag The HTML tag name for the element.
 * @param {string[]} [classNames=[]] An array of class names to add to the element.
 * @param {object} [attributes={}] An object containing key-value pairs for attributes to add to the element.
 * @returns {HTMLElement} The created DOM element.
 */
export const createElement = (tag, classNames = [], attributes = {}) => {
  const element = document.createElement(tag)
  element.classList.add(...classNames)
  Object.keys(attributes).forEach((attr) => {
    if (attr === 'textContent') element.textContent = attributes[attr]
    element.setAttribute(attr, attributes[attr])
  })
  return element
}

/**
 * Validates an email address using a regular expression.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function validateEmail(email) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the email against the regular expression
  return emailRegex.test(email)
}

/**
 * Validates the length of a value.
 *
 * @param {*} value The value to validate.
 * @param {number} [length=3] The minimum length required.
 * @returns {boolean} True if the value is not empty and has a length greater than or equal to the provided length, false otherwise.
 */
export function validateLength(value, length = 3) {
  return value != '' && value.length >= length
}

/**
 * Checks if two values are equal.
 *
 * @param {*} value1 The first value to compare.
 * @param {*} value2 The second value to compare.
 * @returns {boolean} True if the values are equal, false otherwise.
 */
export function equal(value1, value2) {
  return value1 === value2
}
 

/**
 * Validates user signup form and returns an object containing functions and data if successful,
 * or `false` if validation fails.
 *
 * @returns {object|boolean} An object containing functions and data if validation succeeds,
 *                          or `false` if validation fails.
 *
 */
export function signupValidation() {
  const signupForm = document.getElementById('signup-form')
  const successMsg = document.getElementById('success-msg')
  const errorMsg = document.getElementById('error-msg')
  const error = document.getElementById('error')
  //get the helpers
  const emailHelper = document.getElementById('email-helper')
  const passwordHelper = document.getElementById('password-helper')
  const cpasswordHelper = document.getElementById('cpassword-helper')
  const loader = document.getElementById('loader')
  //create a form data object to capture user input
  const formData = new FormData(signupForm)
  const email = formData.get('email')
  const password = formData.get('password')
  const cpassword = formData.get('cpassword')
  let errors = {
    email: false,
    password: false,
    cpassword: false,
  }
  const showErrorMsg = (message) => {
    hideSuccessMsg()
    loader.classList.add('d-none')
    errorMsg.innerHTML = message
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
    successMsg.classList.remove('d-none')
  }
  const hideSuccessMsg = () => {
    successMsg.classList.add('d-none')
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
    passwordHelper.textContent = 'Password length must be 8 or more characters'
  } else {
    errors['password'] = false
    passwordHelper.textContent = null
  }

  if (!equal(cpassword, password)) {
    errors['cpassword'] = true
    cpasswordHelper.textContent = 'Password should match'
  } else {
    errors['cpassword'] = false
    cpasswordHelper.textContent = null
  }

  //check if no errors have been raised
  if (!errors['email'] && !errors['password'] && !errors['cpassword']) {
    //return the data from the form
    //return a function to clear the form when submission is done
    return {
      loader,
      success,
      user: { email, password },
      showErrorMsg,
      hideErrorMsg,
    }
  } else {
    return false
  }
}
