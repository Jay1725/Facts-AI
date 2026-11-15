import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertTone = 'error' | 'success' | 'info';

const TONES: Record<AlertTone, { box: string; icon: typeof Info; iconClass: string }> = {
  error: { box: 'border-danger-900 bg-danger-900/40 text-danger-100', icon: AlertCircle, iconClass: 'text-danger-300' },
  success: { box: 'border-success-900 bg-success-900/40 text-success-100', icon: CheckCircle2, iconClass: 'text-success-300' },
  info: { box: 'border-brand-800 bg-brand-950/60 text-brand-100', icon: Info, iconClass: 'text-brand-300' },
};

interface FormAlertProps {
  tone: AlertTone;
  children: ReactNode;
}

export default function FormAlert({ tone, children }: FormAlertProps) {
  const meta = TONES[tone];
  const Icon = meta.icon;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-[1.5] ${meta.box}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.iconClass}`} aria-hidden />
      <div>{children}</div>
    </div>
  );
}
