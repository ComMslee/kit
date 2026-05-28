import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma v7 — @prisma/adapter-pg 사용 (Node.js 전용)
 * DB 미연결 시 쿼리 단에서 에러 발생 (생성자는 성공)
 * 각 페이지에서 try/catch로 graceful fallback 처리
 */
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL ?? ''
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
