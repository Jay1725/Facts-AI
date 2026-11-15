import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormAlert from '@/components/ui/FormAlert';
import TextField from '@/components/ui/TextField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import { useAuth } from '@/features/auth/useAuth';
import { updateFullName } from '@/features/auth/profileService';
import { validateFullName } from '@/features/auth/validation';

export default function ProfileNameForm() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.fullName ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const problem = validateFullName(name);
    setNameError(problem);
    setError(null);
    setSuccess(false);
    if (problem) return;

    setSubmitting(true);
    try {
      await updateFullName(user.id, name.trim());
      await refreshProfile();
      setSuccess(true);
    } catch (updateError) {
      setError(getAuthErrorMessage(updateError, 'Your name could not be updated. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg text-white">Your name</h2>
      <p className="mt-1 text-sm text-neutral-300">This is how your name appears across FACTS.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        {error && <FormAlert tone="error">{error}</FormAlert>}
        {success && <FormAlert tone="success">Your name has been updated.</FormAlert>}

        <TextField
          id="profile-name"
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSuccess(false);
          }}
          error={nameError}
        />

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitting ? 'Saving...' : 'Save name'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
