import { test, expect } from '@playwright/test'

test.describe('Dark theme verification', () => {
  test('body has dark background color #1A1E22', async ({ page }) => {
    await page.goto('/')
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    )
    // #1A1E22 = rgb(26, 30, 34)
    expect(bgColor).toBe('rgb(26, 30, 34)')
  })

  test(':root has --color-bg CSS custom property', async ({ page }) => {
    await page.goto('/')
    const colorBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg')
        .trim()
    )
    expect(colorBg).toBeTruthy()
  })

  test('text color matches #F9FAFB', async ({ page }) => {
    await page.goto('/')
    const textColor = await page.evaluate(() =>
      getComputedStyle(document.body).color
    )
    // #F9FAFB = rgb(249, 250, 251)
    expect(textColor).toBe('rgb(249, 250, 251)')
  })

  test('--color-accent-teal and --color-accent-gold are defined', async ({
    page,
  }) => {
    await page.goto('/')
    const teal = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent-teal')
        .trim()
    )
    const gold = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent-gold')
        .trim()
    )
    expect(teal).toBeTruthy()
    expect(gold).toBeTruthy()
  })
})
