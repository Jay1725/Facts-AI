import { History } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import PageHeader from '@/components/ui/PageHeader';
import SavedReportsSection from '@/components/reports/SavedReportsSection';

const HISTORY_LIMIT = 100;

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader
        eyebrow="History"
        title="Past verifications"
        description="Every report you save is listed here so you can reopen it at any time."
        actions={
          <ButtonLink to="/verify" icon={History}>
            New verification
          </ButtonLink>
        }
      />
      <SavedReportsSection limit={HISTORY_LIMIT} />
    </div>
  );
}
