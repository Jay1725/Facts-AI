import { Compass } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import EmptyState from '@/components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-20 sm:px-6">
      <div className="w-full animate-fade-up">
        <EmptyState
          icon={Compass}
          title="This page does not exist"
          description="The link may be out of date, or the address was typed incorrectly."
          action={<ButtonLink to="/">Back to home</ButtonLink>}
        />
      </div>
    </div>
  );
}
