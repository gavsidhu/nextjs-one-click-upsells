import { ProductImage } from '../types/products';

export const convertURLToFile = async (image: ProductImage) => {
  const blob = await fetch(image.url).then((res) => res.blob());
  return new File([blob], image.name, { type: blob.type });
};

export const getURL = () => {
  let url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : (process?.env?.NEXT_PUBLIC_SITE_URL as string); // Set this to your site URL in production env.

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const checkIfMainProductExists = async () => {};
