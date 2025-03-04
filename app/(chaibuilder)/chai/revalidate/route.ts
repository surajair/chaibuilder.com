import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const revalidateRoute = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CHAI_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const tags = req.nextUrl.searchParams.get('tags') || ''
  const paths = req.nextUrl.searchParams.get('paths') || ''

  try {
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',')
    await Promise.all(tagsArray.map((tag) => revalidateTag(tag)))

    const pathsArray = Array.isArray(paths) ? paths : paths.split(',')
    await Promise.all(pathsArray.map((path) => revalidatePath(path)))

    return NextResponse.json(
      { message: 'Tags and paths revalidated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to revalidate tags and paths' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return revalidateRoute(req)
}
