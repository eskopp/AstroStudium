// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCallouts from './plugins/remark-callouts.mjs';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  markdown: {
    remarkPlugins: [remarkMath, remarkCallouts],
    rehypePlugins: [rehypeKatex],
  },
});
