import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const prismaClientSingleton = () => {
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  let url = rawUrl
  if (url.startsWith('file:')) {
    const relativePath = url.slice(5) // Remove "file:"
    if (!path.isAbsolute(relativePath)) {
      const absolutePath = path.resolve(process.cwd(), relativePath)
      url = `file:${absolutePath}`
    }
  }
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
