declare module 'virtual:astrostudium/config' {
  import type { AstroStudiumOptions } from '../integration/index';
  const config: Required<Omit<AstroStudiumOptions, 'menu'>> & { menu: import('../integration/index').MenuItem[] | null };
  export default config;
}
