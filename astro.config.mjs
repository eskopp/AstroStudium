// @ts-check
import { defineConfig } from 'astro/config';
import astrostudium from './integration/index.mjs';

export default defineConfig({
  integrations: [
    astrostudium({
      name: 'AstroStudium',
      menu: [
        {
          label: 'Studium',
          children: [
            { label: 'Physik', href: '/physik/' },
            { label: 'Mathematik', href: '/mathematik/' },
          ],
        },
        { label: 'Praktika', href: '/physik/optik/' },
      ],
    }),
  ],
});
