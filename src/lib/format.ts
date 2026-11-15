const dateTimeFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

export function formatDateTime(iso: string) {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatPublishedDate(iso: string | null) {
  if (!iso) return 'Publication date not listed';
  return `Published ${dateFormatter.format(new Date(iso))}`;
}
