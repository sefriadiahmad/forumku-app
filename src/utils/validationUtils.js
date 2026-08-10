// validationUtils.js - Form validation utilities
// ForumKu Utility Functions
import * as z from 'zod'

// ==================== ZOD SCHEMAS ====================

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Email tidak valid')

/**
 * Password validation schema
 * Minimum 8 characters, at least one letter and one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
  .regex(/[0-9]/, 'Password harus mengandung angka')

/**
 * Name validation schema
 * Minimum 2 characters, letters and spaces only
 */
export const nameSchema = z
  .string()
  .min(2, 'Nama minimal 2 karakter')
  .max(100, 'Nama maksimal 100 karakter')
  .regex(/^[A-Za-z\s']+$/, 'Nama hanya boleh mengandung huruf dan spasi')

/**
 * Thread title validation schema
 * Minimum 5 characters, maximum 200 characters
 */
export const threadTitleSchema = z
  .string()
  .min(5, 'Judul minimal 5 karakter')
  .max(200, 'Judul maksimal 200 karakter')

/**
 * Thread body validation schema
 * Minimum 10 characters
 */
export const threadBodySchema = z
  .string()
  .min(10, 'Konten minimal 10 karakter')

/**
 * Comment validation schema
 * Minimum 1 character
 */
export const commentSchema = z
  .string()
  .min(1, 'Komentar tidak boleh kosong')
  .max(10000, 'Komentar maksimal 10000 karakter')

/**
 * Full registration schema
 */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password harus diisi'),
})

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateName = (name) => {
  try {
    nameSchema.parse(name)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate thread title
 * @param {string} title - Title to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateThreadTitle = (title) => {
  try {
    threadTitleSchema.parse(title)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate thread body
 * @param {string} body - Body to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateThreadBody = (body) => {
  try {
    threadBodySchema.parse(body)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate comment
 * @param {string} comment - Comment to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateComment = (comment) => {
  try {
    commentSchema.parse(comment)
    return { valid: true, message: '' }
  } catch (error) {
    return { valid: false, message: error.errors[0].message }
  }
}

/**
 * Validate registration data
 * @param {Object} data - Registration data
 * @returns {{ valid: boolean, errors: Object }} Validation result
 */
export const validateRegistration = (data) => {
  try {
    registerSchema.parse(data)
    return { valid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.errors.forEach((err) => {
      const path = err.path.join('')
      errors[path] = err.message
    })
    return { valid: false, errors }
  }
}

/**
 * Validate login data
 * @param {Object} data - Login data
 * @returns {{ valid: boolean, errors: Object }} Validation result
 */
export const validateLogin = (data) => {
  try {
    loginSchema.parse(data)
    return { valid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.errors.forEach((err) => {
      const path = err.path.join('')
      errors[path] = err.message
    })
    return { valid: false, errors }
  }
}

/**
 * Check password strength level
 * @param {string} password - Password to check
 * @returns {number} Strength level (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0

  let strength = 0

  // Length checks
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Character type checks
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  // Cap at 4
  return Math.min(strength, 4)
}

/**
 * Get password strength label
 * @param {number} strength - Strength level (0-4)
 * @returns {string} Strength label
 */
export const getPasswordStrengthLabel = (strength) => {
  const labels = {
    0: 'Sangat Lemah',
    1: 'Lemah',
    2: 'Sedang',
    3: 'Kuat',
    4: 'Sangat Kuat',
  }
  return labels[strength] || labels[0]
}

/**
 * Get password strength color
 * @param {number} strength - Strength level (0-4)
 * @returns {string} Color class
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = {
    0: 'bg-error',
    1: 'bg-error',
    2: 'bg-warning',
    3: 'bg-success',
    4: 'bg-success',
  }
  return colors[strength] || colors[0]
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
