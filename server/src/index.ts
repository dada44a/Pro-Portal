import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import authRouter from './routes/auth.route.js'
import propertyRouter from './routes/property.route.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import favouriteRoute from './routes/favourite.route.js'
import { cors } from 'hono/cors'
import userRouter from './routes/user.route.js'
import dotenv from 'dotenv'
dotenv.config()

const app = new Hono()

app.use("*", cors({
  origin: process.env.ORIGIN || "http://localhost:3000",
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

app.route('/api/auth', authRouter)

app.use("/api/property/*", authMiddleware)
app.use("/api/favourites/*", authMiddleware)
app.use("/api/user/*", authMiddleware)


app.route('/api/property', propertyRouter)
app.route('/api/favourites', favouriteRoute)
app.route('/api/user', userRouter)


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 4000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
