import Pill, { type PillTone } from '@/components/ui/Pill';
import { VERDICT_META, type Verdict } from '@/features/verification/types';

const TONE_MAP: Record<'success' | 'warning' | 'danger' | 'neutral', PillTone> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  neutral: 'neutral',
};

interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
}

export default function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
  const meta = VERDICT_META[verdict];
  return (
    <Pill tone={TONE_MAP[meta.tone]} icon={meta.icon} className={className}>
      {meta.label}
    </Pill>
  );
}
