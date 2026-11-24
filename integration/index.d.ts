import type { AstroIntegration } from 'astro';

export interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

export interface AstroStudiumOptions {
  name?: string;
  menu?: MenuItem[];
  logo?: string;
  editUrl?: string;
  moduleKinds?: string[];
}

export default function astrostudium(options?: AstroStudiumOptions): AstroIntegration;
