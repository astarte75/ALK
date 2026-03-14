import { test, expect } from '@playwright/test'

test.describe('ISR Revalidation Webhook', () => {
  const validSecret = process.env.CONTENTFUL_WEBHOOK_SECRET || 'alkemia-webhook-secret-maolink'

  test('POST with valid secret returns 200 and revalidated:true', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      headers: {
        'x-contentful-webhook-secret': validSecret,
        'content-type': 'application/json',
      },
      data: {
        sys: {
          type: 'Entry',
          contentType: { sys: { id: 'portfolioCompany' } },
        },
      },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.revalidated).toBe(true)
    expect(body.contentType).toBe('portfolioCompany')
  })

  test('POST with invalid secret returns 401', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      headers: {
        'x-contentful-webhook-secret': 'wrong-secret',
        'content-type': 'application/json',
      },
      data: { sys: { type: 'Entry' } },
    })
    expect(response.status()).toBe(401)
  })

  test('POST with Asset type revalidates contentful-asset tag', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      headers: {
        'x-contentful-webhook-secret': validSecret,
        'content-type': 'application/json',
      },
      data: {
        sys: { type: 'Asset' },
      },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.revalidated).toBe(true)
    expect(body.tag).toBe('contentful-asset')
  })

  test('GET returns 200 status ok', async ({ request }) => {
    const response = await request.get('/api/revalidate')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('ok')
  })
})
