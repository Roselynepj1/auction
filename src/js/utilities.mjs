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
 * Validates a URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
export function isValidUrl(url) {
  // Regular expression for URL validation
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

  // Test the URL against the regular expression
  return urlRegex.test(url.trim())
}

/**
 * Get the value of a parameter from the URL.
 * @param {string} paramName - The name of the parameter to retrieve.
 * @returns {string|null} The value of the parameter, or null if the parameter is not found.
 */
export function getUrlParam(paramName) {
  // Get the current URL
  const url = window.location.href

  // Create a URLSearchParams object with the URL query parameters
  const params = new URLSearchParams(new URL(url).search)

  // Get the value of the specified parameter
  const paramValue = params.get(paramName)

  return paramValue
}

/**
 * Validates whether a value in an HTML datetime-local input field represents a valid date and time.
 * @param {string} datetimeValue - The value of the datetime-local input field.
 * @returns {boolean} True if the value represents a valid date and time, false otherwise.
 */
export function isValidDateTime(datetimeValue) {
  // Check if the input value matches the format of datetime-local input type
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
  return dateTimeRegex.test(datetimeValue)
}

/**
 * Converts a date string to a more readable format.
 * @param {string} dateString - The date string in ISO 8601 format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString) {
  const date = new Date(dateString)

  // Format the date part (e.g., "25 May 2024")
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-US', options)

  // Format the time part (e.g., "11:23 PM")
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions)

  return `${formattedDate}, ${formattedTime}`
}

/**
 * Calculates the remaining time from the current time until the end date.
 * @param {string} endDate - The end date in ISO 8601 format.
 * @returns {object} An object containing the remaining time values (days, hours, minutes, seconds).
 */
export function calculateTimeRemaining(endDate) {
  const currentTime = new Date()
  const endTime = new Date(endDate)

  // Check if the current time is past the end time
  if (currentTime > endTime) {
    // Auction has ended, return null or handle accordingly
    return null
  }

  let timeDifference = endTime - currentTime

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Updates the countdown timer every second.
 * @param {string} endDate - The end date in ISO 8601 format.
 * @param {HTMLElement} dayElement - The HTML element to display remaining days.
 * @param {HTMLElement} hourElement - The HTML element to display remaining hours.
 * @param {HTMLElement} minElement - The HTML element to display remaining minutes.
 * @param {HTMLElement} secElement - The HTML element to display remaining seconds.
 */
export function updateCountdownTimer(
  endDate,
  dayElement,
  hourElement,
  minElement,
  secElement,
) {
  const timerInterval = setInterval(() => {
    const { days, hours, minutes, seconds } = calculateTimeRemaining(endDate)

    dayElement.textContent = days < 10 ? '0' + days : days
    hourElement.textContent = hours < 10 ? '0' + hours : hours
    minElement.textContent = minutes < 10 ? '0' + minutes : minutes
    secElement.textContent = seconds < 10 ? '0' + seconds : seconds

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(timerInterval)
      // Optionally, perform any action when the countdown timer reaches zero
    }
  }, 1000)
}
