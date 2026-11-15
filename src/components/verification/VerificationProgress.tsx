import { AlertTriangle, Circle, History } from 'lucide-react';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';
import Card from '@/components/ui/Card';
import { VERIFICATION_STAGES } from '@/features/verification/stages';
import type { SubmissionInput } from '@/features/verification/validation';

interface VerificationProgressProps {
  submission: SubmissionInput;
  reportId: string;
  onEdit: () => void;
}

export default function VerificationProgress({ submission, reportId, onEdit }: VerificationProgressProps) {
  const preview = submission.mode === 'text' ? submission.text : submission.url;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <Card className="p-5 sm:p-6 animate-fade-up">
        <p className="text-sm font-medium text-brand-300">Verification in progress</p>
        <h2 className="mt-2 text-xl text-white">Your submission</h2>
        <p className="mt-3 line-clamp-4 break-words rounded-xl border border-navy-700 bg-navy-950 p-4 text-sm leading-[1.5] text-neutral-200">
          {preview}
        </p>

        <ol className="mt-8 flex flex-col">
          {VERIFICATION_STAGES.map((stage, index) => {
            const isLast = index === VERIFICATION_STAGES.length - 1;
            return (
              <li key={stage.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span aria-hidden className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-navy-700" />
                )}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy-600 bg-navy-900 text-neutral-400">
                  <Circle className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="pt-0.5">
                  <p className="font-medium text-neutral-300">{stage.label}</p>
                  <p className="mt-1 text-sm text-neutral-400">{stage.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <aside className="flex flex-col gap-4">
        <Card className="p-5 animate-fade-up">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-900/60 text-warning-300">
              <AlertTriangle className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h3 className="text-base text-white">Checking your submission</h3>
              <p className="mt-2 text-sm leading-[1.5] text-neutral-300">
                Live web searches are running. You will be taken to the results when the check finishes.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-neutral-300">Your submission has been saved to your history.</p>
          <ButtonLink to={`/reports/${reportId}`} variant="secondary" icon={History} className="mt-4 w-full">
            Open saved submission
          </ButtonLink>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-neutral-300">Want to change what you submitted?</p>
          <p className="mt-2 text-sm text-neutral-400">The earlier submission stays in your history.</p>
          <Button variant="secondary" className="mt-4 w-full" onClick={onEdit}>
            Submit something new
          </Button>
        </Card>
      </aside>
    </div>
  );
}
