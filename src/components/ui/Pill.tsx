import { cn } from '@/lib/classNames';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type PillTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const TONES: Record<PillTone, string> = {
  neutral: 'border-navy-600 bg-navy-800 text-neutral-200',
  brand: 'border-brand-700 bg-brand-950/60 text-brand-200',
  success: 'border-success-900 bg-success-900/50 text-success-100',
  warning: 'border-warning-900 bg-warning-900/50 text-warning-100',
  danger: 'border-danger-900 bg-danger-900/50 text-danger-100',
};

interface PillProps {
  tone?: PillTone;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function Pill({ tone = 'neutral', icon: Icon, children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  );
}
