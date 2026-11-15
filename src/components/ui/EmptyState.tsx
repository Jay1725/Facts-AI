import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Card from './Card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-navy-600 bg-navy-800">
        <Icon className="h-6 w-6 text-brand-300" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-[1.5] text-neutral-300">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
