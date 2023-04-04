import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { HiBars3, HiBell, HiXMark } from 'react-icons/hi2'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { HiLogout } from 'react-icons/hi';
import { useRouter } from 'next/router';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    children: React.ReactNode;
    title: string
    navigation: { name: string, href: string, current: boolean }[],
}
export default function Layout({ children, title, navigation }: Props) {
    const user = useUser()
    const router = useRouter()
    const supabaseClient = useSupabaseClient()
    const logOutUser = async () => {
        const { error } = await supabaseClient.auth.signOut()
        if (error) {
            console.error("Error signing out: ", error)
            return
        }
        router.push('/app/login')
    }
    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div className="min-h-full">
                <div className="bg-gray-800 pb-32">
                    <Disclosure as="nav" className="bg-gray-800">
                        {({ open }) => (
                            <>
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                                    <div className="border-b border-gray-700">
                                        <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-8 w-8"
                                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                                        alt="Your Company"
                                                    />
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="ml-10 flex items-baseline space-x-4">
                                                        {navigation.map((item) => (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-gray-900 text-white'
                                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                                )}
                                                                aria-current={item.current ? 'page' : undefined}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="ml-4 flex items-center md:ml-6">
                                                    <button
                                                        type="button"
                                                        onClick={logOutUser}
                                                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                                    >
                                                        <span className="sr-only">Log out</span>
                                                        <HiLogout title='Log out' className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="-mr-2 flex md:hidden">
                                                {/* Mobile menu button */}
                                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open main menu</span>
                                                    {open ? (
                                                        <HiXMark className="block h-6 w-6" aria-hidden="true" />
                                                    ) : (
                                                        <HiBars3 className="block h-6 w-6" aria-hidden="true" />
                                                    )}
                                                </Disclosure.Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                                    <div className="space-y-1 px-2 py-3 sm:px-3">
                                        {navigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'block rounded-md px-3 py-2 text-base font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-700 pt-4 pb-3">
                                        <div className="mt-3 space-y-1 px-2">
                                            <Disclosure.Button
                                                onClick={logOutUser}
                                                as="button"
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                Log out
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <header className="py-10">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                        </div>
                    </header>
                </div>

                <main className="-mt-32">
                    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </>
    )
}