import './styles/globals.css';
import { Button } from '@ui/components/Button';

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <header className='px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm'>
        <a className='flex items-center justify-center' href='#'>
          <svg
            className=' h-6 w-6 text-indigo-600'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
          </svg>
          <span className='sr-only'>Vibe Coding</span>
        </a>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Features
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Pricing
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            About
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Contact
          </a>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900'>
                    Modern Web Scaffold for Your Next Project
                  </h1>
                  <p className='max-w-[600px] text-gray-500 md:text-xl'>
                    Powered by React, Vite, TypeScript, and Tailwind CSS. Built
                    with best practices for a highly scalable and maintainable
                    codebase.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button>Get Started</Button>
                  <Button variant='outline'>Learn More</Button>
                </div>
              </div>
              <img
                alt='Hero'
                className='mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square'
                height='550'
                src='https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop'
                width='550'
              />
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-gray-500'>
          &copy; 2024 Vibe Coding. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <a className='text-xs hover:underline underline-offset-4' href='#'>
            Terms of Service
          </a>
          <a className='text-xs hover:underline underline-offset-4' href='#'>
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
