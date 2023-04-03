import supabase from '@/lib/supabase';
import { NewProductData } from '@/types/products';
import { NewShopData } from '@/types/shop';

export const createShop = async (shopData: NewShopData) => {
  const { error, data } = await supabase
    .from('shops')
    .insert(shopData)
    .select();

  if (!data || error) {
    console.error('Error creating shop: ', error);
    return;
  }
};
