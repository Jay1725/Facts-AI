import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import AppSidebar from './AppSidebar';

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-800 bg-navy-950/95 px-4 backdrop-blur-md lg:hidden">
        <Logo to="/dashboard" />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700 text-neutral-200 hover:bg-navy-800"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm animate-fade-up"
            style={{ animationDuration: '200ms' }}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-navy-800 bg-navy-900 shadow-2xl">
            <div className="flex h-16 items-center justify-between px-5">
              <Logo to="/dashboard" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-300 hover:bg-navy-800"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <AppSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-navy-800 bg-navy-900/60 lg:flex lg:flex-col">
        <div className="flex h-16 items-center px-6">
          <Logo to="/dashboard" />
        </div>
        <AppSidebar />
      </aside>

      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
