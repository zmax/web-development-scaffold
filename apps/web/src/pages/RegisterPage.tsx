import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@ui/index';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>註冊</CardTitle>
          <CardDescription>
            已經有帳戶了？{' '}
            <Link to='/login' className='underline'>
              登入
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>名稱</Label>
            <Input id='name' placeholder='Max Robinson' required />
          </div>
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
          <Button className='w-full'>建立帳戶</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
