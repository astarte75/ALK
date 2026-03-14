import { test, expect } from '@playwright/test'

test.describe('Locale routing tests', () => {
  test('GET / with Italian browser returns 200 and contains Italian text', async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: 'it-IT' })
    const page = await context.newPage()

    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    await context.close()
  })

  test('GET /en returns 200 and contains English text', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('/ and /en both serve the site correctly', async ({ browser }) => {
    const itContext = await browser.newContext({ locale: 'it-IT' })
    const itPage = await itContext.newPage()
    await itPage.goto('/')
    await expect(itPage.locator('h1')).toBeVisible()
    await itContext.close()

    const enContext = await browser.newContext({ locale: 'en-US' })
    const enPage = await enContext.newPage()
    await enPage.goto('/en')
    await expect(enPage.locator('h1')).toBeVisible()
    await enContext.close()
  })
})
