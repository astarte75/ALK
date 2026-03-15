import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch document metadata (RLS filters to owner)
  const { data: doc, error } = await supabase
    .from('investor_documents')
    .select('storage_path, title')
    .eq('id', id)
    .single()

  if (error || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Generate signed URL (60 second expiry)
  const { data: signedData, error: signError } = await supabase.storage
    .from('investor-documents')
    .createSignedUrl(doc.storage_path, 60)

  if (signError || !signedData?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }

  return NextResponse.redirect(signedData.signedUrl)
}
