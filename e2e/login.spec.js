/**
 * e2e/login.spec.js - E2E Tests for Login Flow
 *
 * Skenario Pengujian End-to-End untuk Login Flow
 */

import { test, expect } from '@playwright/test'

test.describe('Login Flow - E2E Tests', () => {

  /**
   * Skenario: Halaman login dimuat dengan benar
   * Saat: User membuka halaman /login
   * Hasil: Form login tampil dengan elemen yang diperlukan
   */
  test('should display login form elements', async ({ page }) => {
    await page.goto('/login')

    // Check email input
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible()

    // Check password input
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible()

    // Check submit button
    await expect(page.getByRole('button', { name: /masuk/i })).toBeVisible()
  })

  /**
   * Skenario: Navigasi ke halaman registrasi
   * Saat: User mengklik link "Daftar sekarang"
   * Hasil: User diarahkan ke halaman /register
   */
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: /daftar sekarang/i }).click()

    await expect(page).toHaveURL(/\/register/)
  })

  /**
   * Skenario: Navigasi ke halaman lupa password
   * Saat: User mengklik link "Lupa password?"
   * Hasil: User diarahkan ke halaman /forgot-password
   */
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: /lupa password/i }).click()

    await expect(page).toHaveURL(/\/forgot-password/)
  })

  /**
   * Skenario: User dapat mengisi form email dan password
   * Saat: User memasukkan email dan password
   * Hasil: Input tersimpan dengan benar
   */
  test('should accept form input', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByPlaceholder(/you@example.com/i)
    const passwordInput = page.getByPlaceholder(/••••••••/i)

    await emailInput.fill('user@example.com')
    await passwordInput.fill('password123')

    await expect(emailInput).toHaveValue('user@example.com')
    await expect(passwordInput).toHaveValue('password123')
  })

  /**
   * Skenario: User dapat membersihkan input
   * Saat: User mengisi form lalu membersihkannya
   * Hasil: Input menjadi kosong
   */
  test('should allow clearing form inputs', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByPlaceholder(/you@example.com/i)

    await emailInput.fill('test@example.com')
    expect(await emailInput.inputValue()).toBe('test@example.com')

    await emailInput.clear()
    expect(await emailInput.inputValue()).toBe('')
  })

  /**
   * Skenario: Checkbox "Ingat saya" dapat dicentang
   * Saat: User mengklik checkbox "Ingat saya"
   * Hasil: Checkbox tercentang
   */
  test('should toggle remember me checkbox', async ({ page }) => {
    await page.goto('/login')

    const checkbox = page.getByRole('checkbox', { name: /ingat saya/i })

    // Initially unchecked
    await expect(checkbox).not.toBeChecked()

    // Click to check
    await checkbox.check()
    await expect(checkbox).toBeChecked()

    // Click to uncheck
    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()
  })

  /**
   * Skenario: Submit button visible dan enabled
   * Saat: Halaman login dimuat
   * Hasil: Button "Masuk" terlihat dan aktif
   */
  test('should have enabled submit button', async ({ page }) => {
    await page.goto('/login')

    const submitButton = page.getByRole('button', { name: /masuk/i })

    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  /**
   * Skenario: Password toggle berfungsi
   * Saat: User mengklik tombol toggle password
   * Hasil: Password field berubah type
   */
  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.getByPlaceholder(/••••••••/i)

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle button (has Show password aria-label)
    await page.getByRole('button', { name: /show password/i }).click()

    // Now text type
    await expect(passwordInput).toHaveAttribute('type', 'text')
  })

  /**
   * Skenario: Toggle password dari text ke password
   * Saat: Password terlihat, lalu toggle diklik lagi
   * Hasil: Password tersembunyi lagi
   */
  test('should hide password after toggle off', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.getByPlaceholder(/••••••••/i)

    // Show password
    await page.getByRole('button', { name: /show password/i }).click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Hide password (button label changes to Hide password)
    await page.getByRole('button', { name: /hide password/i }).click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  /**
   * Skenario: Form tidak crash saat submit
   * Saat: User mengisi form dan submit
   * Hasil: Tidak ada crash pada halaman
   */
  test('should handle form submission without crash', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder(/you@example.com/i).fill('user@test.com')
    await page.getByPlaceholder(/••••••••/i).fill('password123')
    await page.getByRole('button', { name: /masuk/i }).click()

    // Page should still be visible (not crashed)
    await expect(page.locator('body')).toBeVisible()
  })

  /**
   * Skenario: Navigasi kembali ke login dari register
   * Saat: User di halaman register, klik link login
   * Hasil: User kembali ke halaman login
   */
  test('should navigate back to login from register', async ({ page }) => {
    await page.goto('/register')

    // Find and click login link on register page
    await page.getByRole('link', { name: /masuk/i }).click()

    await expect(page).toHaveURL(/\/login/)
  })

  /**
   * Skenario: Page login accessible
   * Saat: User membuka /login
   * Hasil: Page ter-load dengan benar tanpa error
   */
  test('should load login page without errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error))

    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Should have no page errors
    expect(errors.length).toBe(0)
  })

  /**
   * Skenario: Email input dapat menerima keyboard input
   * Saat: User mengetik di email field
   * Hasil: Karakter tampil di input
   */
  test('should accept keyboard input in email field', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByPlaceholder(/you@example.com/i)

    // Focus and type
    await emailInput.focus()
    await page.keyboard.type('test@email.com')

    await expect(emailInput).toHaveValue('test@email.com')
  })

  /**
   * Skenario: Password input dapat menerima keyboard input
   * Saat: User mengetik di password field
   * Hasil: Karakter tampil di input
   */
  test('should accept keyboard input in password field', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.getByPlaceholder(/••••••••/i)

    // Focus and type
    await passwordInput.focus()
    await page.keyboard.type('secretpass')

    await expect(passwordInput).toHaveValue('secretpass')
  })
})
