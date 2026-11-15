const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'Includes a letter', test: (value: string) => /[a-zA-Z]/.test(value) },
  { label: 'Includes a number', test: (value: string) => /\d/.test(value) },
  { label: '72 characters or fewer', test: (value: string) => value.length <= 72 },
];

export function validateFullName(raw: string): string | null {
  const name = raw.trim();
  if (!name) return 'Enter your full name.';
  if (name.length < 2) return 'Enter at least 2 characters.';
  if (name.length > 100) return 'Keep your name under 100 characters.';
  return null;
}

export function validateEmail(raw: string): string | null {
  const email = raw.trim();
  if (!email) return 'Enter your email address.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address, such as name@example.com.';
  }
  return null;
}

export function validateNewPassword(value: string): string | null {
  const failed = PASSWORD_REQUIREMENTS.find((rule) => !rule.test(value));
  return failed ? `Password must meet this requirement: ${failed.label.toLowerCase()}.` : null;
}

export function validateConfirmPassword(password: string, confirmation: string): string | null {
  if (!confirmation) return 'Re-enter your password to confirm it.';
  if (password !== confirmation) return 'Passwords do not match.';
  return null;
}

export function validateSignInPassword(value: string): string | null {
  return value ? null : 'Enter your password.';
}
