import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { prisma } from '../lib/prisma'
import type { Prisma } from '@prisma/client'
import type { LogLevel, ClientLogEntry } from '@kit/types'

const VALID_LEVELS: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR']

// /logs — 클라이언트 로그 수신
// 인증 불필요 — 비로그인 상태(앱 크래시, 로그인 전 에러)도 전송 가능
const logs = new Hono()

// POST /logs — 단건
logs.post('/', async (c) => {
  const body = await c.req.json<ClientLogEntry>()

  if (!body.level || !VALID_LEVELS.includes(body.level)) {
    throw new HTTPException(400, { message: `level must be one of: ${VALID_LEVELS.join(', ')}` })
  }
  if (!body.message) {
    throw new HTTPException(400, { message: 'message is required' })
  }

  await prisma.clientLog.create({
    data: {
      level: body.level,
      message: body.message,
      context: body.context as Prisma.InputJsonValue | undefined,
      platform: body.platform,
      appVersion: body.appVersion,
      userId: body.userId ?? null,
    },
  })

  return c.json({ success: true })
})

// POST /logs/batch — 배치 (오프라인 복귀 시 쌓인 로그 한번에 전송)
logs.post('/batch', async (c) => {
  const body = await c.req.json<{ logs: ClientLogEntry[] }>()

  if (!Array.isArray(body.logs) || body.logs.length === 0) {
    throw new HTTPException(400, { message: 'logs array is required' })
  }

  await prisma.clientLog.createMany({
    data: body.logs.map((log) => ({
      level: log.level,
      message: log.message,
      context: log.context as Prisma.InputJsonValue | undefined,
      platform: log.platform,
      appVersion: log.appVersion,
      userId: log.userId ?? null,
    })),
  })

  return c.json({ success: true, data: { count: body.logs.length } })
})

export default logs
