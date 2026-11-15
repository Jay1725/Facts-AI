import { useEffect, useState } from 'react';
import { ExternalLink, FileSearch, FileText, Link2, Loader2 } from 'lucide-react';
import ButtonLink from '@/components/ui/ButtonLink';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import FormAlert from '@/components/ui/FormAlert';
import ReportView from '@/components/report/ReportView';
import { formatDateTime } from '@/lib/format';
import { REPORT_STATUS_LABELS } from '@/features/reports/reportStatus';
import {
  getReport,
  runVerification,
  toVerificationReport,
  type SavedReport,
} from '@/features/reports/reportService';

interface SavedReportDetailProps {
  reportId: string;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'missing' }
  | { kind: 'ready'; report: SavedReport };

export default function SavedReportDetail({ reportId }: SavedReportDetailProps) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [running, setRunning] = useState(false);
  const [runFailed, setRunFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ kind: 'loading' });
    getReport(reportId)
      .then((report) => {
        if (!active) return;
        setState(report ? { kind: 'ready', report } : { kind: 'missing' });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [reportId, attempt]);

  const startCheck = async () => {
    setRunning(true);
    setRunFailed(false);
    try {
      await runVerification(reportId);
    } catch {
      setRunFailed(true);
    }
    setRunning(false);
    setAttempt((count) => count + 1);
  };

  if (state.kind === 'loading') {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-neutral-300">
        <Loader2 className="h-4 w-4 animate-spin text-brand-300" aria-hidden />
        Loading report...
      </div>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className="flex flex-col gap-4">
        <FormAlert tone="error">This report could not be loaded. Check your connection and try again.</FormAlert>
        <div>
          <button
            type="button"
            onClick={() => setAttempt((count) => count + 1)}
            className="inline-flex h-10 items-center rounded-lg border border-navy-600 bg-navy-800/60 px-4 text-sm font-medium text-neutral-100 transition-colors hover:bg-navy-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (state.kind === 'missing') {
    return (
      <EmptyState
        icon={FileSearch}
        title="This report is not available"
        description="It may have been deleted, or it belongs to a different account."
        action={
          <ButtonLink to="/history" variant="secondary">
            Back to history
          </ButtonLink>
        }
      />
    );
  }

  const { report } = state;
  if (report.status === 'completed') {
    return <ReportView report={toVerificationReport(report)} />;
  }

  const isUrl = report.submissionType === 'url';
  const submitted = isUrl ? report.submittedUrl : report.submittedText;
  const isWebLink = isUrl && submitted !== null && /^https?:\/\//i.test(submitted);
  const canRunCheck = report.status === 'submitted' || report.status === 'failed';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-300">
          {isUrl ? <Link2 className="h-4 w-4" aria-hidden /> : <FileText className="h-4 w-4" aria-hidden />}
          {isUrl ? 'Web page submitted' : 'Text submitted'}
        </div>
        <p className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-navy-700 bg-navy-950 p-4 text-sm leading-[1.5] text-neutral-200">
          {submitted}
        </p>
        {isWebLink && submitted && (
          <a
            href={submitted}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            Open the web page
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </Card>

      <aside className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3 p-5">
          <p className="text-sm text-neutral-300">Status</p>
          <p className="text-base text-white">{REPORT_STATUS_LABELS[report.status]}</p>
          <p className="text-sm text-neutral-400">Submitted {formatDateTime(report.createdAt)}</p>
        </Card>
        <Card className="flex flex-col gap-3 p-5">
          {report.status === 'failed' && report.errorMessage && (
            <FormAlert tone="error">{report.errorMessage}</FormAlert>
          )}
          {runFailed && <FormAlert tone="error">The check could not be started. Please try again.</FormAlert>}
          {canRunCheck ? (
            <>
              <h3 className="text-base text-white">
                {report.status === 'failed' ? 'Try the check again' : 'Check has not run yet'}
              </h3>
              <p className="text-sm leading-[1.5] text-neutral-300">
                Verdicts appear here once live web research finishes. Nothing is shown until then.
              </p>
              <button
                type="button"
                onClick={() => void startCheck()}
                disabled={running}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {running && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {running ? 'Checking...' : 'Run check'}
              </button>
            </>
          ) : (
            <p className="text-sm leading-[1.5] text-neutral-300">This check is still running. Refresh in a moment.</p>
          )}
        </Card>
      </aside>
    </div>
  );
}
