import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Cache posts list for 60 seconds
const getCachedPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        status: true,
        headerImage: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        status: 'PUBLISHED'
      },
      orderBy: { updatedAt: 'desc' }
    })
  },
  ['posts-list'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['posts']
  }
)

export async function GET() {
  try {
    const posts = await getCachedPosts()
    
    // Convert Date objects to strings for JSON serialization
    const serializedPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
    
    const response = NextResponse.json(serializedPosts)
    
    // Set cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    
    return response
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, status, headerImage, thumbnail } = await request.json()
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title: title || '',
        content: content || '',
        excerpt: excerpt || '',
        status: status || 'DRAFT',
        headerImage: headerImage || null,
        thumbnail: thumbnail || null,
      }
    })
    
    // Convert Date objects to strings
    const serializedPost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
    
    return NextResponse.json(serializedPost, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}