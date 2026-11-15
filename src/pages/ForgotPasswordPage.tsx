import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';
import FormAlert from '@/components/ui/FormAlert';
import TextField from '@/components/ui/TextField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import { validateEmail } from '@/features/auth/validation';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const problem = validateEmail(email);
    setEmailError(problem);
    setFormError(null);
    if (problem) return;

    const trimmedEmail = email.trim();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    if (error) {
      setFormError(getAuthErrorMessage(error, 'We could not send the reset email. Please try again.'));
      return;
    }
    setSentTo(trimmedEmail);
  };

  if (sentTo) {
    return (
      <AuthCard title="Check your inbox" description="If an account exists for this address, a reset link is on its way.">
        <div className="flex flex-col items-start gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-800 bg-brand-950">
            <MailCheck className="h-6 w-6 text-brand-300" aria-hidden />
          </span>
          <p className="text-sm leading-[1.5] text-neutral-300">
            The link opens a secure page where you can choose a new password. It expires after a short time, so use it
            soon.
          </p>
          <div className="flex w-full flex-col gap-3">
            <ButtonLink to="/sign-in" size="lg" className="w-full">
              Back to sign in
            </ButtonLink>
            <Button variant="ghost" className="w-full" onClick={() => setSentTo(null)}>
              Use a different email
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter the email address on your account and we will send you a link to choose a new password."
      footer={
        <p>
          Remembered it?{' '}
          <Link to="/sign-in" className="font-medium text-brand-300 transition-colors hover:text-brand-200">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <TextField
          id="forgot-email"
          label="Email address"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          placeholder="name@example.com"
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? 'Sending link...' : 'Send reset link'}
        </Button>
      </form>
    </AuthCard>
  );
}
