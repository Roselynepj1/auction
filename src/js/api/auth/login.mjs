import { AUTH_LOGIN_URL } from '../../contants.mjs'
import { headers } from '../../headers.mjs'
import { save } from '../../storage/save.mjs'

export async function login(email, password) {
  const response = await fetch(`${AUTH_LOGIN_URL}`, {
    method: 'post',
    body: JSON.stringify({ email, password }),
    headers: headers('application/json'),
  })

  if (response.ok) {
    const profile = await response.json()
    save('token', profile.accessToken)
    delete profile.accessToken
    save('profile', profile)
    return profile
  } else {
    // Handle error response
    const errorResponse = await response.json()    
    throw new Error(errorResponse.errors[0].message || response.statusText)  
  }
}
