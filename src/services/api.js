// API Service - Base API configuration with interceptors
// ForumKu API Service Layer

import { getAuthToken, removeAuthToken } from '../utils/storageUtils'

// ==================== CONFIGURATION ====================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.forumku.example.com'
const REQUEST_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000 // 30 seconds

// ==================== ERROR CLASSES ====================

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Network Error
 */
export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, 0)
    this.name = 'NetworkError'
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out') {
    super(message, 408)
    this.name = 'TimeoutError'
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

// ==================== REQUEST INTERCEPTORS ====================

/**
 * Process request before sending
 * @param {Request} request - Fetch request object
 * @returns {Request} Processed request
 */
const processRequest = (request) => {
  // Add auth token if available
  const token = getAuthToken()
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }

  // Add default headers
  request.headers.set('Content-Type', 'application/json')
  request.headers.set('Accept', 'application/json')
  request.headers.set('X-Requested-With', 'XMLHttpRequest')

  // Add timestamp for cache busting on GET requests
  if (request.method === 'GET') {
    const url = new URL(request.url)
    url.searchParams.set('_t', Date.now())
    request.url = url.toString()
  }

  return request
}

// ==================== RESPONSE INTERCEPTORS ====================

/**
 * Process successful response
 * @param {Response} response - Fetch response object
 * @param {Object} requestData - Original request data
 * @returns {Promise<Object>} Parsed response data
 */
const processResponse = async (response, _requestData = {}) => {
  // Parse response
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  // Check for API error response
  if (!response.ok) {
    throw createApiError(response.status, data)
  }

  return data
}

/**
 * Process error response
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data
 * @returns {ApiError} Appropriate error type
 */
const createApiError = (status, data) => {
  let message = 'An error occurred'
  let errorData = data

  if (data && typeof data === 'object') {
    message = data.message || data.error || data.msg || message
    errorData = data.errors || data
  }

  // Handle specific status codes
  switch (status) {
    case 400:
      return new ApiError(
        data.errors?.[0]?.msg || 'Invalid request',
        status,
        errorData
      )
    case 401:
      // Clear auth token on unauthorized
      removeAuthToken()
      return new UnauthorizedError(message)
    case 403:
      return new ApiError('Access forbidden', status, errorData)
    case 404:
      return new ApiError('Resource not found', status, errorData)
    case 422:
      return new ApiError(
        data.errors?.map((e) => e.msg).join(', ') || 'Validation error',
        status,
        errorData
      )
    case 429:
      return new ApiError('Too many requests. Please try again later.', status, errorData)
    case 500:
      return new ApiError('Server error. Please try again later.', status, errorData)
    default:
      return new ApiError(message, status, errorData)
  }
}

// ==================== REQUEST HANDLER ====================

/**
 * Execute fetch with timeout
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 */
const fetchWithTimeout = async (url, options, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeout}ms`)
    }
    throw new NetworkError(error.message || 'Network error')
  }
}

// ==================== HTTP METHODS ====================

/**
 * Make GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const get = async (endpoint, params = {}, options = {}) => {
  const url = new URL(endpoint, API_BASE_URL).toString()
  const finalUrl = params && Object.keys(params).length > 0
    ? `${url}?${new URLSearchParams(params).toString()}`
    : url

  const request = new Request(finalUrl, {
    method: 'GET',
    ...options,
  })

  const processedRequest = processRequest(request)
  const response = await fetchWithTimeout(processedRequest.url, processedRequest)

  return processResponse(response, { method: 'GET', endpoint, params })
}

/**
 * Make POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const post = async (endpoint, data = {}, options = {}) => {
  const url = new URL(endpoint, API_BASE_URL).toString()

  const request = new Request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  })

  const processedRequest = processRequest(request)
  const response = await fetchWithTimeout(processedRequest.url, processedRequest)

  return processResponse(response, { method: 'POST', endpoint, data })
}

/**
 * Make PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const put = async (endpoint, data = {}, options = {}) => {
  const url = new URL(endpoint, API_BASE_URL).toString()

  const request = new Request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  })

  const processedRequest = processRequest(request)
  const response = await fetchWithTimeout(processedRequest.url, processedRequest)

  return processResponse(response, { method: 'PUT', endpoint, data })
}

/**
 * Make PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const patch = async (endpoint, data = {}, options = {}) => {
  const url = new URL(endpoint, API_BASE_URL).toString()

  const request = new Request(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  })

  const processedRequest = processRequest(request)
  const response = await fetchWithTimeout(processedRequest.url, processedRequest)

  return processResponse(response, { method: 'PATCH', endpoint, data })
}

/**
 * Make DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const del = async (endpoint, options = {}) => {
  const url = new URL(endpoint, API_BASE_URL).toString()

  const request = new Request(url, {
    method: 'DELETE',
    ...options,
  })

  const processedRequest = processRequest(request)
  const response = await fetchWithTimeout(processedRequest.url, processedRequest)

  return processResponse(response, { method: 'DELETE', endpoint })
}

// ==================== API SERVICE OBJECT ====================

/**
 * API Service with all HTTP methods
 */
export const api = {
  get,
  post,
  put,
  patch,
  del,
  delete: del, // Alias

  // Config
  baseUrl: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,

  // Error classes for type checking
  errors: {
    ApiError,
    NetworkError,
    TimeoutError,
    UnauthorizedError,
  },
}

export default api
