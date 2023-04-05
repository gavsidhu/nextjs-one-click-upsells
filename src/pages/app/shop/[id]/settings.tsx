import Layout from "@/components/site/Layout";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import { User, createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { HiPhoto, HiUserCircle } from "react-icons/hi2";
import useSWR, { mutate } from "swr";
import { Database } from "../../../../../types_db";
import { NewShopData, Shop } from "@/types/shop";
import { useState } from "react";
import axios from "axios";
import DomainCard from "@/components/site/DomainCard";

interface Props {
    shop: Shop,
    user: User
}


export default function Settings({ shop, user }: Props) {
    const router = useRouter();
    const { id } = router.query;
    const shopId = id;

    const [shopData, setShopData] = useState<NewShopData>({
        shop_name: shop.shop_name,
        description: shop.description as string,
        subdomain: shop.subdomain as string,
        user_id: user.id,
        custom_domain: shop.custom_domain as string,
        image: "",
        logo: ""

    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setShopData({ ...shopData, [e.target.name]: e.target.value })
    }

    async function handleCustomDomain() {
        const customDomain = shopData.custom_domain;

        // setAdding(true);

        try {
            const response = await axios.post(
                `/api/domains`,
                {
                    domain: customDomain,
                    shopId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.statusText != "OK")
                throw {
                    code: response.status,
                    domain: customDomain,
                };
            // setError(null);
            // mutate(`/api/site?siteId=${siteId}`);
        } catch (error) {
            console.error(error)
            // setError(error);
        } finally {
            // setAdding(false);
        }
    }
    return (
        <Layout title="Shop Settings">
            <form className="bg-white px-8 py-6 rounded-lg shadow-lg">
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="shop_name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Shop name
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="shop_name"
                                            id="shop_name"
                                            autoComplete="shop_name"
                                            className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            defaultValue={shop.shop_name}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="block resize-none px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                        defaultValue={shop.description as string}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="subdomain" className="block text-sm font-medium leading-6 text-gray-900">
                                    Subdomain
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="subdomain"
                                            id="subdomain"
                                            autoComplete="subdomain"
                                            className="flex-1block w-full rounded-md border py-1.5 px-2 text-gray-900 sm:text-sm sm:leading-6"
                                            defaultValue={shop.subdomain as string}
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                            .tryspark.io
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="custom_domain" className="block text-sm font-medium leading-6 text-gray-900">
                                    Custom domain
                                </label>
                                {shop.custom_domain ? <DomainCard data={shop} /> :
                                    <div className="flex rounded-md shadow-sm sm:max-w-md">
                                        <input
                                            type="text"
                                            name="custom_domain"
                                            id="custom_domain"
                                            className="block w-full rounded-md border py-1.5 text-gray-900 px-2 sm:text-sm sm:leading-6"
                                            onChange={(e) => onChange(e)}
                                            defaultValue={shopData.custom_domain}
                                        />
                                        <button
                                            type="submit"
                                            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleCustomDomain()
                                            }
                                            }
                                        >
                                            Add
                                        </button>
                                    </div>
                                }
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Logo
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <HiPhoto className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="py-8">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Shop</h3>
                                <div className="mt-2 max-w-xl text-sm text-gray-500">
                                    <p>
                                        All your data for {shop.shop_name} will be permanently deleted. This cannot be undone.
                                    </p>
                                </div>
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Delete shop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Layout>
    )
}

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

    const shop = (await supabase.from("shops").select("*").eq('id', id)).data
    if (!shop) {
        return {
            props: {
                notFound: true
            }
        }
    }

    return {
        props: {
            user: session.user,
            shop: shop[0]
        }
    };
};