import { test, expect } from '@playwright/test'

test.describe('SSR and hydration smoke tests', () => {
  test('page loads and returns 200', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('no hydration mismatch errors in console', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hydrationErrors = errors.filter(
      (e) =>
        e.toLowerCase().includes('hydration') ||
        e.toLowerCase().includes('classname did not match') ||
        e.toLowerCase().includes('did not match')
    )
    expect(hydrationErrors).toHaveLength(0)
  })

  test('page source contains styled-components classes (SSR injection)', async ({
    page,
  }) => {
    const response = await page.goto('/')
    const html = await response?.text()
    // styled-components injects <style> tags with sc- prefixed class names
    expect(html).toMatch(/sc-[a-zA-Z]/)
  })
})
