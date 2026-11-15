import { ArrowUpRight, CircleCheck, CircleX, Lightbulb } from 'lucide-react';
import Card from '@/components/ui/Card';
import VerdictBadge from '@/components/verification/VerdictBadge';
import { formatPublishedDate } from '@/lib/format';
import type { ClaimResult, ConfidenceLevel } from '@/features/verification/types';

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

const CONFIDENCE_BARS: Record<ConfidenceLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

interface ClaimCardProps {
  claim: ClaimResult;
  index: number;
}

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const bars = CONFIDENCE_BARS[claim.confidence.level];

  return (
    <Card className="flex flex-col gap-6 p-5 sm:p-7 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Claim {index + 1}</p>
          <blockquote className="mt-2 border-l-2 border-brand-500 pl-4 text-lg leading-[1.5] text-white">
            {claim.text}
          </blockquote>
        </div>
        <VerdictBadge verdict={claim.verdict} className="shrink-0" />
      </div>

      <section aria-labelledby={`explanation-${claim.id}`}>
        <h3 id={`explanation-${claim.id}`} className="text-sm font-medium text-neutral-200">
          Why this verdict
        </h3>
        <p className="mt-2 text-base leading-[1.5] text-neutral-300">{claim.explanation}</p>
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-navy-700 bg-navy-950/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1" aria-hidden>
              {[1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className={
                    bar <= bars ? 'h-2 w-6 rounded-full bg-brand-400' : 'h-2 w-6 rounded-full bg-navy-700'
                  }
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white">{CONFIDENCE_LABEL[claim.confidence.level]}</p>
          </div>
          <p className="text-sm text-neutral-300">{claim.confidence.reason}</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <EvidenceList
          title="Supporting evidence"
          items={claim.supportingEvidence}
          emptyText="No supporting evidence was recorded."
          tone="success"
        />
        <EvidenceList
          title="Contradicting evidence"
          items={claim.contradictingEvidence}
          emptyText="No contradicting evidence was recorded."
          tone="danger"
        />
      </div>

      <section aria-labelledby={`sources-${claim.id}`}>
        <h3 id={`sources-${claim.id}`} className="text-sm font-medium text-neutral-200">
          Sources
        </h3>
        {claim.sources.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">No sources were found for this claim.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {claim.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-xl border border-navy-700 bg-navy-950/60 p-4 transition-colors hover:border-brand-600 hover:bg-navy-900"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white group-hover:text-brand-200">{source.title}</p>
                    <p className="mt-1 break-all text-xs text-neutral-400">{formatPublishedDate(source.publishedAt)}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-brand-300" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {claim.suggestedCorrection && (
        <div className="flex gap-3 rounded-xl border border-brand-800 bg-brand-950/50 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" aria-hidden />
          <div>
            <p className="text-sm font-medium text-white">Suggested correction</p>
            <p className="mt-1 text-sm leading-[1.5] text-neutral-200">{claim.suggestedCorrection}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

interface EvidenceListProps {
  title: string;
  items: string[];
  emptyText: string;
  tone: 'success' | 'danger';
}

function EvidenceList({ title, items, emptyText, tone }: EvidenceListProps) {
  const Icon = tone === 'success' ? CircleCheck : CircleX;
  const iconClass = tone === 'success' ? 'text-success-400' : 'text-danger-400';

  return (
    <section className="rounded-xl border border-navy-700 bg-navy-950/40 p-4">
      <h3 className="text-sm font-medium text-neutral-200">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">{emptyText}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-[1.5] text-neutral-200">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
