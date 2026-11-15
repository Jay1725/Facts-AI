const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email or password is incorrect.',
  email_not_confirmed: 'Confirm your email address first. Check your inbox for the confirmation link.',
  user_already_exists: 'An account with this email already exists. Sign in instead.',
  email_exists: 'An account with this email already exists. Sign in instead.',
  weak_password: 'That password is too weak. Choose a stronger one.',
  same_password: 'Your new password must be different from your current password.',
  over_request_rate_limit: 'Too many attempts. Wait a few minutes and try again.',
  over_email_send_rate_limit: 'Too many emails have been requested. Wait a few minutes and try again.',
  session_not_found: 'Your session has expired. Sign in again to continue.',
  session_expired: 'Your session has expired. Sign in again to continue.',
  refresh_token_not_found: 'Your session has expired. Sign in again to continue.',
};

const NETWORK_MESSAGE = 'Cannot reach the account service. Check your connection and try again.';

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof TypeError) return NETWORK_MESSAGE;
  if (typeof error !== 'object' || error === null) return fallback;

  const { code, name } = error as { code?: unknown; name?: unknown };
  if (name === 'AuthRetryableFetchError') return NETWORK_MESSAGE;
  if (typeof code === 'string' && MESSAGES[code]) return MESSAGES[code];
  return fallback;
}
