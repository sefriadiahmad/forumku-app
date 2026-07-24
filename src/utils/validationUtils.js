// Validation utilities - placeholder
// TODO: Implement validation functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  return { valid: true, message: '' }
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export const validateName = (name) => {
  if (name.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' }
  }
  return { valid: true, message: '' }
}
