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
  sub_domain: string;
  custom_domain?: string;
  user_id: string;
}
