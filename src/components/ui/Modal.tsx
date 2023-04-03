import { Dialog, Transition } from "@headlessui/react";
import { Elements } from "@stripe/react-stripe-js";
import { Fragment } from "react";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "../CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface ModalProps {
    showModal: boolean;
    setShowModal: (state: boolean) => void;
    children: React.ReactNode
}

export default function Modal({
    children,
    showModal,
    setShowModal,
}: ModalProps) {
    return (
        <>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-40 overflow-y-auto"
                    onClose={() => { }}
                >
                    <div className="min-h-screen px-4 text-center flex items-center justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full">
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
