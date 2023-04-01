import express, { Application, Request, Response } from 'express'
import { authRouter } from './presentation/controller/authController'

const app: Application = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", authRouter)

try {
  app.listen(PORT, () => {
    console.log(`dev server running at: http://localhost:${PORT}/`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
