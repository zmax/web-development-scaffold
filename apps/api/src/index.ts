import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.controller';
import userRouter from './user/user.controller';
import { errorHandler } from './middleware/error.middleware';

// 在所有其他匯入之前載入環境變數
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS 設定
const corsOptions = {
  // 只允許來自前端開發伺服器的請求
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
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
