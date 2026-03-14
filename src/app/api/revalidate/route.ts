import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-contentful-webhook-secret')
  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Contentful webhook payload has sys.contentType.sys.id for entry changes
    const contentTypeId = body?.sys?.contentType?.sys?.id

    if (contentTypeId) {
      revalidateTag(contentTypeId)
      return NextResponse.json({
        revalidated: true,
        contentType: contentTypeId,
        now: Date.now(),
      })
    }

    // For asset changes, revalidate the asset tag
    if (body?.sys?.type === 'Asset') {
      revalidateTag('contentful-asset')
      return NextResponse.json({
        revalidated: true,
        tag: 'contentful-asset',
        now: Date.now(),
      })
    }

    return NextResponse.json({ revalidated: false, message: 'No content type found' })
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
