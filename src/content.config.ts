import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, type CategorySlug } from './consts';

const categorySlugs = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

const posts = defineCollection({
  // 각 글은 src/content/posts/<category>/<slug>/index.md.
  // glob 로더는 파일명이 index.md일 때 슬러그 끝의 "/index"를 자동으로 제거하므로
  // entry.id는 "<category>/<slug>" 형태가 된다.
  loader: glob({ pattern: '**/index.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // 검색 결과 스니펫에 쓰이므로 공백 포함 150자 내외 권장 (docs/POSTING.md 참조)
      description: z.string().max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(categorySlugs),
      tags: z.array(z.string()).default([]),
      // 글 최상단에 항상 표시되는 썸네일. 같은 폴더의 이미지를 상대경로로 지정한다 (예: "./thumb.png")
      heroImage: image(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
