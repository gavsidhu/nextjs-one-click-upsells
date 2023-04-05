import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next';;
import supabase from '@/lib/supabase';
import { ParsedUrlQuery } from 'querystring';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import {
    HiBars3,
    HiMagnifyingGlass,
    HiShieldCheck,
    HiShoppingBag,
    HiXMark,
    HiCheck,
    HiQuestionMarkCircle,
    HiStar,
    HiMinus,
    HiPlus
} from 'react-icons/hi2'
import { Database } from '../../../../types_db';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);


interface SiteParams extends ParsedUrlQuery {
    site: string;
}

type ShopDataRow = Database["public"]["Tables"]["shops"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];

interface ProductImageData extends ProductImageRow {
    public_url: string
}

interface ProductData extends ProductRow {
    images: ProductImageData[]
}
interface ShopData extends ShopDataRow {
    products: ProductData[]
}

interface SiteProps {
    data: ShopData;
}

interface Props {
    product?: any;
    banner?: string;
    data: ShopData
}

const index = ({ banner, data }: Props) => {
    console.log("data", data)
    const mainProduct = data?.products?.filter((product) => product.product_type === 'main')[0]
    const [open, setOpen] = useState(false)

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault()
        setOpen(true)
    }
    return (
        <>
            <div className="bg-gray-50">
                <header className="relative bg-white">
                    {banner && banner.length != 0 ?
                        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
                            {banner}
                        </p>
                        :
                        null
                    }
                </header>
                <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
                    {/* Product */}
                    <div className="mx-auto max-w-2xl lg:max-w-none">
                        {/* Product */}
                        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                            {/* Image gallery */}
                            <Tab.Group as="div" className="flex flex-col-reverse">
                                {/* Image selector */}
                                <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                                    <Tab.List className="grid grid-cols-4 gap-6">
                                        {mainProduct.images.map((image) => (
                                            <Tab
                                                key={image.id}
                                                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className="sr-only"> {image.alt_text} </span>
                                                        <span className="absolute inset-0 overflow-hidden rounded-md">
                                                            <img src={image.public_url} alt="" className="h-full w-full object-cover object-center" />
                                                        </span>
                                                        <span
                                                            className={classNames(
                                                                selected ? 'ring-indigo-500' : 'ring-transparent',
                                                                'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>

                                <Tab.Panels className="aspect-w-1 aspect-h-1 w-[60%] mx-auto">
                                    {mainProduct?.images?.map((image) => (
                                        <Tab.Panel key={image.id}>
                                            <img
                                                src={image.public_url}
                                                alt={image.alt_text || ""}
                                                className="h-full w-full object-cover object-center sm:rounded-lg"
                                            />
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>

                            {/* Product info */}
                            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{mainProduct?.product_name}</h1>

                                <div className="mt-3">
                                    <h2 className="sr-only">Product information</h2>
                                    <p className="text-3xl tracking-tight text-gray-900">${mainProduct?.price}</p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="sr-only">Description</h3>

                                    <div
                                        className="space-y-6 text-base text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: mainProduct?.description }}
                                    />
                                </div>
                                <div className="mt-10 block">
                                    <div>
                                        <Elements stripe={stripePromise}>
                                            <CheckoutForm />
                                        </Elements>
                                    </div>
                                </div>
                                <section aria-labelledby="details-heading" className="mt-12">
                                    <h2 id="details-heading" className="sr-only">
                                        Additional details
                                    </h2>
                                    <div className="divide-y divide-gray-200 border-t">
                                        {/* {product.details.map((detail) => (
                                            <Disclosure as="div" key={detail.name}>
                                                {({ open }) => (
                                                    <>
                                                        <h3>
                                                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                                                                <span
                                                                    className={classNames(
                                                                        open ? 'text-indigo-600' : 'text-gray-900',
                                                                        'text-sm font-medium'
                                                                    )}
                                                                >
                                                                    {detail.name}
                                                                </span>
                                                                <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <HiMinus
                                                                            className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <HiPlus
                                                                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                                                            <ul role="list">
                                                                {detail.items.map((item) => (
                                                                    <li key={item}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))} */}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                        {/* Details section */}
                        <section aria-labelledby="details-heading">
                            <div className="flex flex-col items-center text-center">
                                <h2 id="details-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    The Fine Details
                                </h2>
                                <p className="mt-3 max-w-3xl text-lg text-gray-600">
                                    Our patented padded snack sleeve construction protects your favorite treats from getting smooshed during
                                    all-day adventures, long shifts at work, and tough travel schedules.
                                </p>
                            </div>

                            <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
                                <div>
                                    <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-lg">
                                        <img
                                            src="https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
                                            alt="Drawstring top with elastic loop closure and textured interior padding."
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <p className="mt-8 text-base text-gray-500">
                                        The 20L model has enough space for 370 candy bars, 6 cylinders of chips, 1,220 standard gumballs, or
                                        any combination of on-the-go treats that your heart desires. Yes, we did the math.
                                    </p>
                                </div>
                                <div>
                                    <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-lg">
                                        <img
                                            src="https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-02.jpg"
                                            alt="Front zipper pouch with included key ring."
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <p className="mt-8 text-base text-gray-500">
                                        Up your snack organization game with multiple compartment options. The quick-access stash pouch is
                                        ready for even the most unexpected snack attacks and sharing needs.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <footer aria-labelledby="footer-heading" className="bg-white">

                </footer>
            </div>
        </>
    )
}

export const getStaticPaths: GetStaticPaths<SiteParams> = async () => {
    // Fetch subdomains and custom domains from your database
    const { data } = await supabase.from('shops').select('subdomain, custom_domain');
    if (!data) {
        throw new Error("could not get data");
    }

    // Generate paths for subdomains and custom domains
    const subdomains = data
        .filter((site) => site.subdomain)
        .map((site) => site.subdomain);
    const domains = data
        .filter((site) => site.custom_domain)
        .map((site) => site.custom_domain);

    // Combine all paths
    const allPaths = [...subdomains, ...domains];

    // Return the paths in the required format
    return {
        paths: allPaths.map((path) => {
            return { params: { site: path } };
        }),
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps<SiteProps, SiteParams> = async ({ params }) => {
    if (!params) {
        return { notFound: true, revalidate: 10 };
    }

    const { site } = params;
    const isCustomDomain = site.includes(".");
    const eq = isCustomDomain ? "custom_domain" : "subdomain";

    // Fetch site data based on subdomain or custom domain
    const { data: siteData } = await supabase
        .from("shops")
        .select("*")
        .eq(eq, site);

    // If the site is not found or siteData is null, return notFound property
    if (!siteData || siteData.length === 0) {
        return { notFound: true, revalidate: 10 };
    }

    // Fetch posts related to the site
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", siteData[0].id);
    const activeProducts = products?.filter((product) => product.product_type === "main" || product.product_type === "upsell");

    let productsWithImages: ProductData[] = [];

    if (activeProducts) {
        for (const product of activeProducts) {
            const productImages = (await supabase.from("product_images").select("image_url").eq("product_id", product.id).select()).data;

            const imagesWithPublicUrl = productImages?.map((image) => {
                const publicUrl = supabase.storage.from("product-images").getPublicUrl(image.image_url).data.publicUrl;
                return { ...image, public_url: publicUrl };
            });

            productsWithImages.push({ ...product as ProductRow, images: imagesWithPublicUrl as ProductImageData[] });
        }
    }

    // Combine site data and posts
    const shopWithProducts: ShopData = {
        ...siteData[0] as ShopDataRow,
        products: productsWithImages,
    };

    // Return the site data as props
    return {
        props: {
            data: shopWithProducts,
        },
        revalidate: 10,
    };
};


export default index