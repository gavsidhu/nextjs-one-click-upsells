import Layout from '@/components/app/Layout'
import React, { useState, useEffect } from 'react'
import { HiChevronRight, HiPlus } from 'react-icons/hi2'
import { GetServerSidePropsContext } from 'next';
import { HiOutlineExternalLink } from 'react-icons/hi'
import Modal from '@/components/ui/Modal'
import { homeNavigation } from '@/constants/navigation'
import axios from 'axios'
import { User } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../../types_db';
import Link from 'next/link';
import supabase from '@/lib/supabase';

interface Props {
    user: User;
    initialShops: Database["public"]["Tables"]["shops"]["Row"][]
}

interface ShopPayload {
    new: Database['public']['Tables']['shops']['Row'];
}

const Index = ({ user, initialShops }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const [shopData, setShopData] = useState({
        shop_name: "",
        description: "",
        subdomain: "",
        user_id: user?.id
    })
    const [shops, setShops] = useState(initialShops);

    useEffect(() => {
        const handleShopAdded = (payload: ShopPayload) => {
            const newShop = payload.new;
            if (newShop.user_id === user.id) {
                setShops((shops) => [...shops, newShop]);
            }
        };

        // Subscribe to the 'shops' table changes

        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shops' }, handleShopAdded)
            .subscribe()


        return () => {
            // Unsubscribe when the component is unmounted
            subscription.unsubscribe();
        };
    }, [user.id]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setShopData({ ...shopData, [e.target.name]: e.target.value })
    }

    const createShop = async () => {
        try {
            const response = await axios.post('/api/shops', {
                shopData: shopData
            })
            console.log(response.data)
            setShowModal(false)
        } catch (error) {
            console.error("Error creating site: ", error)
        }
    }

    return (
        <Layout title="Shops" navigation={homeNavigation}>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <form
                    className="inline-block w-full max-w-md pt-8 px-6 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                >
                    <h2 className='text-2xl font-bold'>Create new shop</h2>
                    <div className="mt-2 space-y-4 sm:col-span-2 sm:mt-0 py-2">
                        <div className="flex max-w-lg rounded-md shadow-sm">
                            <input
                                type="text"
                                name="shop_name"
                                id="shop_name"
                                required
                                placeholder='Store Name'
                                onChange={(e) => onChange(e)}
                                className="block px-2 w-full min-w-0 flex-1 rounded-md border border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                            />
                        </div>
                        <div className="flex max-w-lg rounded-md shadow-sm">
                            <textarea
                                name="description"
                                id="description"
                                required
                                placeholder='Description'
                                onChange={(e) => onChange(e)}
                                className="block resize-none px-2 w-full min-w-0 flex-1 rounded-md border border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                            />
                        </div>
                        <div className="flex max-w-lg rounded-md shadow-sm">
                            <input
                                type="text"
                                name="subdomain"
                                id="subdomain"
                                placeholder="Subdomain"
                                onChange={(e) => onChange(e)}
                                className="block px-2 w-full min-w-0 flex-1 border-r-0 rounded-r-none rounded-md border border-gray-300 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none"
                            />
                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                .tryspark.io
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 py-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                            onClick={createShop}
                        >
                            Create shop
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <div className='px-8'>
                <div className='flex flex-row justify-end text-white items-center'>
                    <div className='py-4'>
                        <button
                            type="button"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => setShowModal(true)}
                        >
                            <HiPlus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            New shop
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {shops.map((shop) => (
                            <li key={shop.id}>
                                <Link href={`/shop/${shop.id}`} className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="flex min-w-0 flex-1 items-center">
                                            <div className="flex-shrink-0">
                                                {shop.image && <img className="h-20 w-20 " src={shop.image} alt="" />}
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="truncate text-sm font-medium text-indigo-600">{shop.shop_name}</p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        {shop.description}
                                                    </p>
                                                    <div className="mt-2 inline-flex items-center rounded-md bg-gray-300 px-2 py-0.5 text-sm font-medium text-gray-800">
                                                        {shop.subdomain}.tryspark.io
                                                        {/* <HiOutlineExternalLink className="h-4 w-4 ml-2" /> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <HiChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </Layout>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient<Database>(ctx);
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session)
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        };

    const initialShops = (await supabase.from("shops").select("*").eq("user_id", session?.user.id)).data

    return {
        props: {
            user: session.user,
            initialShops
        }
    };
};

export default Index