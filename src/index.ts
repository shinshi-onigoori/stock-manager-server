import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express, { Application } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from './adapter/controller/authController';
import passport from './infrastructure/authentication/authentication';
import { CONNECTION } from "./infrastructure/driver/mysqlConnector";
import { LOGGER } from "./logging";
import { portfolioRouter } from "./adapter/controller/portfolioController";

const app: Application = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:3000', //アクセス許可するオリジン
  credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}))

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/portfolio", passport.authenticate("jwt", { session: false }), portfolioRouter);


try {
  app.listen(PORT, () => {
    LOGGER.debug(`[Application][index] dev server running at: http://localhost:${PORT}/`);
  })
} catch (e) {
  LOGGER.error("[Application][index] Unhandled error.");
  /**
   * DBコネクションを解放
   */
  CONNECTION.then(async (conn) => {
    await conn.end();
    LOGGER.debug("[Application][index] Connection closed.");
  })
  if (e instanceof Error) {
    LOGGER.error(e.message);
  }
}

