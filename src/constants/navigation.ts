export const homeNavigation = [
  { name: 'Shops', href: '/app', current: false },
  { name: 'Settings', href: '/app/settings', current: false },
  { name: 'Account', href: '/app/account', current: false },
];

export const siteNavigation = (shopId: string | number) => [
  { name: 'Home', href: `/app/`, current: false },
  { name: 'Shop', href: `/app/shop/${shopId}`, current: false },
  { name: 'Products', href: `/app/shop/${shopId}/products`, current: false },
  {
    name: 'Shop Settings',
    href: `/app/shop/${shopId}/settings`,
    current: false,
  },
  { name: 'Account', href: `/app/account/`, current: false },
];
