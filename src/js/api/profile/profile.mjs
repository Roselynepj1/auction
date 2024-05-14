import { PROFILE_URL } from '../../contants.mjs'
import { headers } from '../../headers.mjs'

export async function getCredits(username) {
  const response = await fetch(`${PROFILE_URL}/${username}/credits`, {
    method: 'get',
    headers: headers('application/json'),
  })

  if (response.ok) {
    const credits = await response.json()
    return credits
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function getProfile(username,_listings=true) {
  const response = await fetch(`${PROFILE_URL}/${username}?_listings=${_listings}`, {
    method: 'get',
    headers: headers('application/json'),
  })

  if (response.ok) {
    const profile = await response.json()
    return profile
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function getProfiles() {
  const response = await fetch(`${PROFILE_URL}`, {
    method: 'get',
    headers: headers('application/json'),
  })

  if (response.ok) {
    const profiles = await response.json()
    return profiles
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function getProfileListings(username) {
  const response = await fetch(`${PROFILE_URL}/${username}/listings`, {
    method: 'get',
    headers: headers('application/json'),
  })

  if (response.ok) {
    const listings = await response.json()
    return listings
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function getProfileBids(username) {
  const response = await fetch(`${PROFILE_URL}/${username}/bids`, {
    method: 'get',
    headers: headers('application/json'),
  })

  if (response.ok) {
    const bids = await response.json()
    return bids
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function updateProfileMedia(username, media) {
  const response = await fetch(`${PROFILE_URL}/${username}/media`, {
    method: 'put',
    body: JSON.stringify({ media }),
    headers: headers('application/json'),
  })

  if (response.ok) {
    const profile = await response.json()
    return profile
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}
