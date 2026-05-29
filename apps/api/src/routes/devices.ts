import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware, type AuthEnv } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import type { Platform } from '@kit/types'

const devices = new Hono<AuthEnv>()

devices.use('/*', authMiddleware)

// POST /devices — 디바이스 토큰 등록 (upsert)
devices.post('/', async (c) => {
  const { sub } = c.get('user')
  const body = await c.req.json<{ token: string; platform: Platform; name?: string }>()

  if (!body.token || !body.platform) {
    throw new HTTPException(400, { message: 'token and platform are required' })
  }

  const device = await prisma.device.upsert({
    where: { token: body.token },
    update: { userId: sub, platform: body.platform, name: body.name, active: true },
    create: { userId: sub, token: body.token, platform: body.platform, name: body.name },
  })

  return c.json({ success: true, data: device })
})

// GET /devices — 내 활성 디바이스 목록
devices.get('/', async (c) => {
  const { sub } = c.get('user')

  const list = await prisma.device.findMany({
    where: { userId: sub, active: true },
    orderBy: { updatedAt: 'desc' },
  })

  return c.json({ success: true, data: list })
})

// DELETE /devices/:id — 디바이스 비활성화 (로그아웃·앱 제거 시)
devices.delete('/:id', async (c) => {
  const { sub } = c.get('user')
  const id = c.req.param('id')

  const device = await prisma.device.findUnique({ where: { id } })

  if (!device || device.userId !== sub) {
    throw new HTTPException(404, { message: 'Device not found' })
  }

  await prisma.device.update({ where: { id }, data: { active: false } })

  return c.json({ success: true })
})

export default devices
