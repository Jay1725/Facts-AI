import type { ReactNode } from 'react';
import Card from '@/components/ui/Card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-3 text-sm leading-[1.5] text-neutral-300">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
      {footer && <div className="border-t border-navy-800 bg-navy-900/60 px-6 py-5 text-sm text-neutral-300 sm:px-8">{footer}</div>}
    </Card>
  );
}
