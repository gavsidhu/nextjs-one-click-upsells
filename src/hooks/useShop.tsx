import { useEffect, useState, createContext, useContext, useMemo, Dispatch, SetStateAction } from 'react';
import { Database } from '../../types_db';
import { useUser, User } from '@supabase/auth-helpers-react';
import supabase from '@/lib/supabase';

interface IShopContext {
    products: Database["public"]["Tables"]["products"]["Row"][] | null,
    setProducts: Dispatch<SetStateAction<Database["public"]["Tables"]["products"]["Row"][]>>
};

interface ProductPayload {
    new: Database['public']['Tables']['products']['Row'];
}


export const ShopContext = createContext<IShopContext>({
    products: null,
    setProducts: () => {

    }
})

interface ShopProviderProps {
    children: React.ReactNode;
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
    const user = useUser()
    const [products, setProducts] = useState<Database["public"]["Tables"]["products"]["Row"][]>([])

    useEffect(() => {
        console.log("user", user)
        if (!user) {
            return
        }
        const handleProductAdded = (payload: ProductPayload) => {
            const newProduct = payload.new;
            if (newProduct.user_id === user.id) {
                setProducts((products) => [...products, newProduct]);
            }
        };

        // Subscribe to the 'products' table changes

        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, handleProductAdded)
            .subscribe()


        return () => {
            // Unsubscribe when the component is unmounted
            subscription.unsubscribe();
        };
    }, [user?.id])

    const memoedValue = useMemo(
        () => ({
            products,
            setProducts,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [products]
    );

    return (
        <ShopContext.Provider value={memoedValue}>
            {children}
        </ShopContext.Provider>
    )
}

export default function useShop() {
    return useContext(ShopContext)
}
