import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import FormAlert from '@/components/ui/FormAlert';
import PasswordField from '@/components/ui/PasswordField';
import TextField from '@/components/ui/TextField';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import { validateEmail, validateSignInPassword } from '@/features/auth/validation';
import { setRememberSession, supabase } from '@/lib/supabase';

interface SignInErrors {
  email?: string;
  password?: string;
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: SignInErrors = {
      email: validateEmail(email) ?? undefined,
      password: validateSignInPassword(password) ?? undefined,
    };
    setErrors(nextErrors);
    setFormError(null);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    setRememberSession(remember);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setFormError(getAuthErrorMessage(error, 'We could not sign you in. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to open your workspace and continue where you left off."
      footer={
        <p>
          New to FACTS?{' '}
          <Link to="/sign-up" className="font-medium text-brand-300 transition-colors hover:text-brand-200">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <TextField
          id="sign-in-email"
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
          id="sign-in-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          labelAction={
            <Link to="/forgot-password" className="text-sm font-medium text-brand-300 transition-colors hover:text-brand-200">
              Forgot password?
            </Link>
          }
        />

        <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-navy-600 bg-navy-950 accent-brand-500"
          />
          Keep me signed in on this device
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  );
}
