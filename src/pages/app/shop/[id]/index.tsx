import Layout from "@/components/site/Layout";
import { useState, useEffect } from "react";
import { User, createServerSupabaseClient, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Database } from "../../../../../types_db";
import Modal from "@/components/ui/Modal";
import { RadioGroup, Listbox } from "@headlessui/react";
import ProductCard from "@/components/site/products/ProductCard";
import { HiCheck } from "react-icons/hi2";

const supabase = createBrowserSupabaseClient<Database>();

interface Props {
  initialProducts: Database["public"]["Tables"]["products"]["Row"][]
  user: User
}

interface ProductPayload {
  new: Database['public']['Tables']['products']['Row'];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const index = ({ user, initialProducts }: Props) => {
  const [products, setProducts] = useState(initialProducts);
  const [openMain, setOpenMain] = useState(false)
  const [openUpsell, setOpenUpsell] = useState(false)
  const mainProduct = products.filter((product) => product.product_type === "main")[0];
  const upsellProducts = products.filter((product) => product.product_type === "upsell");
  const [selected, setSelected] = useState(mainProduct ? mainProduct : products[0])
  const [upsellSelected, setUpsellSelected] = useState(upsellProducts)

  useEffect(() => {
    // Subscribe to the 'products' table changes
    const subscription = supabase
      .channel('any')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload: ProductPayload) => {
          console.log('realtime', payload);
          setProducts((prevProducts) => {
            const updatedProduct = payload.new;
            return prevProducts.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product
            );
          });
        }
      )
      .subscribe();

    return () => {
      // Unsubscribe when the component is unmounted
      subscription.unsubscribe();
    };
  }, [user.id]);



  const confirmMainProduct = async () => {

    try {
      const { data, error } = await supabase.from("products").update({ product_type: "main" }).eq("id", selected.id).select()
      console.log("Updated main product successfully", data)
      setOpenMain(false);

    } catch (error) {
      console.error("Error confirming products: ", error);
      setOpenMain(false)
    }

  }

  const confirmUpsellProducts = async () => {
    try {
      // Get the ids of the upsellSelected products
      const upsellSelectedIds = upsellSelected.map((product) => product.id);

      // Loop through upsellSelected and update product_type to "upsell"
      for (const product of upsellSelected) {
        const { data, error } = await supabase
          .from('products')
          .update({ product_type: 'upsell' })
          .eq('id', product.id).select()
        console.log(data, "error: ", error)

      }

      // Loop through products and update previously "upsell" products to "not_assigned" if not in upsellSelected
      for (const product of products) {
        if (!upsellSelectedIds.includes(product.id) && product.product_type === 'upsell') {
          await supabase
            .from('products')
            .update({ product_type: 'not_assigned' })
            .eq('id', product.id);
        }
      }
      console.log("Updated upsell products successfully")
      setOpenUpsell(false);
    } catch (error) {
      console.error("Error confirming products: ", error);
      setOpenUpsell(false);
    }
  };




  return (
    <>
      <Modal setShowModal={setOpenMain} showModal={openMain}>
        <div className="inline-block w-full max-w-md py-8 px-6 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg">
          <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="sr-only"> Product </RadioGroup.Label>
            <div className="space-y-4">
              {products.map((product) => (
                <RadioGroup.Option
                  key={product.id}
                  value={product}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? 'border-transparent' : 'border-gray-300',
                      active ? 'border-indigo-600 ring-2 ring-indigo-600' : '',
                      'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between'
                    )
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <span className="flex items-center">
                        <span className="flex flex-col text-sm">
                          <RadioGroup.Label as="span" className="font-medium text-gray-900">
                            {product.product_name}
                          </RadioGroup.Label>
                        </span>
                      </span>
                      <span
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked ? 'border-indigo-600' : 'border-transparent',
                          'pointer-events-none absolute -inset-px rounded-lg'
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <div className="mt-5 py-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              onClick={confirmMainProduct}
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            >
              Confirm
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={() => setOpenMain(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal setShowModal={setOpenUpsell} showModal={openUpsell}>
        <div className="inline-block w-full max-w-md py-8 px-6 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg">
          <div className="sr-only">Product</div>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
                onClick={() => {
                  if (upsellSelected.includes(product)) {
                    setUpsellSelected((prevSelected) =>
                      prevSelected.filter((item) => item !== product)
                    );
                  } else {
                    setUpsellSelected((prevSelected) => [...prevSelected, product]);
                  }
                }}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-4 h-4 border rounded-lg mr-2">
                    {upsellSelected.includes(product) && (
                      <HiCheck className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                  <div className="font-medium text-gray-900">
                    {product.product_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 py-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              onClick={confirmUpsellProducts}
            >
              Confirm
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={() => setOpenUpsell(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Layout title="Shop">
        <div className="bg-white px-16 py-12 rounded-md shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl">Main Product</h2>
              <button onClick={() => setOpenMain(true)}>{!mainProduct ? "Add main product" : "Change main product"}</button>
            </div>

            <div>

              {mainProduct && <ProductCard product={mainProduct} />}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl">Upsell products</h2>
              <div>
                <button onClick={() => setOpenUpsell(true)}>Add Upsell products</button>
              </div>
            </div>

            <div className="space-y-2 py-4">
              {upsellProducts.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </Layout></>
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
export default index;
