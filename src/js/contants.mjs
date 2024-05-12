/**
 * Base URL for the API.
 * @type {string}
 */
export const BASE_URL = 'https://api.noroff.dev'

/**
 * API version used.
 * @type {string}
 */
export const API_VERSION = 'api/v1'

/**
 * Full URL for the social API.
 * @type {string}
 */
export const API_URL = `${BASE_URL}/${API_VERSION}/auction`

/**
 * URL for accessing auction listings.
 * @type {string}
 */
export const LISTINGS_URL = `${API_URL}/listings`

/**
 * URL for accessing auction auth login.
 * @type {string}
 */
export const AUTH_LOGIN_URL = `${API_URL}/auth/login`

/**
 * URL for accessing auction auth login.
 * @type {string}
 */
export const AUTH_REGISTER_URL = `${API_URL}/auth/register`

/**
 * URL for accessing user profiles.
 * @type {string}
 */
export const PROFILE_URL = `${API_URL}/profiles`
