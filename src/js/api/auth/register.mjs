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
  }

  throw new Error(response.statusText)
}
