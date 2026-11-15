export const MIN_TEXT_LENGTH = 10;
export const MAX_TEXT_LENGTH = 5000;

export type SubmissionInput = { mode: 'text'; text: string } | { mode: 'url'; url: string };

export function validateTextSubmission(raw: string): string | null {
  const text = raw.trim();
  if (!text) return 'Enter a claim or some text to check.';
  if (text.length < MIN_TEXT_LENGTH) return 'Add a little more detail so there is something specific to verify.';
  if (text.length > MAX_TEXT_LENGTH) return `Keep submissions under ${MAX_TEXT_LENGTH.toLocaleString()} characters.`;
  return null;
}

const PRIVATE_IPV4 = /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

export function validateUrlSubmission(raw: string): string | null {
  const value = raw.trim();
  if (!value) return 'Paste the link to an article or web page.';

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'That does not look like a valid web address. Include the full link, such as https://example.com/article.';
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'Only http and https links can be checked.';
  }

  const host = url.hostname.toLowerCase();
  const isLocal = host === 'localhost' || host.endsWith('.local') || host === '[::1]';
  if (isLocal || PRIVATE_IPV4.test(host) || !host.includes('.')) {
    return 'Private or local addresses cannot be checked. Use a public web address.';
  }

  return null;
}
