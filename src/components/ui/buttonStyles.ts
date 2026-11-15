import { cn } from '@/lib/classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm shadow-brand-950/60 hover:bg-brand-700',
  secondary: 'border border-navy-600 bg-navy-800/60 text-neutral-100 hover:border-navy-500 hover:bg-navy-700',
  ghost: 'text-neutral-300 hover:bg-navy-800 hover:text-white',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(BASE, VARIANTS[variant], SIZES[size]);
}
