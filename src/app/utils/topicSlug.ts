import type { Topic } from '../../domain/topic';

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function buildTopicSlug(topic: Topic) {
  const slug = slugifyTitle(topic.title);
  return slug ? `${slug}-${topic.id}` : topic.id;
}

export function extractIdFromSlug(slug: string) {
  const match = slug.match(/[0-9a-fA-F-]{36}$/);
  return match?.[0] ?? slug;
}
