import { isLoggedIn, profile } from './src/js/api/auth/state.mjs'
import { remove } from './src/js/storage/remove.mjs'
import { showElement, hideElement } from './src/js/utilities.mjs'

document.addEventListener('DOMContentLoaded', () => {
  //Remove the loading animation
  document.querySelector('.loader').style.display = 'none'

  //All global items here
  const showMenuIcon = document.getElementById('show-menu')
  const hideMenuIcon = document.getElementById('hide-menu')
  const mobileMenu = document.querySelector('.mobile-menu')

  showMenuIcon.addEventListener('click', () => {
    showElement(mobileMenu)
    showElement(hideMenuIcon)
    hideElement(showMenuIcon)
  })
  hideMenuIcon.addEventListener('click', () => {
    hideElement(mobileMenu)
    hideElement(hideMenuIcon)
    showElement(showMenuIcon)
  })

  //Submit forms
  const searchForm = document.getElementById('search-form')
  const searchIcon = document.getElementById('search-icon')
  const searchFormMobile = document.getElementById('search-form-mobile')
  const searchIconMobile = document.getElementById('search-icon-mobile')

  searchIcon.addEventListener('click', () => {
    if (searchForm.checkValidity()) searchForm.submit()
    else
      searchForm
        .querySelector('input[name = "search"]')
        .classList.add('invalid-input')
  })
  searchIconMobile.addEventListener('click', () => {
    if (searchFormMobile.checkValidity()) searchFormMobile.submit()
    else
      searchFormMobile
        .querySelector('input[name = "search"]')
        .classList.add('invalid-input')
  })

  //check if user is logged in

  if (isLoggedIn()) {
    const user = document.getElementById('user')
    const { name, avatar, credits } = profile()
    document
      .getElementById('user-avatar')
      .setAttribute('src', avatar || 'https://picsum.photos/300')
    document.getElementById('username').textContent = name

    document
      .getElementById('user-profile')
      .setAttribute('href', `/pages/profile.html?name=${name}`)
    document
      .getElementById('user-avatar-link')
      .setAttribute('href', `/pages/change-avatar.html?name=${name}`)
    const loginButtons = document.querySelectorAll('.login-link')

    loginButtons.forEach((element) => {
      hideElement(element)
    })
    document.getElementById('user-credits').textContent = `${credits} credits`

    //show user
    showElement(user)

    //Add logout unction
    document.getElementById('logout').addEventListener('click', (event) => {
      event.preventDefault()
      const res = confirm('Are you sure you want to logout')

      if (res) {
        remove('token')
        remove('profile')
        window.location.href = '/pages/login.html'
      }
    })
  }

  //detect if user credits have been updated
  function handleProfileChange(event) {
    document.getElementById('user-credits').textContent = `${event.detail.credits} credits` 
    document
      .getElementById('user-avatar')
      .setAttribute('src', event.detail.avatar || 'https://picsum.photos/300')
  } 

  // Add event listener for changes in user data
  window.addEventListener('userDataChange', handleProfileChange)
})
