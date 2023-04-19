import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" })
import express, { Application } from 'express'
import cookieParser from "cookie-parser";

import { authRouter } from './adapter/controller/authController'
import passport from './infrastructure/authentication/authentication'
import { CONNECTION } from "./infrastructure/dbDriver/mysqlConnector";

const app: Application = express()
const PORT = 8080

app.use(passport.initialize());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use("/auth", authRouter)

try {
  app.listen(PORT, () => {
    console.log(`dev server running at: http://localhost:${PORT}/`)
  })
} catch (e) {
  /**
   * DBコネクションを解放
   */
  CONNECTION.then((conn)=>{
    conn.end()
  })
  if (e instanceof Error) {
    console.error(e.message)
  }
}
