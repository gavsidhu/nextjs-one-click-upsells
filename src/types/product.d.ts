export default interface Product {
  name: string;
  href: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: { id: number; name: string; href: string }[];
  highlights: string[];
  sizes: { name: string; description: string }[];
  details: { name: string; items: string[] }[];
  images: { id: number; name: string; src: string; alt: string }[];
}
