import { Hono } from 'hono'
import { authMiddleware, type AuthEnv } from '../middleware/auth'
import { search } from '../services/search'

const searchRoute = new Hono<AuthEnv>()

searchRoute.use('/*', authMiddleware)

// GET /search?q=... — 전체 검색 (mock: 유저 이름·이메일 LIKE)
// 도메인 모델 추가 시 services/search.ts 에 결과 병합
searchRoute.get('/', async (c) => {
  const q = c.req.query('q') ?? ''

  const results = await search(q)

  return c.json({ success: true, data: results })
})

export default searchRoute
