/*
# Store verification results on each report

1. Modified Tables
- `verification_reports`
  - `summary` (text, nullable): short overview written after research finishes.
  - `claims` (jsonb, not null, default empty list): one entry per checked claim, with sources and evidence collected from live web search.
  - `error_message` (text, nullable): a plain-language reason when research could not finish.

2. Security
- No new policies. Existing owner-only SELECT policy covers the new columns.
- Clients still cannot change report content or status: only the trusted server function (service_role) can update these columns.
- Grants service_role SELECT and UPDATE on verification_reports so the server function can record results.

3. Important notes
- Re-running this migration is safe.
- Existing reports get an empty claims list and no summary.
*/

ALTER TABLE public.verification_reports ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.verification_reports ADD COLUMN IF NOT EXISTS claims jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.verification_reports ADD COLUMN IF NOT EXISTS error_message text;

GRANT SELECT, UPDATE ON public.verification_reports TO service_role;
