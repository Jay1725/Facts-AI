import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/classNames';
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles';

interface ButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function ButtonLink({ to, variant = 'primary', size = 'md', icon: Icon, children, className }: ButtonLinkProps) {
  return (
    <Link to={to} className={cn(buttonStyles(variant, size), 'group', className)}>
      {children}
      {Icon && <Icon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}
