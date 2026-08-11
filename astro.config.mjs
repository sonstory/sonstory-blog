// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonstory.kr',
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      useDarkModeMediaQuery: false,
    }),
    sitemap(),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Astro 7 기본 마크다운 파이프라인은 remark/rehype이 아니라
    // 자체 Rust 프로세서(@astrojs/markdown-satteri)다.
    // KaTeX(remark-math/rehype-katex)를 쓰려면 remark/rehype 파이프라인으로
    // 명시적으로 전환해야 한다.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
