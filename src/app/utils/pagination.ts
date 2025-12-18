export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(count: number, pageSize: number) {
  return Math.max(1, Math.ceil(count / pageSize));
}
