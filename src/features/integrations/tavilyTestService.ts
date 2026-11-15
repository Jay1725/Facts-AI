import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface TavilyTestResult {
  title: string;
  url: string;
  content: string;
  score: number | null;
  publishedDate: string | null;
}

export interface TavilyTestResponse {
  query: string;
  responseTime: number | null;
  results: TavilyTestResult[];
}

const GENERIC_ERROR = 'The search could not be completed. Please try again.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTestResult(value: unknown): value is TavilyTestResult {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    typeof value.content === 'string' &&
    (value.score === null || typeof value.score === 'number') &&
    (value.publishedDate === null || typeof value.publishedDate === 'string')
  );
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

export async function runTavilyTestSearch(query: string): Promise<TavilyTestResponse> {
  const { data, error } = await supabase.functions.invoke('tavily-test-search', { body: { query } });
  if (error) throw new Error(await readErrorMessage(error));

  if (
    !isRecord(data) ||
    typeof data.query !== 'string' ||
    !(data.responseTime === null || typeof data.responseTime === 'number') ||
    !Array.isArray(data.results) ||
    !data.results.every(isTestResult)
  ) {
    throw new Error('The search returned an unexpected response.');
  }

  return {
    query: data.query,
    responseTime: data.responseTime,
    results: data.results,
  };
}
