/*
# Create user profiles and sign-up trigger

1. New Tables
- `profiles`: one row per registered user.
  - `id` (uuid, primary key): the matching Supabase Auth user ID.
  - `full_name` (text, required, 1 to 100 characters after trimming).
  - `created_at` (timestamp): when the profile was created.

2. Automation
- A trigger on Supabase Auth user creation writes a profile row using the full name entered at sign-up.
- Existing auth users (if any) receive a profile row once; re-running this migration is safe.

3. Security
- Row Level Security is enabled on `profiles`.
- Signed-in users can read their own profile only.
- Signed-in users can change only their own `full_name`. No other column is writable by clients.
- Clients cannot insert profiles directly; only the trigger creates them.
- The trigger function is not callable by any client role.

4. Important notes
- Deleting an auth user also deletes their profile (ON DELETE CASCADE).
- No passwords or email addresses are stored in this table.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    left(coalesce(nullif(btrim(NEW.raw_user_meta_data->>'full_name'), ''), 'FACTS member'), 100)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id, full_name)
SELECT u.id, left(coalesce(nullif(btrim(u.raw_user_meta_data->>'full_name'), ''), 'FACTS member'), 100)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;
