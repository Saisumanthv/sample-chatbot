export function sanitizeMessage(raw) {
  if (typeof raw !== 'string') return '';
  return raw.trim();
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

