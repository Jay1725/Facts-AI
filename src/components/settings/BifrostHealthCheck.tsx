import { useState } from 'react';
import { Loader2, Plug } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormAlert from '@/components/ui/FormAlert';
import Pill, { type PillTone } from '@/components/ui/Pill';
import {
  runBifrostHealthCheck,
  type BifrostHealthResponse,
} from '@/features/integrations/bifrostHealthService';

type CheckState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: BifrostHealthResponse }
  | { status: 'error'; message: string };

const CONNECTION_META: Record<CheckState['status'], { label: string; tone: PillTone }> = {
  idle: { label: 'Not tested', tone: 'brand' },
  loading: { label: 'Testing', tone: 'brand' },
  success: { label: 'Connected', tone: 'success' },
  error: { label: 'Error', tone: 'danger' },
};

export default function BifrostHealthCheck() {
  const [state, setState] = useState<CheckState>({ status: 'idle' });
  const isLoading = state.status === 'loading';
  const connection = CONNECTION_META[state.status];

  async function handleCheck() {
    setState({ status: 'loading' });
    try {
      const data = await runBifrostHealthCheck();
      setState({ status: 'success', data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The gateway check could not be completed.';
      setState({ status: 'error', message });
    }
  }

  return (
    <Card className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg text-white">Test AI gateway</h2>
          <p className="mt-2 text-sm leading-[1.5] text-neutral-300">
            Sends a real message through Bifrost to the configured AI model and shows the reply.
          </p>
        </div>
        <Pill tone={connection.tone}>{connection.label}</Pill>
      </div>

      <div>
        <Button type="button" onClick={handleCheck} disabled={isLoading} className="h-12 px-6">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Checking
            </>
          ) : (
            <>
              <Plug className="h-4 w-4" aria-hidden />
              Run gateway check
            </>
          )}
        </Button>
      </div>

      {state.status === 'error' && <FormAlert tone="error">{state.message}</FormAlert>}

      {state.status === 'success' && (
        <div className="flex flex-col gap-3 rounded-xl border border-navy-700 bg-navy-950/60 p-4 text-sm text-neutral-300">
          <p>
            <span className="text-neutral-400">Model: </span>
            {state.data.model}
          </p>
          <p>
            <span className="text-neutral-400">Reply: </span>
            {state.data.reply}
          </p>
          <p className="text-xs text-neutral-400">
            Answered in {(state.data.responseTime / 1000).toFixed(2)} seconds
            {state.data.matchesExpected ? '' : ' (the reply differed from the expected text, but the model responded)'}
          </p>
        </div>
      )}
    </Card>
  );
}
