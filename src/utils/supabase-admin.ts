import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types_db';
import { NewProductData, ProductImage } from '@/types/products';
import { NewShopData } from '@/types/shop';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const createProduct = async (
  product: NewProductData,
  images: { buffer: Buffer; originalname: string; mimetype: string }[]
) => {
  const { error, data } = await supabaseAdmin
    .from('products')
    .insert(product)
    .select();

  if (!data || error) {
    console.error('Error inserting product:', error);
    return;
  }

  const newProduct = data[0];

  // Upload images to Supabase Storage
  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(`${newProduct.id}/${image.originalname}`, image.buffer, {
          contentType: image.mimetype,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }
      return {
        product_id: newProduct.id,
        image_url: `/product-images/${newProduct.id}/${image.originalname}`,
      };
    })
  );

  // Filter out null values in the uploadedImages array
  const nonNullImages = uploadedImages.filter(
    (img): img is NonNullable<typeof img> => img !== null
  );

  // Insert image data to the product_images table
  const { error: insertImagesError } = await supabaseAdmin
    .from('product_images')
    .insert(nonNullImages);

  if (insertImagesError) {
    console.error('Error inserting images:', insertImagesError);
  } else {
    console.log('Product and images added successfully');
  }
};
export const createShop = async (shopData: NewShopData) => {
  const { error, data } = await supabaseAdmin
    .from('shops')
    .insert(shopData)
    .select();

  if (!data || error) {
    console.error('Error creating shop: ', error);
    return;
  }
};
