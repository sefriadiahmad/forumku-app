// API Service - Base API configuration with interceptors
// ForumKu API Service Layer

import { getAuthToken } from '../utils/storageUtils'

// ==================== CONFIGURATION ====================

const API_BASE_URL = import.meta.env.VITE_API_URL
const REQUEST_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 30000

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, 0)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out') {
    super(message, 408)
    this.name = 'TimeoutError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

// ==================== URL HELPER ====================

const buildUrl = (endpoint, params = {}) => {
  let baseUrl = endpoint
  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    baseUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  }
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

// ==================== REQUEST HEADERS ====================

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// ==================== FETCH WITH TIMEOUT ====================

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

// ==================== PROCESS RESPONSE ====================

const processResponse = async (response) => {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    let message = 'An error occurred'
    let errorData = data

    if (data && typeof data === 'object') {
      message = data.message || data.error || data.msg || message
      errorData = data.errors || data
    }

    switch (response.status) {
      case 400:
        throw new ApiError(data.errors?.[0]?.msg || 'Invalid request', 400, errorData)
      case 401:
        // Don't auto-remove token here - let authSlice handle logout
        throw new UnauthorizedError(message)
      case 403:
        throw new ApiError('Access forbidden', 403, errorData)
      case 404:
        throw new ApiError('Resource not found', 404, errorData)
      case 422:
        throw new ApiError(
          data.errors?.map((e) => e.msg).join(', ') || 'Validation error',
          422,
          errorData
        )
      case 429:
        throw new ApiError('Too many requests. Please try again later.', 429, errorData)
      case 500:
        throw new ApiError('Server error. Please try again later.', 500, errorData)
      default:
        throw new ApiError(message, response.status, errorData)
    }
  }

  return data
}

// ==================== HTTP METHODS ====================

export const get = async (endpoint, params = {}) => {
  const url = buildUrl(endpoint, params)
  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: getHeaders(),
  })
  return processResponse(response)
}

export const post = async (endpoint, data = {}) => {
  const url = buildUrl(endpoint)
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return processResponse(response)
}

export const put = async (endpoint, data = {}) => {
  const url = buildUrl(endpoint)
  const response = await fetchWithTimeout(url, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return processResponse(response)
}

export const patch = async (endpoint, data = {}) => {
  const url = buildUrl(endpoint)
  const response = await fetchWithTimeout(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return processResponse(response)
}

export const del = async (endpoint) => {
  const url = buildUrl(endpoint)
  const response = await fetchWithTimeout(url, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return processResponse(response)
}

// ==================== API OBJECT ====================

export const api = {
  get,
  post,
  put,
  patch,
  del,
  delete: del,
  baseUrl: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  errors: {
    ApiError,
    NetworkError,
    TimeoutError,
    UnauthorizedError,
  },
}

export default api
