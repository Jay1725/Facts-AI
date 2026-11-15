import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CircleHelp, CircleX, Clock, ShieldCheck } from 'lucide-react';

export const VERDICTS = ['CURRENT', 'OUTDATED', 'INACCURATE', 'UNSUPPORTED', 'NEEDS_REVIEW'] as const;

export type Verdict = (typeof VERDICTS)[number];

export type VerdictTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface VerdictMeta {
  label: string;
  description: string;
  tone: VerdictTone;
  icon: LucideIcon;
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  CURRENT: {
    label: 'Current / Verified',
    description: 'Reliable, relevant evidence supports the claim as currently accurate.',
    tone: 'success',
    icon: ShieldCheck,
  },
  OUTDATED: {
    label: 'Outdated',
    description: 'The claim was likely accurate before, but newer evidence has changed the picture.',
    tone: 'warning',
    icon: Clock,
  },
  INACCURATE: {
    label: 'Inaccurate',
    description: 'Reliable evidence materially contradicts the claim.',
    tone: 'danger',
    icon: CircleX,
  },
  UNSUPPORTED: {
    label: 'Unsupported',
    description: 'Available research does not provide enough evidence to establish the claim.',
    tone: 'neutral',
    icon: CircleHelp,
  },
  NEEDS_REVIEW: {
    label: 'Needs review',
    description: 'Evidence is conflicting, ambiguous or incomplete, so no confident conclusion is possible.',
    tone: 'warning',
    icon: AlertTriangle,
  },
};

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export interface EvidenceSource {
  title: string;
  url: string;
  publishedAt: string | null;
}

export interface ClaimResult {
  id: string;
  text: string;
  verdict: Verdict;
  explanation: string;
  confidence: { level: ConfidenceLevel; reason: string };
  supportingEvidence: string[];
  contradictingEvidence: string[];
  sources: EvidenceSource[];
  suggestedCorrection: string | null;
}

export interface VerificationReport {
  id: string;
  isSample: boolean;
  submittedAt: string;
  submittedText: string;
  summary: string;
  claims: ClaimResult[];
}
