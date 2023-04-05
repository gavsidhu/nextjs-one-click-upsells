import { NewShopData } from '@/types/shop';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types_db';

export const supabase = createBrowserSupabaseClient<Database>();

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
