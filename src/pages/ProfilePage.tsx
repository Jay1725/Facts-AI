import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PasswordChangeForm from '@/components/account/PasswordChangeForm';
import ProfileNameForm from '@/components/account/ProfileNameForm';
import { formatDateTime } from '@/lib/format';
import { useAuth } from '@/features/auth/useAuth';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.fullName || (user?.user_metadata?.full_name as string | undefined) || 'Your account';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleSignOut = () => {
    navigate('/', { replace: true });
    void signOut();
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader eyebrow="Account" title="Profile and settings" description="Manage your name, password and session." />

      <Card className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white">
          {initials || '?'}
        </span>
        <dl className="grid flex-1 gap-4 sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-sm text-neutral-400">Full name</dt>
            <dd className="mt-1 truncate text-base text-white">{displayName}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-neutral-400">Email address</dt>
            <dd className="mt-1 truncate text-base text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-400">Account created</dt>
            <dd className="mt-1 text-base text-white">{user ? formatDateTime(user.created_at) : '-'}</dd>
          </div>
        </dl>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileNameForm key={profile ? 'loaded' : 'pending'} />
        <PasswordChangeForm />
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg text-white">Sign out</h2>
          <p className="mt-1 text-sm text-neutral-300">End your session on this device.</p>
        </div>
        <Button variant="secondary" onClick={handleSignOut} className="w-full sm:w-auto">
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </Card>
    </div>
  );
}
