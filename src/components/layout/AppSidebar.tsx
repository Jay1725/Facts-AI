import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, History, Home, LayoutDashboard, LogOut, PlusCircle, Settings, User } from 'lucide-react';
import { cn } from '@/lib/classNames';
import { useAuth } from '@/features/auth/useAuth';

const PRIMARY_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/verify', label: 'New verification', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    onNavigate?.();
    navigate('/', { replace: true });
    void signOut();
  };

  return (
    <nav aria-label="Workspace" className="flex flex-1 flex-col gap-6 px-3 py-4">
      <ul className="flex flex-col gap-1">
        {PRIMARY_LINKS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-brand-600/15 text-brand-200 shadow-[inset_2px_0_0_0] shadow-brand-400'
                    : 'text-neutral-300 hover:bg-navy-800 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-1 border-t border-navy-800 pt-4">
        {user?.email && <p className="truncate px-3 pb-2 text-xs text-neutral-400">{user.email}</p>}
        <NavLink
          to="/reports/sample"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors duration-200 hover:bg-navy-800 hover:text-white"
        >
          <FileText className="h-4 w-4" aria-hidden />
          Sample report
        </NavLink>
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors duration-200 hover:bg-navy-800 hover:text-white"
        >
          <Home className="h-4 w-4" aria-hidden />
          Back to home
        </NavLink>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-300 transition-colors duration-200 hover:bg-navy-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </nav>
  );
}
