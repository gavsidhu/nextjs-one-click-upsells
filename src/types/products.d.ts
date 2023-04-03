export interface NewProductData {
  product_name: string;
  price: float;
  description: string;
  details?: string;
  active?: boolean;
  user_id: string;
  shop_id: number;
  metadata?: json;
  image?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  name: string;
  alt: string;
}
