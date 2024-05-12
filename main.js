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
})
