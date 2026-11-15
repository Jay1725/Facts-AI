import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import SubmissionForm from '@/components/verification/SubmissionForm';
import VerificationProgress from '@/components/verification/VerificationProgress';
import { createReport, runVerification } from '@/features/reports/reportService';
import type { SubmissionInput } from '@/features/verification/validation';

interface SavedSubmission {
  input: SubmissionInput;
  reportId: string;
}

export default function VerifyPage() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SavedSubmission | null>(null);

  const handleSubmit = async (input: SubmissionInput) => {
    const report = await createReport(input);
    setSubmission({ input, reportId: report.id });
    try {
      await runVerification(report.id);
    } catch {
      // The report page shows the saved outcome, including any failure reason.
    }
    navigate(`/reports/${report.id}`);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <PageHeader
        eyebrow="New verification"
        title="What would you like to check?"
        description="Submit a single claim, a paragraph or a web page. Each factual statement is verified on its own."
      />

      <div className="mx-auto w-full max-w-3xl lg:mx-0 lg:max-w-none">
        {submission ? (
          <VerificationProgress
            submission={submission.input}
            reportId={submission.reportId}
            onEdit={() => setSubmission(null)}
          />
        ) : (
          <SubmissionForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
