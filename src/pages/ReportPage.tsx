import { useParams } from 'react-router-dom';
import ButtonLink from '@/components/ui/ButtonLink';
import PageHeader from '@/components/ui/PageHeader';
import ReportView from '@/components/report/ReportView';
import SavedReportDetail from '@/components/reports/SavedReportDetail';
import { SAMPLE_REPORT } from '@/features/verification/sampleReport';

export default function ReportPage() {
  const { reportId = '' } = useParams();

  if (reportId !== SAMPLE_REPORT.id) {
    return (
      <div className="flex flex-col gap-10 animate-fade-up">
        <PageHeader
          eyebrow="Saved submission"
          title="Your verification"
          actions={
            <ButtonLink to="/history" variant="secondary">
              Back to history
            </ButtonLink>
          }
        />
        <SavedReportDetail key={reportId} reportId={reportId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader
        eyebrow="Verification report"
        title="Sample verification report"
        description="Layout preview with placeholder claims and sources."
        actions={
          <ButtonLink to="/verify" variant="secondary">
            New verification
          </ButtonLink>
        }
      />
      <ReportView report={SAMPLE_REPORT} />
    </div>
  );
}
