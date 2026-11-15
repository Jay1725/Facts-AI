import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, MailCheck } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';
import FormAlert from '@/components/ui/FormAlert';
import PasswordField from '@/components/ui/PasswordField';
import TextField from '@/components/ui/TextField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import {
  PASSWORD_REQUIREMENTS,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validateNewPassword,
} from '@/features/auth/validation';
import { supabase } from '@/lib/supabase';

interface SignUpErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

const DUPLICATE_MESSAGE = 'An account with this email already exists. Sign in instead.';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: SignUpErrors = {
      fullName: validateFullName(fullName) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validateNewPassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirm) ?? undefined,
    };
    setErrors(nextErrors);
    setFormError(null);
    if (Object.values(nextErrors).some(Boolean)) return;

    const trimmedEmail = email.trim();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setFormError(getAuthErrorMessage(error, 'We could not create your account. Please try again.'));
      setSubmitting(false);
      return;
    }

    if (data.user && data.user.identities?.length === 0) {
      setFormError(DUPLICATE_MESSAGE);
      setSubmitting(false);
      return;
    }

    if (!data.session) {
      setPendingEmail(trimmedEmail);
    }
    setSubmitting(false);
  };

  if (pendingEmail) {
    return (
      <AuthCard title="Check your inbox" description="Your account has been created. One more step to activate it.">
        <div className="flex flex-col items-start gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-success-800 bg-success-900/50">
            <MailCheck className="h-6 w-6 text-success-300" aria-hidden />
          </span>
          <p className="text-sm leading-[1.5] text-neutral-300">
            We sent a confirmation link to <span className="font-medium text-white">{pendingEmail}</span>. Open it to
            verify your address, then sign in.
          </p>
          <ButtonLink to="/sign-in" size="lg" className="w-full">
            Go to sign in
          </ButtonLink>
        </div>
      </AuthCard>
    );
  }

  const requirementStates = PASSWORD_REQUIREMENTS.map((rule) => ({ label: rule.label, met: rule.test(password) }));

  return (
    <AuthCard
      title="Create your account"
      description="Start checking claims against live evidence. Your reports stay private to you."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-brand-300 transition-colors hover:text-brand-200">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <TextField
          id="sign-up-name"
          label="Full name"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.fullName}
          placeholder="Jordan Lee"
        />

        <TextField
          id="sign-up-email"
          label="Email address"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          placeholder="name@example.com"
        />

        <PasswordField
          id="sign-up-password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={
            <ul className="mt-1 grid gap-1.5 sm:grid-cols-2">
              {requirementStates.map((rule) => {
                const Icon = rule.met ? CheckCircle2 : Circle;
                return (
                  <li key={rule.label} className={`flex items-center gap-2 ${rule.met ? 'text-success-300' : ''}`}>
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          }
        />

        <PasswordField
          id="sign-up-confirm"
          label="Confirm password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  );
}
