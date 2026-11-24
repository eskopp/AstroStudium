import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as pagefind from 'pagefind';
import remarkCallouts from './remark-callouts.mjs';

const VIRTUAL_ID = 'virtual:astrostudium/config';

const defaults = {
  name: 'AstroStudium',
  menu: null,
  logo: '',
  editUrl: '',
  moduleKinds: ['skript', 'uebung', 'hausaufgaben', 'praktikum'],
};

const themeFile = (path) => fileURLToPath(new URL(`../theme/${path}`, import.meta.url));

function virtualConfig(config) {
  return {
    name: 'astrostudium-config',
    resolveId: (id) => (id === VIRTUAL_ID ? `\0${VIRTUAL_ID}` : undefined),
    load: (id) => (id === `\0${VIRTUAL_ID}` ? `export default ${JSON.stringify(config)};` : undefined),
  };
}

export default function astrostudium(options = {}) {
  const config = { ...defaults, ...options };

  return {
    name: 'astrostudium',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        updateConfig({
          vite: { plugins: [tailwindcss(), virtualConfig(config)], ssr: { noExternal: ['astrostudium'] } },
          markdown: {
            processor: unified({ remarkPlugins: [remarkMath, remarkCallouts], rehypePlugins: [rehypeKatex] }),
          },
        });
        injectRoute({ pattern: '/', entrypoint: themeFile('pages/index.astro') });
        injectRoute({ pattern: '/[...slug]', entrypoint: themeFile('pages/[...slug].astro') });
      },
      'astro:build:done': async ({ dir }) => {
        const site = fileURLToPath(dir);
        const { index } = await pagefind.createIndex({ excludeSelectors: [".katex"] });
        await index.addDirectory({ path: site });
        await index.writeFiles({ outputPath: `${site}pagefind` });
        await pagefind.close();
      },
    },
  };
}
