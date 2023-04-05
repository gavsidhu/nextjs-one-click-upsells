import { Database } from '../../types_db';

export interface ShopImage {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface NewShopData {
  shop_name: string;
  description: string;
  logo?: string;
  image?: string;
  subdomain: string;
  custom_domain?: string;
  user_id: string;
}

export type Shop = Database['public']['Tables']['shops']['Row'];
