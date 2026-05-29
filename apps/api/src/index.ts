import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import type { ApiResponse } from '@kit/types'

import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import statsRoutes from './routes/stats'
import paymentsRoutes from './routes/payments'
import searchRoutes from './routes/search'
import devicesRoutes from './routes/devices'
import logsRoutes from './routes/logs'

const app = new Hono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [
      process.env.WEB_URL ?? 'http://localhost:3000',
      'exp://localhost:8081',
      'http://localhost:8081',
    ],
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

app.get('/health', (c) => c.json({ ok: true }))

app.route('/auth', authRoutes)
app.route('/users', usersRoutes)
app.route('/stats', statsRoutes)
app.route('/payments', paymentsRoutes)
app.route('/search', searchRoutes)
app.route('/devices', devicesRoutes)
app.route('/logs', logsRoutes)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json<ApiResponse>({ success: false, error: err.message }, err.status)
  }
  console.error(err)
  return c.json<ApiResponse>({ success: false, error: 'Internal Server Error' }, 500)
})

const port = Number(process.env.PORT ?? 4000)
console.log(`API server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
