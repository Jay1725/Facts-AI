import { useState, type FormEvent } from 'react';
import { ArrowRight, FileText, Link2, Loader2, type LucideIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/classNames';
import {
  MAX_TEXT_LENGTH,
  validateTextSubmission,
  validateUrlSubmission,
  type SubmissionInput,
} from '@/features/verification/validation';

type Mode = SubmissionInput['mode'];

const MODES: { value: Mode; label: string; icon: LucideIcon; hint: string }[] = [
  { value: 'text', label: 'Text or claim', icon: FileText, hint: 'Paste a paragraph, article excerpt or single statement.' },
  { value: 'url', label: 'Web page URL', icon: Link2, hint: 'Submit the link to an article or web page.' },
];

interface SubmissionFormProps {
  onSubmit: (input: SubmissionInput) => Promise<void>;
}

export default function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [mode, setMode] = useState<Mode>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const submit = async (input: SubmissionInput) => {
    setSaving(true);
    try {
      await onSubmit(input);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Your submission could not be saved.');
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (mode === 'text') {
      const problem = validateTextSubmission(text);
      if (problem) return setError(problem);
      setError(null);
      void submit({ mode, text: text.trim() });
      return;
    }
    const problem = validateUrlSubmission(url);
    if (problem) return setError(problem);
    setError(null);
    void submit({ mode, url: url.trim() });
  };

  const activeHint = MODES.find((item) => item.value === mode)?.hint;
  const isTextMode = mode === 'text';
  const currentLength = isTextMode ? text.length : url.length;

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
        <div className="border-b border-navy-800 p-4 sm:p-5">
          <div role="tablist" aria-label="Submission type" className="inline-flex rounded-xl bg-navy-950 p-1">
            {MODES.map((item) => {
              const selected = item.value === mode;
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  id={`tab-${item.value}`}
                  aria-selected={selected}
                  aria-controls="submission-panel"
                  onClick={() => selectMode(item.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
                    selected ? 'bg-navy-700 text-white shadow-sm' : 'text-neutral-300 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-neutral-300">{activeHint}</p>
        </div>

        <div id="submission-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="p-4 sm:p-5">
          {isTextMode ? (
            <div>
              <label htmlFor="submission-text" className="sr-only">
                Text or claim to verify
              </label>
              <textarea
                id="submission-text"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  if (error) setError(null);
                }}
                rows={8}
                maxLength={MAX_TEXT_LENGTH + 500}
                placeholder="For example: The bridge reopened to traffic in March 2024 after a two-year closure."
                aria-invalid={error ? true : undefined}
                aria-describedby="submission-help"
                className="w-full resize-y rounded-xl border border-navy-700 bg-navy-950 px-4 py-3 text-base leading-[1.5] text-white placeholder:text-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="submission-url" className="text-sm font-medium text-neutral-200">
                Article or web page address
              </label>
              <input
                id="submission-url"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://www.example.com/article"
                aria-invalid={error ? true : undefined}
                aria-describedby="submission-help"
                className="mt-2 h-12 w-full rounded-xl border border-navy-700 bg-navy-950 px-4 text-base text-white placeholder:text-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              />
            </div>
          )}

          <div id="submission-help" className="mt-3 min-h-5 text-sm">
            {error ? (
              <p role="alert" className="text-danger-300">
                {error}
              </p>
            ) : (
              <p className="text-neutral-400">
                {isTextMode
                  ? `${currentLength.toLocaleString()} / ${MAX_TEXT_LENGTH.toLocaleString()} characters`
                  : 'Only public http or https addresses can be checked.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-navy-800 bg-navy-900/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-neutral-400">Every claim is checked against live sources before a verdict is given.</p>
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={saving}>
            {saving ? 'Saving submission...' : 'Start verification'}
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
          </Button>
        </div>
      </form>
    </Card>
  );
}
