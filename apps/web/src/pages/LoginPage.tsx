import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input, // 引入 Input 元件
  Label, // 引入 Label 元件
} from '@ui/index';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>登入</CardTitle>
          <CardDescription>
            還沒有帳戶嗎？{' '}
            <Link to='/register' className='underline'>
              註冊
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>電子郵件</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>密碼</Label>
            <Input id='password' type='password' required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full'>登入</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
