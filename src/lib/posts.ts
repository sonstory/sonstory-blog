import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostsByCategory(posts: CollectionEntry<'posts'>[], categorySlug: string) {
  return posts.filter((post) => post.id.startsWith(`${categorySlug}/`));
}

export function getPostsByTag(posts: CollectionEntry<'posts'>[], tag: string) {
  return posts.filter((post) => post.data.tags.includes(tag));
}

export interface TagCount {
  tag: string;
  count: number;
}

export function getTagCounts(posts: CollectionEntry<'posts'>[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
