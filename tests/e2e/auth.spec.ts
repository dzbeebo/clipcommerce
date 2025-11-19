import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/ClippingMarket/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup')
    
    await expect(page).toHaveTitle(/ClippingMarket/)
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await expect(page.getByText(/creator/i)).toBeVisible()
    await expect(page.getByText(/clipper/i)).toBeVisible()
  })

  test('should navigate to creator signup', async ({ page }) => {
    await page.goto('/signup')
    
    await page.getByText(/creator/i).click()
    await page.getByRole('button', { name: /continue/i }).click()
    
    await expect(page).toHaveURL(/\/signup\/creator/)
    await expect(page.getByRole('heading', { name: /creator account/i })).toBeVisible()
  })

  test('should navigate to clipper signup', async ({ page }) => {
    await page.goto('/signup')
    
    await page.getByText(/clipper/i).click()
    await page.getByRole('button', { name: /continue/i }).click()
    
    await expect(page).toHaveURL(/\/signup\/clipper/)
    await expect(page.getByRole('heading', { name: /clipper account/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Check for validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })
})
