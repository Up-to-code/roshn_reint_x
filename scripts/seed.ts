const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create sample posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Getting Started with Next.js',
        content: '<h1>Welcome to Next.js</h1><p>This is a sample blog post about getting started with Next.js.</p>',
        excerpt: 'Learn how to get started with Next.js and build amazing web applications.',
        status: 'PUBLISHED',
      },
      {
        title: 'Advanced TypeScript Patterns',
        content: '<h2>TypeScript Patterns</h2><p>Exploring advanced TypeScript patterns and best practices.</p>',
        excerpt: 'Deep dive into advanced TypeScript patterns and best practices.',
        status: 'DRAFT',
      },
      {
        title: 'Building Modern Web Applications',
        content: '<h2>Modern Web Development</h2><p>Learn how to build modern web applications with the latest technologies.</p>',
        excerpt: 'A comprehensive guide to modern web development practices.',
        status: 'PUBLISHED',
      }
    ],
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })