import type { ReportStatus } from './reportService';

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  submitted: 'Awaiting research',
  processing: 'Researching',
  completed: 'Completed',
  failed: 'Failed',
};
