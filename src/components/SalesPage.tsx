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
import Modal from './ui/Modal'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);


const navigation = {
    categories: [
        {
            id: 'women',
            name: 'Women',
            featured: [
                {
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
                    imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
                },
                {
                    name: 'Basic Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
                    imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
                },
            ],
            sections: [
                {
                    id: 'clothing',
                    name: 'Clothing',
                    items: [
                        { name: 'Tops', href: '#' },
                        { name: 'Dresses', href: '#' },
                        { name: 'Pants', href: '#' },
                        { name: 'Denim', href: '#' },
                        { name: 'Sweaters', href: '#' },
                        { name: 'T-Shirts', href: '#' },
                        { name: 'Jackets', href: '#' },
                        { name: 'Activewear', href: '#' },
                        { name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'accessories',
                    name: 'Accessories',
                    items: [
                        { name: 'Watches', href: '#' },
                        { name: 'Wallets', href: '#' },
                        { name: 'Bags', href: '#' },
                        { name: 'Sunglasses', href: '#' },
                        { name: 'Hats', href: '#' },
                        { name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'brands',
                    name: 'Brands',
                    items: [
                        { name: 'Full Nelson', href: '#' },
                        { name: 'My Way', href: '#' },
                        { name: 'Re-Arranged', href: '#' },
                        { name: 'Counterfeit', href: '#' },
                        { name: 'Significant Other', href: '#' },
                    ],
                },
            ],
        },
        {
            id: 'men',
            name: 'Men',
            featured: [
                {
                    name: 'New Arrivals',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
                    imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
                },
                {
                    name: 'Artwork Tees',
                    href: '#',
                    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
                    imageAlt:
                        'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
                },
            ],
            sections: [
                {
                    id: 'clothing',
                    name: 'Clothing',
                    items: [
                        { name: 'Tops', href: '#' },
                        { name: 'Pants', href: '#' },
                        { name: 'Sweaters', href: '#' },
                        { name: 'T-Shirts', href: '#' },
                        { name: 'Jackets', href: '#' },
                        { name: 'Activewear', href: '#' },
                        { name: 'Browse All', href: '#' },
                    ],
                },
                {
                    id: 'accessories',
                    name: 'Accessories',
                    items: [
                        { name: 'Watches', href: '#' },
                        { name: 'Wallets', href: '#' },
                        { name: 'Bags', href: '#' },
                        { name: 'Sunglasses', href: '#' },
                        { name: 'Hats', href: '#' },
                        { name: 'Belts', href: '#' },
                    ],
                },
                {
                    id: 'brands',
                    name: 'Brands',
                    items: [
                        { name: 'Re-Arranged', href: '#' },
                        { name: 'Counterfeit', href: '#' },
                        { name: 'Full Nelson', href: '#' },
                        { name: 'My Way', href: '#' },
                    ],
                },
            ],
        },
    ],
    pages: [
        { name: 'Company', href: '#' },
        { name: 'Stores', href: '#' },
    ],
}
const userNavigation = [
    { name: 'Sign in', href: '#' },
    { name: 'Create account', href: '#' },
]
const product = {
    name: 'Everyday Ruck Snack',
    href: '#',
    price: '$220',
    description:
        "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
    imageAlt: 'Light green canvas bag with black straps, handle, front zipper pouch, and drawstring top.',
    breadcrumbs: [
        { id: 1, name: 'Travel', href: '#' },
        { id: 2, name: 'Bags', href: '#' },
    ],
    highlights: [
        '200+ SVG icons in 3 unique styles',
        'Compatible with Figma, Sketch, and Adobe XD',
        'Drawn on 24 x 24 pixel grid',
    ],
    sizes: [
        { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
        { name: '20L', description: 'Enough room for a serious amount of snacks.' },
    ],
    details: [
        {
            name: 'Features',
            items: [
                'Multiple strap configurations',
                'Spacious interior with top zip',
                'Leather handle and tabs',
                'Interior dividers',
                'Stainless strap loops',
                'Double stitched construction',
                'Water-resistant',
            ],
        },
    ],
    images: [
        {
            id: 1,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        {
            id: 2,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        // More images...
    ],
}
const policies = [
    {
        name: 'Free delivery all year long',
        description:
            'Name another place that offers year long free delivery? We’ll be waiting. Order now and you’ll get delivery absolutely free.',
        imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg',
    },
    {
        name: '24/7 Customer Support',
        description:
            'Or so we want you to believe. In reality our chat widget is powered by a naive series of if/else statements that churn out canned responses. Guaranteed to irritate.',
        imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-chat-light.svg',
    },
    {
        name: 'Fast Shopping Cart',
        description:
            "Look at the cart in that icon, there's never been a faster cart. What does this mean for the actual checkout experience? I don't know.",
        imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-fast-checkout-light.svg',
    },
    {
        name: 'Gift Cards',
        description:
            "We sell these hoping that you will buy them for your friends and they will never actually use it. Free money for us, it's great.",
        imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg',
    },
]
const reviews = {
    average: 4,
    totalCount: 1624,
    counts: [
        { rating: 5, count: 1019 },
        { rating: 4, count: 162 },
        { rating: 3, count: 97 },
        { rating: 2, count: 199 },
        { rating: 1, count: 147 },
    ],
    featured: [
        {
            id: 1,
            rating: 5,
            content: `
        <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
      `,
            author: 'Emily Selman',
            avatarSrc:
                'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        // More reviews...
    ],
}
const footerNavigation = {
    products: [
        { name: 'Bags', href: '#' },
        { name: 'Tees', href: '#' },
        { name: 'Objects', href: '#' },
        { name: 'Home Goods', href: '#' },
        { name: 'Accessories', href: '#' },
    ],
    company: [
        { name: 'Who we are', href: '#' },
        { name: 'Sustainability', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Terms & Conditions', href: '#' },
        { name: 'Privacy', href: '#' },
    ],
    customerService: [
        { name: 'Contact', href: '#' },
        { name: 'Shipping', href: '#' },
        { name: 'Returns', href: '#' },
        { name: 'Warranty', href: '#' },
        { name: 'Secure Payments', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Find a store', href: '#' },
    ],
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    product?: any;
    banner?: string;
}

export default function SalesPage({ banner }: Props) {
    const [open, setOpen] = useState(false)
    const [selectedSize, setSelectedSize] = useState(product.sizes[0])

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
                                        {product.images.map((image) => (
                                            <Tab
                                                key={image.id}
                                                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className="sr-only"> {image.name} </span>
                                                        <span className="absolute inset-0 overflow-hidden rounded-md">
                                                            <img src={image.src} alt="" className="h-full w-full object-cover object-center" />
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
                                    {product.images.map((image) => (
                                        <Tab.Panel key={image.id}>
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="h-full w-full object-cover object-center sm:rounded-lg"
                                            />
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>

                            {/* Product info */}
                            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                                <div className="mt-3">
                                    <h2 className="sr-only">Product information</h2>
                                    <p className="text-3xl tracking-tight text-gray-900">{product.price}</p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="sr-only">Description</h3>

                                    <div
                                        className="space-y-6 text-base text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
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
                                        {product.details.map((detail) => (
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
                                        ))}
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
            </div></>

    )
}