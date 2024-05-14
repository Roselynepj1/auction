import { load } from '../../storage/load.mjs'
import { save } from '../../storage/save.mjs'

export const isLoggedIn = () => Boolean(load('token'))

export const profile = () => load('profile')

export const updateLoggedInUser = (key, value) => {
  const loggedInUser = profile()
  if (!loggedInUser) return false

  loggedInUser[key] = value
  save('profile', loggedInUser)
  // Dispatch a custom event to notify other parts of the application
  const userDataChangeEvent = new CustomEvent('userDataChange', {
    detail: loggedInUser,
  })
  window.dispatchEvent(userDataChangeEvent)
  return true
}
