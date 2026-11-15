import { FileText, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import ClaimCard from '@/components/report/ClaimCard';
import VerdictBadge from '@/components/verification/VerdictBadge';
import { VERDICTS, VERDICT_META, type Verdict, type VerificationReport } from '@/features/verification/types';
import { formatDateTime } from '@/lib/format';

interface ReportViewProps {
  report: VerificationReport;
}

export default function ReportView({ report }: ReportViewProps) {
  const countFor = (verdict: Verdict) =>
    report.claims.filter((claim) => claim.verdict === verdict).length;

  return (
    <div className="flex flex-col gap-8">
      {report.isSample && (
        <div className="flex items-start gap-3 rounded-xl border border-warning-900 bg-warning-900/30 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning-300" aria-hidden />
          <p className="text-sm leading-[1.5] text-warning-100">
            This is a sample report with placeholder content. It shows the layout only and is not the result of a real
            verification.
          </p>
        </div>
      )}

      <Card className="flex flex-col gap-6 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <FileText className="h-4 w-4 text-brand-300" aria-hidden />
            Submitted {formatDateTime(report.submittedAt)}
          </div>
          <Pill tone="brand">
            {report.claims.length} {report.claims.length === 1 ? 'claim' : 'claims'}
          </Pill>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-200">Summary</h2>
          <p className="mt-2 text-base leading-[1.5] text-neutral-200">{report.summary}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-200">Original submission</h2>
          <p className="mt-2 rounded-xl border border-navy-700 bg-navy-950 p-4 text-sm leading-[1.5] text-neutral-300">
            {report.submittedText}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Verdict counts">
          {VERDICTS.map((verdict) => (
            <li key={verdict} className="flex flex-col gap-3 rounded-xl border border-navy-700 bg-navy-950/60 p-4">
              <VerdictBadge verdict={verdict} className="self-start" />
              <p className="text-2xl font-semibold text-white">{countFor(verdict)}</p>
              <p className="text-xs leading-[1.5] text-neutral-400">{VERDICT_META[verdict].description}</p>
            </li>
          ))}
        </ul>
      </Card>

      <section aria-label="Claims" className="flex flex-col gap-6">
        {report.claims.map((claim, index) => (
          <ClaimCard key={claim.id} claim={claim} index={index} />
        ))}
      </section>
    </div>
  );
}
