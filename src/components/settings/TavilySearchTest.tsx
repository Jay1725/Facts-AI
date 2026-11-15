import { useState, type FormEvent } from 'react';
import { ExternalLink, Loader2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormAlert from '@/components/ui/FormAlert';
import Pill, { type PillTone } from '@/components/ui/Pill';
import TextField from '@/components/ui/TextField';
import { formatPublishedDate } from '@/lib/format';
import {
  runTavilyTestSearch,
  type TavilyTestResponse,
} from '@/features/integrations/tavilyTestService';

const DEFAULT_QUERY = 'Latest developments in artificial intelligence in 2026.';

type TestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TavilyTestResponse }
  | { status: 'error'; message: string };

const CONNECTION_META: Record<TestState['status'], { label: string; tone: PillTone }> = {
  idle: { label: 'Not tested', tone: 'brand' },
  loading: { label: 'Testing', tone: 'brand' },
  success: { label: 'Connected', tone: 'success' },
  error: { label: 'Error', tone: 'danger' },
};

export default function TavilySearchTest() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [state, setState] = useState<TestState>({ status: 'idle' });
  const [queryError, setQueryError] = useState<string | null>(null);

  const isLoading = state.status === 'loading';
  const connection = CONNECTION_META[state.status];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setQueryError('Enter a search query to test.');
      return;
    }
    setQueryError(null);
    setState({ status: 'loading' });

    try {
      const data = await runTavilyTestSearch(trimmed);
      setState({ status: 'success', data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The search could not be completed.';
      setState({ status: 'error', message });
    }
  }

  return (
    <Card className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg text-white">Test live web research</h2>
          <p className="mt-2 text-sm leading-[1.5] text-neutral-300">
            Sends a real search to Tavily from the server and shows what comes back.
          </p>
        </div>
        <Pill tone={connection.tone}>{connection.label}</Pill>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextField
            id="tavily-test-query"
            label="Search query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            error={queryError}
            maxLength={200}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-12 shrink-0 px-6">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Searching
            </>
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden />
              Test search
            </>
          )}
        </Button>
      </form>

      {state.status === 'error' && <FormAlert tone="error">{state.message}</FormAlert>}

      {state.status === 'success' && state.data.results.length === 0 && (
        <FormAlert tone="info">Tavily responded, but returned no results for this query.</FormAlert>
      )}

      {state.status === 'success' && state.data.results.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-300">
            {state.data.results.length} result{state.data.results.length === 1 ? '' : 's'}
            {state.data.responseTime !== null && ` in ${state.data.responseTime.toFixed(2)} seconds`}
          </p>
          <ul className="flex flex-col gap-3">
            {state.data.results.map((result) => (
              <li key={result.url} className="rounded-xl border border-navy-700 bg-navy-950/60 p-4">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-3 text-brand-200 transition-colors hover:text-white"
                >
                  <span className="font-medium leading-[1.4]">{result.title}</span>
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
                <p className="mt-1 break-all text-xs text-neutral-400">{result.url}</p>
                {result.content && (
                  <p className="mt-3 line-clamp-3 text-sm leading-[1.5] text-neutral-300">{result.content}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-400">
                  <span>{formatPublishedDate(result.publishedDate)}</span>
                  {result.score !== null && <span>Relevance {result.score.toFixed(2)}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
