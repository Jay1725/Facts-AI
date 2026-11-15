import { supabase } from '@/lib/supabase';
import type { SubmissionInput } from '@/features/verification/validation';
import {
  CONFIDENCE_LEVELS,
  VERDICTS,
  type ClaimResult,
  type EvidenceSource,
  type VerificationReport,
} from '@/features/verification/types';

export const REPORT_STATUSES = ['submitted', 'processing', 'completed', 'failed'] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface SavedReport {
  id: string;
  submissionType: 'text' | 'url';
  submittedText: string | null;
  submittedUrl: string | null;
  status: ReportStatus;
  summary: string | null;
  claims: ClaimResult[];
  errorMessage: string | null;
  createdAt: string;
}

const REPORT_COLUMNS =
  'id, submission_type, submitted_text, submitted_url, status, summary, claims, error_message, created_at';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isEvidenceSource(value: unknown): value is EvidenceSource {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    (value.publishedAt === null || typeof value.publishedAt === 'string')
  );
}

function isClaimResult(value: unknown): value is ClaimResult {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    VERDICTS.includes(value.verdict as ClaimResult['verdict']) &&
    typeof value.explanation === 'string' &&
    isRecord(value.confidence) &&
    CONFIDENCE_LEVELS.includes(value.confidence.level as ClaimResult['confidence']['level']) &&
    typeof value.confidence.reason === 'string' &&
    isStringArray(value.supportingEvidence) &&
    isStringArray(value.contradictingEvidence) &&
    Array.isArray(value.sources) &&
    value.sources.every(isEvidenceSource) &&
    (value.suggestedCorrection === null || typeof value.suggestedCorrection === 'string')
  );
}

function toClaims(value: unknown): ClaimResult[] {
  if (!Array.isArray(value) || !value.every(isClaimResult)) {
    throw new Error('Unexpected report data.');
  }
  return value;
}

function toSavedReport(row: unknown): SavedReport {
  if (
    !isRecord(row) ||
    typeof row.id !== 'string' ||
    (row.submission_type !== 'text' && row.submission_type !== 'url') ||
    (row.submitted_text !== null && typeof row.submitted_text !== 'string') ||
    (row.submitted_url !== null && typeof row.submitted_url !== 'string') ||
    !REPORT_STATUSES.includes(row.status as ReportStatus) ||
    (row.summary !== null && typeof row.summary !== 'string') ||
    (row.error_message !== null && typeof row.error_message !== 'string') ||
    typeof row.created_at !== 'string'
  ) {
    throw new Error('Unexpected report data.');
  }
  return {
    id: row.id,
    submissionType: row.submission_type,
    submittedText: row.submitted_text,
    submittedUrl: row.submitted_url,
    status: row.status as ReportStatus,
    summary: row.summary,
    claims: toClaims(row.claims),
    errorMessage: row.error_message,
    createdAt: row.created_at,
  };
}

export function toVerificationReport(report: SavedReport): VerificationReport {
  return {
    id: report.id,
    isSample: false,
    submittedAt: report.createdAt,
    submittedText: report.submittedText ?? report.submittedUrl ?? '',
    summary: report.summary ?? '',
    claims: report.claims,
  };
}

export async function createReport(input: SubmissionInput): Promise<SavedReport> {
  const payload =
    input.mode === 'text'
      ? { submission_type: 'text', submitted_text: input.text }
      : { submission_type: 'url', submitted_url: input.url };

  const { data, error } = await supabase
    .from('verification_reports')
    .insert(payload)
    .select(REPORT_COLUMNS)
    .single();

  if (error) throw new Error('Your submission could not be saved. Check your connection and try again.');
  return toSavedReport(data);
}

export async function runVerification(reportId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('verify-report', { body: { reportId } });
  if (error) throw new Error('Verification could not be completed. Please try again.');
  if (!isRecord(data) || (data.status !== 'completed' && data.status !== 'failed')) {
    throw new Error('Verification returned an unexpected response.');
  }
}

export async function listReports(limit: number): Promise<SavedReport[]> {
  const { data, error } = await supabase
    .from('verification_reports')
    .select(REPORT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !Array.isArray(data)) throw new Error('Your history could not be loaded.');
  return data.map(toSavedReport);
}

export async function getReport(id: string): Promise<SavedReport | null> {
  const { data, error } = await supabase
    .from('verification_reports')
    .select(REPORT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error('This report could not be loaded.');
  return data ? toSavedReport(data) : null;
}

export async function deleteReport(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('verification_reports')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !data) throw new Error('This report could not be deleted. Please try again.');
}
