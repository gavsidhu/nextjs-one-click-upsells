export const homeNavigation = [
  { name: 'Shops', href: '/', current: false },
  { name: 'Account', href: '/account', current: false },
];

export const siteNavigation = (shopId: string | number) => [
  { name: 'Home', href: `/`, current: false },
  { name: 'Shop', href: `/shop/${shopId}`, current: false },
  { name: 'Products', href: `/shop/${shopId}/products`, current: false },
  {
    name: 'Shop Settings',
    href: `/shop/${shopId}/settings`,
    current: false,
  },
  { name: 'Account', href: `/account`, current: false },
];
