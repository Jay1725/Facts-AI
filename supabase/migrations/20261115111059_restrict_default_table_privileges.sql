/*
# Restrict default table privileges to the minimum needed

1. Background
- Supabase grants every privilege on new public tables to the 'anon' and 'authenticated' roles by default.
- Row Level Security already limits which rows each user sees, but these extra privileges are not needed by the app.

2. Changes
- `profiles`: removes all privileges from 'anon' and 'authenticated', then grants back only SELECT, and UPDATE on full_name.
- `verification_reports`: removes all privileges from 'anon' and 'authenticated', then grants back only SELECT, INSERT and DELETE to 'authenticated'.
- Anonymous visitors have no access to either table.

3. Security effect
- Clients cannot insert or edit profile fields other than full_name.
- Clients cannot edit report status, content or ownership.

4. Important notes
- Only privileges are changed. No data is modified or deleted.
- Re-running this migration is safe.
*/

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;

REVOKE ALL ON public.verification_reports FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.verification_reports TO authenticated;
