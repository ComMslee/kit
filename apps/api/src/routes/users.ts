import { Hono } from 'hono'
import { authMiddleware, type AuthEnv } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const users = new Hono<AuthEnv>()

users.use('/*', authMiddleware)

// GET /users/me — 인증된 사용자 프로필 반환
users.get('/me', async (c) => {
  const { sub } = c.get('user')

  const user = await prisma.user.findUnique({
    where: { id: sub },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404)
  }

  return c.json({ success: true, data: user })
})

export default users
