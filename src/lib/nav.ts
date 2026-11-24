import { getCollection } from 'astro:content';

export type NavNode = {
  title: string;
  description?: string;
  weight: number;
  path: string;
  href: string;
  hasPage: boolean;
  children: NavNode[];
};

const hrefOf = (path: string) => (path ? `/${path}/` : '/');

const prettify = (segment: string) =>
  segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

let cached: NavNode | undefined;

export async function getTree(): Promise<NavNode> {
  if (cached) return cached;

  const entries = await getCollection('docs');
  const nodes = new Map<string, NavNode>();

  const ensure = (path: string): NavNode => {
    let node = nodes.get(path);
    if (!node) {
      const last = path.split('/').pop() ?? '';
      node = { title: prettify(last), weight: 100, path, href: hrefOf(path), hasPage: false, children: [] };
      nodes.set(path, node);
      if (path) ensure(path.split('/').slice(0, -1).join('/')).children.push(node);
    }
    return node;
  };

  ensure('');
  for (const entry of entries) {
    const path = entry.id.replace(/(^|\/)index$/, '');
    const node = ensure(path);
    node.title = entry.data.title;
    node.description = entry.data.description;
    node.weight = entry.data.weight;
    node.hasPage = true;
  }

  for (const node of nodes.values()) {
    node.children.sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title, 'de'));
  }

  cached = nodes.get('')!;
  return cached;
}

export function findNode(root: NavNode, path: string): NavNode | undefined {
  let node: NavNode | undefined = root;
  for (const segment of path.split('/').filter(Boolean)) {
    node = node.children.find((child) => child.path.split('/').pop() === segment);
    if (!node) return undefined;
  }
  return node;
}

export function breadcrumbs(root: NavNode, path: string): NavNode[] {
  const segments = path.split('/').filter(Boolean);
  const crumbs: NavNode[] = [];
  for (let i = 1; i <= segments.length; i++) {
    const node = findNode(root, segments.slice(0, i).join('/'));
    if (node) crumbs.push(node);
  }
  return crumbs;
}

/** Sidebar scope: the module (depth 2) of the current page, or the section (depth 1) itself. */
export function sidebarScope(root: NavNode, path: string): { parent?: NavNode; scope?: NavNode } {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return {};
  const section = findNode(root, segments[0]);
  if (segments.length === 1) return { scope: section };
  return { parent: section, scope: findNode(root, segments.slice(0, 2).join('/')) };
}

export function leaves(node: NavNode): NavNode[] {
  if (node.children.length === 0) return node.hasPage ? [node] : [];
  return node.children.flatMap(leaves);
}
