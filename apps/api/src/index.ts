import dotenv from 'dotenv';
// 必須在所有其他匯入之前最先執行，以確保環境變數被正確載入
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.controller';
import userRouter from './user/user.controller';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const port = process.env.PORT || 3001;

// 設定 CORS 中介軟體
// 這必須在您的路由之前設定，才能正確處理 preflight 請求
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
app.use(cors(corsOptions));

// Body parser 中介軟體，用於解析 JSON 格式的請求主體
app.use(express.json());

// 掛載路由
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// 掛載集中的錯誤處理中介軟體
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
