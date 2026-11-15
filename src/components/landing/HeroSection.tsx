import { ArrowRight, FileText } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import VerdictBadge from '@/components/verification/VerdictBadge';
import type { Verdict } from '@/features/verification/types';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-28 lg:pt-28">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900/70 px-3 py-1.5 text-xs font-medium text-neutral-200">
            <span className="h-1.5 w-1.5 rounded-full bg-success-400" aria-hidden />
            AI-assisted fact verification
          </p>
          <h1 className="mt-6 text-4xl text-white sm:text-5xl lg:text-6xl">
            Don&apos;t just trust the answer. <span className="text-brand-300">Verify it.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-[1.5] text-neutral-300">
            Paste a claim, a paragraph or an article link. FACTS separates each factual statement, searches current
            sources and explains what the evidence can and cannot establish.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/verify" size="lg" icon={ArrowRight}>
              Start a verification
            </ButtonLink>
            <ButtonLink to="/reports/sample" variant="secondary" size="lg" icon={FileText}>
              View a sample report
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-neutral-400">The sample report uses placeholder content to show the layout.</p>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative animate-fade-up [animation-delay:150ms]" aria-hidden>
      <div className="rounded-2xl border border-navy-700 bg-navy-900/80 p-5 shadow-2xl shadow-black/40 sm:p-6">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Illustration</p>
          <p className="text-xs text-neutral-400">3 claims found</p>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <PreviewClaim text="The bridge reopened to traffic in March 2024." verdict="CURRENT" />
          <PreviewClaim text="The toll is set at four dollars for all vehicles." verdict="OUTDATED" />
          <PreviewClaim text="The project was completed under budget." verdict="NEEDS_REVIEW" />
        </div>

        <div className="mt-5 rounded-xl border border-navy-700 bg-navy-950/60 p-4">
          <p className="text-xs text-neutral-400">Sources reviewed</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-700">
            <div className="h-full w-4/5 rounded-full bg-brand-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewClaim({ text, verdict }: { text: string; verdict: Verdict }) {
  return (
    <div className="rounded-xl border border-navy-700 bg-navy-950/70 p-4">
      <p className="text-sm leading-[1.5] text-neutral-100">{text}</p>
      <VerdictBadge verdict={verdict} className="mt-3" />
    </div>
  );
}
