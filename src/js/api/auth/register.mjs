import { AUTH_REGISTER_URL } from '../../contants.mjs'
import { headers } from '../../headers.mjs'

export async function register(name, email, password, avatar) {
  const response = await fetch(`${AUTH_REGISTER_URL}`, {
    method: 'post',
    body: JSON.stringify({ name, email, password, avatar }),
    headers: headers('application/json'),
  })

  if (response.ok) {
    return await response.json()
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}
