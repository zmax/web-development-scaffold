import dotenv from 'dotenv';
// 必須在所有其他匯入之前最先執行，以確保環境變數被正確載入
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './auth/auth.controller.js';
import userRouter from './user/user.controller.js';
import { errorHandler } from './middleware/error.middleware.js';
import logger from './lib/logger.js';
import prisma from './lib/prisma.js';

const app = express();
const port = process.env.PORT || 3001;

// 設定基礎的中介軟體
app.use(helmet()); // 使用 Helmet 來設定多種安全性 HTTP 標頭
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json()); // 解析 JSON 格式的請求主體

// 掛載路由
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// 掛載集中的錯誤處理中介軟體
app.use(errorHandler);

app.get('/', (_req, res) => {
  res.send('API is running!');
});

const server = app.listen(port, () => {
  logger.info(`API server listening on http://localhost:${port}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`收到 ${signal}，開始優雅關閉...`);
  server.close(async () => {
    logger.info('HTTP 伺服器已關閉。');
    await prisma.$disconnect();
    logger.info('資料庫連線已斷開。');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
