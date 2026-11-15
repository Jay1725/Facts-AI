import { cn } from '@/lib/classNames';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={cn('rounded-2xl border border-navy-700/70 bg-navy-900/70', className)}>{children}</div>;
}
