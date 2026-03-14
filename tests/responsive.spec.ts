import { test, expect } from '@playwright/test'

test.describe('Responsive viewport tests', () => {
  test('renders at 320x568 without horizontal scrollbar', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 320, height: 568 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(hasHorizontalScroll).toBe(false)

    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    await context.close()
  })

  test('renders at 2560x1440 without layout issues', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 2560, height: 1440 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Content should be within viewport bounds
    const box = await h1.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(2560)

    await context.close()
  })

  test('content is visible at both viewports', async ({ browser }) => {
    for (const vp of [
      { width: 320, height: 568 },
      { width: 2560, height: 1440 },
    ]) {
      const context = await browser.newContext({ viewport: vp })
      const page = await context.newPage()
      await page.goto('/')

      const main = page.locator('main')
      await expect(main).toBeVisible()

      const description = page.locator('p')
      await expect(description.first()).toBeVisible()

      await context.close()
    }
  })
})
