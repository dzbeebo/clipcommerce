import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/dashboard')
    
    // Mock the auth state
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-token')
    })
  })

  test('should display creator dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page.getByRole('heading', { name: /creator dashboard/i })).toBeVisible()
    await expect(page.getByText(/welcome back/i)).toBeVisible()
    await expect(page.getByText(/total paid out/i)).toBeVisible()
    await expect(page.getByText(/active clippers/i)).toBeVisible()
    await expect(page.getByText(/pending submissions/i)).toBeVisible()
  })

  test('should display clipper dashboard', async ({ page }) => {
    await page.goto('/clipper')
    
    await expect(page.getByRole('heading', { name: /clipper dashboard/i })).toBeVisible()
    await expect(page.getByText(/welcome back/i)).toBeVisible()
    await expect(page.getByText(/total earned/i)).toBeVisible()
    await expect(page.getByText(/active submissions/i)).toBeVisible()
    await expect(page.getByText(/approved clips/i)).toBeVisible()
  })

  test('should toggle analytics view', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Analytics should be hidden by default
    await expect(page.getByText(/monthly payments/i)).not.toBeVisible()
    
    // Click analytics button
    await page.getByRole('button', { name: /show analytics/i }).click()
    
    // Analytics should now be visible
    await expect(page.getByText(/monthly payments/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /hide analytics/i })).toBeVisible()
  })

  test('should display notification center', async ({ page }) => {
    await page.goto('/dashboard')
    
    const notificationButton = page.getByRole('button', { name: /notifications/i })
    await expect(notificationButton).toBeVisible()
    
    // Click notification button
    await notificationButton.click()
    
    // Notification panel should be visible
    await expect(page.getByText(/notifications/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    
    // Check that mobile layout is applied
    await expect(page.getByRole('heading', { name: /creator dashboard/i })).toBeVisible()
    
    // Check that buttons are touch-friendly
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const box = await button.boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44) // Touch target size
      }
    }
  })

  test('should handle logout', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click logout button
    await page.getByRole('button', { name: /logout/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
  })
})
