import { Outlet } from 'react-router-dom';
import Logo from '@/components/brand/Logo';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:px-6 sm:pt-0">
        <div className="w-full max-w-md animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
