import express, { Request, Response } from 'express';
import authRouter from './auth/auth.controller';
import userRouter from './user/user.controller';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the API!');
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
