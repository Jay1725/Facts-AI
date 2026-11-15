import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormAlert from '@/components/ui/FormAlert';
import PasswordField from '@/components/ui/PasswordField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import { useAuth } from '@/features/auth/useAuth';
import {
  PASSWORD_REQUIREMENTS,
  validateConfirmPassword,
  validateNewPassword,
  validateSignInPassword,
} from '@/features/auth/validation';
import { supabase } from '@/lib/supabase';

interface PasswordErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

export default function PasswordChangeForm() {
  const { user } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: PasswordErrors = {
      current: validateSignInPassword(current) ?? undefined,
      next: validateNewPassword(next) ?? undefined,
      confirm: validateConfirmPassword(next, confirm) ?? undefined,
    };
    setErrors(nextErrors);
    setFormError(null);
    setSuccess(false);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (!user.email) {
      setFormError('Your account has no email address, so the password cannot be changed here.');
      return;
    }

    setSubmitting(true);
    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (reauthError) {
      setErrors({ current: 'Your current password is incorrect.' });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    setSubmitting(false);
    if (error) {
      setFormError(getAuthErrorMessage(error, 'Your password could not be changed. Please try again.'));
      return;
    }

    setCurrent('');
    setNext('');
    setConfirm('');
    setSuccess(true);
  };

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg text-white">Change password</h2>
      <p className="mt-1 text-sm text-neutral-300">Enter your current password to set a new one.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        {success && <FormAlert tone="success">Your password has been changed.</FormAlert>}

        <PasswordField
          id="password-current"
          label="Current password"
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          error={errors.current}
        />

        <PasswordField
          id="password-new"
          label="New password"
          autoComplete="new-password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          error={errors.next}
          hint={PASSWORD_REQUIREMENTS.map((rule) => rule.label).join(' · ')}
        />

        <PasswordField
          id="password-confirm"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitting ? 'Updating...' : 'Update password'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
