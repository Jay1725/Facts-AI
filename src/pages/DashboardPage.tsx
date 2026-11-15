import { ArrowRight, BarChart3, FileText, History, Search } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import SavedReportsSection from '@/components/reports/SavedReportsSection';

const RECENT_LIMIT = 3;

const STATS = [
  { label: 'Verifications run', icon: BarChart3 },
  { label: 'Claims checked', icon: Search },
  { label: 'Sources reviewed', icon: FileText },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        description="Check claims, articles and web pages against live evidence, then revisit every report from one place."
        actions={
          <ButtonLink to="/verify" icon={ArrowRight}>
            New verification
          </ButtonLink>
        }
      />

      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-2xl text-white">Check something before you share it</h2>
          <p className="mt-3 text-base leading-[1.5] text-neutral-300">
            Paste a paragraph, enter a single claim or submit an article link. FACTS will list each claim and show
            what the evidence supports.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/verify" icon={ArrowRight}>
              Start a verification
            </ButtonLink>
            <ButtonLink to="/reports/sample" variant="secondary" icon={FileText}>
              Preview a sample report
            </ButtonLink>
          </div>
        </div>
      </Card>

      <section aria-labelledby="stats-heading" className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="stats-heading" className="text-lg text-white">
            Activity
          </h2>
          <p className="text-sm text-neutral-400">Statistics appear after your first verification</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {STATS.map(({ label, icon: Icon }) => (
            <li key={label}>
              <Card className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-300">{label}</p>
                  <Icon className="h-4 w-4 text-neutral-400" aria-hidden />
                </div>
                <p className="text-3xl font-semibold text-neutral-500">
                  &mdash;<span className="sr-only"> not yet available</span>
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recent-heading" className="text-lg text-white">
            Recent verifications
          </h2>
          <ButtonLink to="/history" variant="ghost" size="md" icon={History}>
            View history
          </ButtonLink>
        </div>
        <SavedReportsSection limit={RECENT_LIMIT} />
      </section>
    </div>
  );
}
