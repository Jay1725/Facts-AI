import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950">
      <Loader2 className="h-6 w-6 animate-spin text-brand-300" aria-label="Loading" />
    </div>
  );
}

export function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;
  if (!session) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function GuestOnly() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;
  if (session) {
    const from = (location.state as { from?: unknown } | null)?.from;
    const target = typeof from === 'string' && from.startsWith('/') ? from : '/dashboard';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}
