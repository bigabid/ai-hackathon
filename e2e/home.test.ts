import { test, expect } from '@playwright/test'

test('home page shows welcome message', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible()
})
