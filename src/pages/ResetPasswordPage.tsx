import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';
import FormAlert from '@/components/ui/FormAlert';
import PasswordField from '@/components/ui/PasswordField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import {
  PASSWORD_REQUIREMENTS,
  validateConfirmPassword,
  validateNewPassword,
} from '@/features/auth/validation';
import { useAuth } from '@/features/auth/useAuth';
import { supabase } from '@/lib/supabase';

interface ResetErrors {
  password?: string;
  confirm?: string;
}

export default function ResetPasswordPage() {
  const { session, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: ResetErrors = {
      password: validateNewPassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirm) ?? undefined,
    };
    setErrors(nextErrors);
    setFormError(null);
    if (nextErrors.password || nextErrors.confirm) return;

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setFormError(getAuthErrorMessage(error, 'Your password could not be updated. Please try again.'));
      setSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <AuthCard title="Password updated" description="Your password has been changed. Sign in with your new password.">
        <div className="flex flex-col items-start gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-success-800 bg-success-900/50">
            <CheckCircle2 className="h-6 w-6 text-success-300" aria-hidden />
          </span>
          <ButtonLink to="/sign-in" size="lg" className="w-full">
            Sign in
          </ButtonLink>
        </div>
      </AuthCard>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-300" aria-label="Checking your reset link" />
      </div>
    );
  }

  if (!session) {
    return (
      <AuthCard
        title="This link has expired"
        description="Reset links can only be used once and expire after a short time. Request a new one to continue."
      >
        <ButtonLink to="/forgot-password" size="lg" className="w-full">
          Request a new link
        </ButtonLink>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" description="Enter a new password for your account.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <PasswordField
          id="reset-password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={
            <span>
              {PASSWORD_REQUIREMENTS.map((rule) => rule.label).join(' · ')}
            </span>
          }
        />

        <PasswordField
          id="reset-confirm"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? 'Updating password...' : 'Update password'}
        </Button>
      </form>
    </AuthCard>
  );
}
