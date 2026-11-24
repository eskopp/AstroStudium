# AstroStudium

An Astro theme for study notes: lectures, exercises, homework series and labs on one site. The look is inspired by [Hextra](https://github.com/imfing/hextra), but the navigation is built to stay readable when a site grows to dozens of modules.

## Features

- **Module-scoped sidebar.** The sidebar only shows the module you are in, so other modules never clutter it.
- **Module tabs.** A module can have a Skript, Übung, Hausaufgaben and Praktikum part. Each existing part becomes a tab, and the sidebar then shows only the tree of the active tab.
- **Configurable header menu** with dropdowns, set in `astro.config.mjs`.
- **No table of contents column.** The article gets the full width.
- Breadcrumbs, overview tiles, previous and next links inside a tab.
- KaTeX formulas, Hextra style callouts (`> [!NOTE] Title`), dark mode.
- Full text search with [Pagefind](https://pagefind.app), built automatically.

## Requirements

Astro 7 and Node 22 or newer.

## Install

```bash
npm install --allow-git=all astro github:eskopp/AstroStudium
```

Recent npm versions (seen with npm 12) block Git dependencies by default, so the `--allow-git=all` flag is needed. To make it permanent for a project, add `allow-git=all` to its `.npmrc`. The package is not on the npm registry yet.

## Setup

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import astrostudium from 'astrostudium';

export default defineConfig({
  integrations: [
    astrostudium({
      name: 'My Studies',
      menu: [
        {
          label: 'Studies',
          children: [
            { label: 'Physics', href: '/physik/' },
            { label: 'Mathematics', href: '/mathematik/' },
          ],
        },
        { label: 'Labs', href: '/praktika/' },
      ],
    }),
  ],
});
```

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from 'astrostudium/content';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: docsSchema,
});

export const collections = { docs };
```

The integration adds the start page and all content routes, the styles, math and callout support and the search index. Put a `favicon.svg` into `public/`.

## Content structure

All content lives in `src/content/docs`. Folders are levels of the navigation. Every folder needs an `index.md` with a title.

```
src/content/docs/
  physik/                    area, shown in the header menu
    index.md
    mechanik/                module, the sidebar scope
      index.md
      skript/                tab "Skript"
        index.md
        bezugssysteme/
          index.md
          inertialsysteme.md
      uebung/                tab "Übung"
        index.md
        blatt-1.md
      hausaufgaben/          tab "Hausaufgaben"
      praktikum/             tab "Praktikum"
```

Frontmatter:

```yaml
---
title: Inertial systems       # required
description: Short summary    # optional, shown on overview tiles
weight: 1                     # optional, lower comes first, default 100
---
```

A module without these folders works too. It then shows no tabs, and the sidebar lists its pages directly.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `name` | `'AstroStudium'` | Site name in the header and page titles |
| `menu` | `[]` | Header menu. Items have `label`, optional `href` and optional `children` for a dropdown |
| `moduleKinds` | `['skript', 'uebung', 'hausaufgaben', 'praktikum']` | Folder names inside a module that become tabs, in this order |

The tab label is the `title` of the folder's `index.md`.

## Callouts

```md
> [!NOTE] Definition
> Text with a formula $x^2$.
```

Types are `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`. The title after the type is optional.

## Search

`astro build` creates the Pagefind index in `dist/pagefind`. The search works in the built site (`astro preview`), not in `astro dev`.

## Markdown processor

The integration sets `markdown.processor` to `unified` from `@astrojs/markdown-remark` to run its remark and rehype plugins. If you set your own processor, add `remark-math`, `rehype-katex` and the callout plugin yourself or remove yours.

## Development

This repository is the theme and a demo site at once. The demo content in `src/content/docs` is placeholder text.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

- `integration/`: the Astro integration, the callout plugin and the content schema
- `theme/`: layouts, components, styles and the injected pages

## License

MIT
