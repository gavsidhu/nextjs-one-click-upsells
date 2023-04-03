import Layout from "@/components/site/Layout";
import { useEffect } from 'react'
import ProductGrid from "@/components/site/products/ProductGrid";
import { GetServerSidePropsContext } from 'next';
import React from "react";
import { HiPlus } from "react-icons/hi2";
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Database } from "../../../../../../types_db";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import useShop from "@/hooks/useShop";

interface Props {
    initialProducts: Database["public"]["Tables"]["products"]["Row"][]
}

const product = ({ initialProducts }: Props) => {
    const { products, setProducts } = useShop()
    useEffect(() => {
        setProducts(initialProducts)
    }, [])

    console.log(products)
    const router = useRouter()
    const id = router.query.id
    return (
        <Layout title="Products">
            <div className='py-4 flex justify-end'>
                <Link
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    href={{
                        pathname: '/app/shop/[id]/products/add-product',
                        query: { id: id },
                    }}
                >
                    <HiPlus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    New Product
                </Link>
            </div>
            <div className="bg-white px-16 py-12 rounded-md shadow-lg">
                <ProductGrid products={initialProducts} />
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient<Database>(ctx);
    const { id } = ctx.query
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

    const initialProducts = (await supabase.from("products").select("*").eq("user_id", session?.user.id).eq('shop_id', id)).data

    return {
        props: {
            user: session.user,
            initialProducts
        }
    };
};

export default product;
