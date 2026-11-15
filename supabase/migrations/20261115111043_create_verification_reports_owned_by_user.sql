/*
# Create verification reports table (owner-scoped)

1. New Tables
- `verification_reports`: one row per submission a user makes for verification.
  - `id` (uuid, primary key).
  - `user_id` (uuid, required): the owner. Defaults to the signed-in user, and must match the signed-in user.
  - `submission_type` ('text' or 'url').
  - `submitted_text` (up to 5000 characters) for text submissions.
  - `submitted_url` (up to 2048 characters) for URL submissions.
  - `status`: 'submitted', 'processing', 'completed' or 'failed'. New rows are always created as 'submitted'.
  - `created_at` and `updated_at` timestamps.

2. Security
- Row Level Security is enabled.
- Users can read only their own reports.
- Users can create reports only for themselves, and only with status 'submitted'.
- Users can delete only their own reports.
- Clients cannot change a report's status or content after creation. Status updates will come from trusted server code.
- Only the 'authenticated' role has any access. Anonymous visitors see nothing.

3. Important notes
- Deleting a user account deletes that user's reports (ON DELETE CASCADE).
- The index on (user_id, created_at) keeps each user's history fast to load.
- Re-running this migration is safe.
*/

CREATE TABLE IF NOT EXISTS public.verification_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_type text NOT NULL CHECK (submission_type IN ('text', 'url')),
  submitted_text text CHECK (char_length(submitted_text) <= 5000),
  submitted_url text CHECK (char_length(submitted_url) <= 2048),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT submission_content_matches_type CHECK (
    (submission_type = 'text' AND submitted_text IS NOT NULL AND submitted_url IS NULL)
    OR (submission_type = 'url' AND submitted_url IS NOT NULL AND submitted_text IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS verification_reports_user_created_idx
  ON public.verification_reports (user_id, created_at DESC);

ALTER TABLE public.verification_reports ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.verification_reports TO authenticated;

DROP POLICY IF EXISTS "select_own_reports" ON public.verification_reports;
CREATE POLICY "select_own_reports" ON public.verification_reports FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_submitted_reports" ON public.verification_reports;
CREATE POLICY "insert_own_submitted_reports" ON public.verification_reports FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'submitted');

DROP POLICY IF EXISTS "delete_own_reports" ON public.verification_reports;
CREATE POLICY "delete_own_reports" ON public.verification_reports FOR DELETE
TO authenticated USING (auth.uid() = user_id);
