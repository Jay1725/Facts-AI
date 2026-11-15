import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface BifrostHealthResponse {
  reply: string;
  matchesExpected: boolean;
  model: string;
  responseTime: number;
}

const GENERIC_ERROR = 'The gateway check could not be completed. Please try again.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readErrorMessage(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body: unknown = await error.context.json();
      if (isRecord(body) && typeof body.error === 'string') return body.error;
    } catch {
      return GENERIC_ERROR;
    }
  }
  return GENERIC_ERROR;
}

export async function runBifrostHealthCheck(): Promise<BifrostHealthResponse> {
  const { data, error } = await supabase.functions.invoke('bifrost-health', { body: {} });
  if (error) throw new Error(await readErrorMessage(error));

  if (
    !isRecord(data) ||
    typeof data.reply !== 'string' ||
    typeof data.matchesExpected !== 'boolean' ||
    typeof data.model !== 'string' ||
    typeof data.responseTime !== 'number'
  ) {
    throw new Error('The gateway check returned an unexpected response.');
  }

  return {
    reply: data.reply,
    matchesExpected: data.matchesExpected,
    model: data.model,
    responseTime: data.responseTime,
  };
}
