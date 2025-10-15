import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = context.params
    
    const post = await prisma.post.findUnique({
      where: { id }
    })
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Convert Date objects to strings
    const serializedPost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
    
    return NextResponse.json(serializedPost)
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = context.params
    const { title, content, excerpt, status, headerImage, thumbnail } = await request.json()
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title || 'Untitled',
        content: content || '',
        excerpt: excerpt || '',
        status: status || 'DRAFT',
        headerImage: headerImage || null,
        thumbnail: thumbnail || null,
        updatedAt: new Date()
      }
    })
    
    // Convert Date objects to strings
    const serializedPost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
    
    return NextResponse.json(serializedPost)
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json(
      { error: 'Failed to update post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = context.params
    
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}