import { getCollection } from 'astro:content';
import config from 'virtual:astrostudium/config';

const moduleKinds = config.moduleKinds;

export type NavNode = {
  title: string;
  description?: string;
  abgabe?: Date;
  status?: 'offen' | 'in-arbeit' | 'abgegeben';
  bereich?: string;
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
let nodeMap: Map<string, NavNode> | undefined;

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
    node.abgabe = entry.data.abgabe;
    node.status = entry.data.status;
    node.bereich = entry.data.bereich;
    node.weight = entry.data.weight;
    node.hasPage = true;
  }

  // A module with `bereich` lives directly under the site root (flat URL) but is listed under that section.
  for (const node of [...nodes.values()]) {
    if (!node.bereich) continue;
    const section = nodes.get(node.bereich);
    if (!section) throw new Error(`Bereich "${node.bereich}" von "${node.path}" existiert nicht.`);
    const parentPath = node.path.split('/').slice(0, -1).join('/');
    const parent = nodes.get(parentPath)!;
    parent.children = parent.children.filter((child) => child !== node);
    section.children.push(node);
  }

  for (const node of nodes.values()) {
    node.children.sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title, 'de', { numeric: true }));
  }

  nodeMap = nodes;
  cached = nodes.get('')!;
  return cached;
}

export function findNode(root: NavNode, path: string): NavNode | undefined {
  const key = path.split('/').filter(Boolean).join('/');
  return key === '' ? root : nodeMap?.get(key);
}

export function breadcrumbs(root: NavNode, path: string): NavNode[] {
  const segments = path.split('/').filter(Boolean);
  const crumbs: NavNode[] = [];
  const first = segments.length ? findNode(root, segments[0]) : undefined;
  const section = first?.bereich ? findNode(root, first.bereich) : undefined;
  if (section) crumbs.push(section);
  for (let i = 1; i <= segments.length; i++) {
    const node = findNode(root, segments.slice(0, i).join('/'));
    if (node) crumbs.push(node);
  }
  return crumbs;
}

/** The module a page belongs to: a top-level page with `bereich`, otherwise the second path level. */
export function moduleOf(root: NavNode, path: string): NavNode | undefined {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return undefined;
  const first = findNode(root, segments[0]);
  if (first?.bereich) return first;
  return segments.length >= 2 ? findNode(root, segments.slice(0, 2).join('/')) : undefined;
}

/** Categories of a module: its kind folders (Skript, Übung, ...) in configured order. */
export function moduleCategories(mod: NavNode): NavNode[] {
  return moduleKinds
    .map((kind) => mod.children.find((child) => child.path.split('/').pop() === kind))
    .filter((node): node is NavNode => !!node);
}

/** Sidebar scope: the whole module, or the section itself. */
export function sidebarScope(root: NavNode, path: string): { parent?: NavNode; scope?: NavNode } {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return {};
  const section = findNode(root, segments[0]);
  if (section?.bereich) return { parent: findNode(root, section.bereich), scope: section };
  if (segments.length === 1) return { scope: section };
  return { parent: section, scope: findNode(root, segments.slice(0, 2).join('/')) };
}

export function leaves(node: NavNode): NavNode[] {
  if (node.children.length === 0) return node.hasPage ? [node] : [];
  return node.children.flatMap(leaves);
}
