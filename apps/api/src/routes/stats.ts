import { Hono } from 'hono'
import { authMiddleware, type AuthEnv } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import type { DashboardStats } from '@kit/types'

const stats = new Hono<AuthEnv>()

stats.use('/*', authMiddleware)

// GET /stats — 대시보드 통계 (도메인 모델 추가 시 실제 값으로 교체)
stats.get('/', async (c) => {
  const totalUsers = await prisma.user.count()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayVisitors = await prisma.session.count({
    where: { expires: { gte: todayStart } },
  })

  const data: DashboardStats = {
    totalUsers,
    todayVisitors,
    monthlyRevenue: 0,
    pendingItems: 0,
  }

  return c.json({ success: true, data })
})

export default stats
