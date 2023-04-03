import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { HiXMark, HiStar } from 'react-icons/hi2'

const product = {
    name: 'Zip Tote Basket',
    price: '$220',
    rating: 3.9,
    href: '#',
    description:
        'The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-04.jpg',
    imageAlt: 'Back angled view with bag open and handles to the side.',
    colors: [
        { name: 'Washed Black', bgColor: 'bg-gray-700', selectedColor: 'ring-gray-700' },
        { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
        { name: 'Washed Gray', bgColor: 'bg-gray-500', selectedColor: 'ring-gray-500' },
    ],
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function UpsellModal() {
    const [open, setOpen] = useState(true)
    const [selectedColor, setSelectedColor] = useState(product.colors[0])

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                    <div>
                                        <div className='text-center py-8'>
                                            <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">Long-term thinking</h2>
                                            <p className="mt-3 text-md text-black">
                                                We're committed to responsible, sustainable, and ethical manufacturing. Our small-scale approach allows us to
                                                focus on quality and reduce our impact. We're doing our best to delay the inevitable heat-death of the
                                                universe.
                                            </p>
                                        </div>

                                        <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                                            <div className="sm:col-span-4 lg:col-span-5">
                                                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                                                    <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-8 lg:col-span-7">
                                                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                                                <section aria-labelledby="information-heading" className="mt-3">
                                                    <h3 id="information-heading" className="sr-only">
                                                        Product information
                                                    </h3>

                                                    <p className="text-2xl text-gray-900">{product.price}</p>

                                                    <div className="mt-6">
                                                        <h4 className="sr-only">Description</h4>

                                                        <p className="text-sm text-gray-700">{product.description}</p>
                                                    </div>
                                                </section>

                                                <section aria-labelledby="options-heading" className="mt-6">
                                                    <h3 id="options-heading" className="sr-only">
                                                        Product options
                                                    </h3>

                                                    <form>
                                                        {/* Colors */}
                                                        <div>
                                                            <h4 className="text-sm text-gray-600">Color</h4>

                                                            <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                                                                <RadioGroup.Label className="sr-only"> Choose a color </RadioGroup.Label>
                                                                <div className="flex items-center space-x-3">
                                                                    {product.colors.map((color) => (
                                                                        <RadioGroup.Option
                                                                            key={color.name}
                                                                            value={color}
                                                                            className={({ active, checked }) =>
                                                                                classNames(
                                                                                    color.selectedColor,
                                                                                    active && checked ? 'ring ring-offset-1' : '',
                                                                                    !active && checked ? 'ring-2' : '',
                                                                                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                                                                )
                                                                            }
                                                                        >
                                                                            <RadioGroup.Label as="span" className="sr-only">
                                                                                {' '}
                                                                                {color.name}{' '}
                                                                            </RadioGroup.Label>
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className={classNames(
                                                                                    color.bgColor,
                                                                                    'h-8 w-8 rounded-full border border-black border-opacity-10'
                                                                                )}
                                                                            />
                                                                        </RadioGroup.Option>
                                                                    ))}
                                                                </div>
                                                            </RadioGroup>
                                                        </div>

                                                        <div className="mt-6">
                                                            <button
                                                                type="submit"
                                                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                                            >
                                                                Add to my order
                                                            </button>
                                                        </div>

                                                        <p className="absolute top-4 left-4 text-center sm:static sm:mt-6">
                                                            <button
                                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                No thanks
                                                            </button>
                                                        </p>
                                                    </form>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}