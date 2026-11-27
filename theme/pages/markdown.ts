import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const toPath = (id: string) => id.replace(/(^|\/)index$/, '');

export async function getStaticPaths() {
  const entries = await getCollection('docs');
  return entries
    .map((entry) => ({ entry, path: toPath(entry.id) }))
    .filter(({ path }) => path !== '')
    .map(({ entry, path }) => ({ params: { slug: path }, props: { entry } }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props;
  const body = (entry.body ?? '')
    .split('\n')
    .filter((line) => !/^import\s.+\sfrom\s['"].+['"];?\s*$/.test(line) && !/^<[A-Z][A-Za-z0-9]*(\s[^>]*)?\/>\s*$/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const lead = entry.data.description ? `\n\n${entry.data.description}` : '';
  return new Response(`# ${entry.data.title}${lead}\n\n${body}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
