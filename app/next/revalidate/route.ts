import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { collectionTag, docTag, globalTag } from '@/app/_utilities/fetchPayload'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expected = process.env.REVALIDATION_KEY

  if (!expected || secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const global = request.nextUrl.searchParams.get('global')
  const collection = request.nextUrl.searchParams.get('collection')
  const slug = request.nextUrl.searchParams.get('slug')

  const revalidated: string[] = []

  if (global) {
    const tag = globalTag(global)
    revalidateTag(tag, 'max')
    revalidated.push(tag)
  } else if (collection) {
    const colTag = collectionTag(collection)
    revalidateTag(colTag, 'max')
    revalidated.push(colTag)

    if (slug) {
      const dTag = docTag(collection, slug)
      revalidateTag(dTag, 'max')
      revalidated.push(dTag)
    }
  } else {
    return NextResponse.json({ message: 'Missing collection or global parameter' }, { status: 400 })
  }

  return NextResponse.json({
    revalidated: true,
    tags: revalidated,
    now: Date.now(),
  })
}
