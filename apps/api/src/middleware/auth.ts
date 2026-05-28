import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verifyAccessToken } from '../lib/jwt'
import type { TokenPayload } from '@kit/types'

export type AuthEnv = {
  Variables: { user: TokenPayload }
}

// 프로덕션에서는 Redis로 교체
export const revokedTokens = new Set<string>()

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authorization = c.req.header('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  const token = authorization.slice(7)

  if (revokedTokens.has(token)) {
    throw new HTTPException(401, { message: 'Token revoked' })
  }

  try {
    const payload = await verifyAccessToken(token)
    c.set('user', payload)
    await next()
  } catch {
    throw new HTTPException(401, { message: 'Invalid or expired token' })
  }
})
