declare module 'virtual:astrostudium/config' {
  import type { AstroStudiumOptions } from '../integration/index';
  const config: Required<AstroStudiumOptions>;
  export default config;
}
