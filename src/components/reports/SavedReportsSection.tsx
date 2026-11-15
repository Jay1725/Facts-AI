import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Link2, Loader2, FileText, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import FormAlert from '@/components/ui/FormAlert';
import { formatDateTime } from '@/lib/format';
import { REPORT_STATUS_LABELS } from '@/features/reports/reportStatus';
import type { SavedReport } from '@/features/reports/reportService';
import { useSavedReports } from '@/features/reports/useSavedReports';
import ButtonLink from '@/components/ui/ButtonLink';

interface SavedReportsSectionProps {
  limit: number;
}

export default function SavedReportsSection({ limit }: SavedReportsSectionProps) {
  const { reports, status, reload, removeReport } = useSavedReports(limit);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-neutral-300">
        <Loader2 className="h-4 w-4 animate-spin text-brand-300" aria-hidden />
        Loading your reports...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col gap-4">
        <FormAlert tone="error">Your reports could not be loaded. Check your connection and try again.</FormAlert>
        <div>
          <Button variant="secondary" onClick={() => void reload()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No verifications yet"
        description="Reports you create will appear here so you can reopen them later."
        action={
          <ButtonLink to="/verify" variant="secondary">
            Start your first verification
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {deleteError && <FormAlert tone="error">{deleteError}</FormAlert>}
      <ul className="flex flex-col gap-3">
        {reports.map((report) => (
          <li key={report.id}>
            <SavedReportRow
              report={report}
              onDelete={async () => {
                setDeleteError(null);
                try {
                  await removeReport(report.id);
                } catch (error) {
                  setDeleteError(error instanceof Error ? error.message : 'This report could not be deleted.');
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function describeSubmission(report: SavedReport) {
  return report.submissionType === 'url' ? report.submittedUrl ?? '' : report.submittedText ?? '';
}

interface SavedReportRowProps {
  report: SavedReport;
  onDelete: () => Promise<void>;
}

function SavedReportRow({ report, onDelete }: SavedReportRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const SubmissionIcon = report.submissionType === 'url' ? Link2 : FileText;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <Card className="flex flex-col gap-4 p-5 transition-colors duration-200 hover:border-navy-600 sm:flex-row sm:items-center">
      <Link to={`/reports/${report.id}`} className="group flex min-w-0 flex-1 items-start gap-4 rounded-lg">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-navy-600 bg-navy-800">
          <SubmissionIcon className="h-4 w-4 text-brand-300" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base text-white group-hover:text-brand-100">
            {describeSubmission(report)}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400">
            <span>{formatDateTime(report.createdAt)}</span>
            <span aria-hidden>&middot;</span>
            <span>{REPORT_STATUS_LABELS[report.status]}</span>
          </span>
        </span>
        <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>

      {confirming ? (
        <div className="flex items-center gap-2 sm:shrink-0">
          <Button variant="secondary" size="md" onClick={() => setConfirming(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button size="md" onClick={() => void handleDelete()} disabled={deleting} className="bg-danger-700 hover:bg-danger-600">
            {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Delete
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="md"
          onClick={() => setConfirming(true)}
          aria-label={`Delete report from ${formatDateTime(report.createdAt)}`}
          className="self-start text-neutral-300 hover:text-danger-300 sm:shrink-0"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Delete
        </Button>
      )}
    </Card>
  );
}
