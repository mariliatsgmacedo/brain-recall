function baseTitle(title: string) {
  return title.replace(/\s*\(.*?\)\s*$/, '').trim();
}

export function groupKey(title: string) {
  return baseTitle(title || 'Sem título').toLowerCase();
}

export function groupSlug(title: string) {
  const base = baseTitle(title || 'Sem título')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return base || 'sem-titulo';
}
