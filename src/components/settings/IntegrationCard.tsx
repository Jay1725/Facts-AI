import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle, CircleDashed, CircleOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Pill, { type PillTone } from '@/components/ui/Pill';
import type { ConnectionState, IntegrationInfo } from '@/features/integrations/integrations';

const STATE_META: Record<ConnectionState, { label: string; tone: PillTone; icon: LucideIcon }> = {
  not_configured: { label: 'Not configured', tone: 'neutral', icon: CircleOff },
  not_tested: { label: 'Not tested', tone: 'brand', icon: CircleDashed },
  connected: { label: 'Connected', tone: 'success', icon: CheckCircle },
  unavailable: { label: 'Unavailable', tone: 'warning', icon: AlertTriangle },
  error: { label: 'Error', tone: 'danger', icon: AlertTriangle },
};

interface IntegrationCardProps {
  integration: IntegrationInfo;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const Icon = integration.icon;
  const status = STATE_META[integration.state];

  return (
    <Card className="flex h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-navy-600 bg-navy-800">
          <Icon className="h-5 w-5 text-brand-300" aria-hidden />
        </span>
        <Pill tone={status.tone} icon={status.icon}>
          {status.label}
        </Pill>
      </div>
      <div>
        <h2 className="text-lg text-white">{integration.name}</h2>
        <p className="mt-2 text-sm leading-[1.5] text-neutral-300">{integration.purpose}</p>
      </div>
      <p className="mt-auto rounded-xl border border-navy-700 bg-navy-950/60 p-4 text-sm leading-[1.5] text-neutral-300">
        {integration.setupNote}
      </p>
    </Card>
  );
}
