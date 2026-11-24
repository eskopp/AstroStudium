export type MenuItem = {
  label: string;
  href?: string;
  children?: MenuItem[];
};

export const site = {
  name: 'AstroStudium',
};

// Header menu. Items with `children` become dropdowns. Items without `href` are plain labels.
export const menu: MenuItem[] = [
  {
    label: 'Studium',
    children: [
      { label: 'Physik', href: '/physik/' },
      { label: 'Mathematik', href: '/mathematik/' },
    ],
  },
  { label: 'Praktika', href: '/physik/optik/' },
  {
    label: 'Mehr',
    children: [
      { label: 'Mechanik', href: '/physik/mechanik/' },
      { label: 'Analysis', href: '/mathematik/analysis/' },
    ],
  },
];
