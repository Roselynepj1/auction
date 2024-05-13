import { LISTINGS_URL } from '../../contants.mjs'
import { headers } from '../../headers.mjs'

export async function getListings({
  _bids = true,
  _seller = true,
  limit = 20,
  offset = 0,
  sortOrder = 'DESC',
} = {}) {
  const response = await fetch(
    `${LISTINGS_URL}?_bids=${_bids}&_seller=${_seller}&limit=${limit}&offset=${offset}&sortOrder=${sortOrder}`,
    {
      method: 'get',
      headers: headers('application/json'),
    },
  )

  if (response.ok) {
    const listing = await response.json()
    return listing
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function getListing(id, { _bids = true, _seller = true } = {}) {
  const response = await fetch(
    `${LISTINGS_URL}/${id}?_bids=${_bids}&_seller=${_seller}`,
    {
      method: 'get',
      headers: headers('application/json'),
    },
  )

  if (response.ok) {
    const listing = await response.json()
    return listing
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function addListing(listing) {
  const response = await fetch(`${LISTINGS_URL}`, {
    method: 'post',
    headers: headers('application/json'),
    body: JSON.stringify(listing),
  })

  if (response.ok) {
    const listing = await response.json()
    return listing
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function updateListing(id, listing) {
  const response = await fetch(`${LISTINGS_URL}/${id}`, {
    method: 'put',
    headers: headers('application/json'),
    body: JSON.stringify(listing),
  })

  if (response.ok) {
    const listing = await response.json()
    return listing
  } else {
    // Handle error response
    const errorResponse = await response.json()
    throw new Error(errorResponse.errors[0].message || response.statusText)
  }
}

export async function deleteListing(id) {
  const response = await fetch(`${LISTINGS_URL}/${id}`, {
    method: 'delete',
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
