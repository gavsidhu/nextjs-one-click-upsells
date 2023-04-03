import ProductDetails from '@/components/site/products/ProductDetails'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { Database } from '../../../../../../types_db'


interface Props {
  product: Database["public"]["Tables"]["products"]["Row"];
  images: {image: Database["public"]["Tables"]["product_images"]["Row"], path: string}[];
}

const Product = ({product, images}: Props) => {
  return (
    <div>
        <ProductDetails product={product} imagesData={images}/>
    </div>
  )
}

export default Product

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const { productId } = ctx.query

  const {
      data: { session }
  } = await supabase.auth.getSession();

  if (!session)
      return {
          redirect: {
              destination: '/app/login',
              permanent: false
          }
      };

      if (!productId) {
        throw new Error('Product ID is not provided');
      }

      const products = await supabase.from("products").select("*").eq("user_id", session?.user.id).eq('id', parseInt(productId[0]));
      const product = (products.data ?? [])[0];
      
      if (!product) {
        throw new Error('Product not found');
      }

      let images = []

      const productImages = (await supabase.from('product_images').select("image_url").eq("product_id", parseInt(productId[0])).select()).data
      if(productImages != null){
        for (const image of productImages) {
          const path = supabase.storage.from("product-images").getPublicUrl(image.image_url).data.publicUrl
          images.push({image, path})
        }
      }
      
      
  return {
      props: {
          product,
          images
      }
  };
};