import { Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import VerdictBadge from '@/components/verification/VerdictBadge';
import { VERDICTS, VERDICT_META } from '@/features/verification/types';

export default function VerdictLegendSection() {
  return (
    <section id="verdicts" className="scroll-mt-20 border-t border-navy-800 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Verdicts"
          title="Five outcomes, each with a meaning"
          description="A missing source is never treated as proof that something is false."
        />

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {VERDICTS.map((verdict) => (
            <li key={verdict}>
              <Card className="flex h-full flex-col gap-4 p-5">
                <VerdictBadge verdict={verdict} className="self-start" />
                <p className="text-sm leading-[1.5] text-neutral-300">{VERDICT_META[verdict].description}</p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-navy-700 bg-navy-900/60 p-4 text-sm text-neutral-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden />
          <p className="leading-[1.5]">
            Confidence is shown as a plain-language level with the reason behind it. FACTS does not display made-up
            percentages.
          </p>
        </div>
      </div>
    </section>
  );
}
