import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import chatRouter from './routes/chat'

dotenv.config()

function parseAllowedOrigins() {
  return (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function createApp() {
  const app = express()
  const allowedOrigins = parseAllowedOrigins()

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    },
  }

  app.disable('x-powered-by')
  app.use(cors(corsOptions))
  app.use(express.json({ limit: '50kb' }))

  app.get('/api/health', (_request: Request, response: Response) => {
    response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  app.use('/api/chat', chatRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

const port = Number(process.env.PORT ?? 3001)
const app = createApp()

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
