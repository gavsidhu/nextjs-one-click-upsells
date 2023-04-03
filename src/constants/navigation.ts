export const homeNavigation = [
  { name: 'Shops', href: '/app', current: true },
  { name: 'Settings', href: '/app/settings', current: false },
  { name: 'Account', href: '/app/account', current: false },
];

export const siteNavigation = (shopId: string | number) => [
  { name: 'Shop', href: `/app/shop/${shopId}`, current: true },
  { name: 'Products', href: `/app/shop/${shopId}/products`, current: false },
  { name: 'Settings', href: `/app/shop/${shopId}/settings`, current: false },
];
