import React from 'react'
import { GetServerSidePropsContext } from 'next';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const account = () => {
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
        <div>
            <button onClick={logOutUser}>Log out</button>
        </div>
    )
}

export default account

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
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

    return {
        props: {
            initialSession: session,
            user: session.user,
        }
    };
};