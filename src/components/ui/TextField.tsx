import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/classNames';

const INPUT_BASE =
  'h-12 w-full rounded-xl border bg-navy-950 px-4 text-base text-white placeholder:text-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
  endAdornment?: ReactNode;
  labelAction?: ReactNode;
}

export default function TextField({ id, label, error, hint, endAdornment, labelAction, className, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-neutral-200">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            INPUT_BASE,
            error ? 'border-danger-500/70 focus:border-danger-400' : 'border-navy-700 focus:border-brand-500',
            endAdornment ? 'pr-14' : undefined,
            className
          )}
          {...inputProps}
        />
        {endAdornment && <div className="absolute inset-y-0 right-1.5 flex items-center">{endAdornment}</div>}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-danger-300">
          {error}
        </p>
      ) : (
        hint && (
          <div id={hintId} className="text-sm text-neutral-400">
            {hint}
          </div>
        )
      )}
    </div>
  );
}
