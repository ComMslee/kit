import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma v7 — @prisma/adapter-pg 사용 (Node.js 전용)
 * 싱글턴 패턴으로 개발 중 HMR 시 중복 생성 방지
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

// Prisma 생성 타입 재export (apps에서 직접 import 불필요)
export type { User, Account, Session, VerificationToken, Role } from '@prisma/client'
export { PrismaClient } from '@prisma/client'
