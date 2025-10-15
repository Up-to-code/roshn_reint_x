import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      users,
      properties,
      posts,
      contacts
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.property.findMany(),
      prisma.post.findMany(),
      prisma.contact.findMany()
    ])

    return NextResponse.json({
      users,
      properties,
      posts,
      contacts
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}