export function slugify(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `post-${Date.now()}`;
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}
