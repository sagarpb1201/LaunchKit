'use client';

import {useAuth} from '@/context/auth-context';
import {useEffect, ReactNode} from 'react';
import {useRouter} from 'next/navigation';

export default function ProtectedRoute({children}: {children: ReactNode}){
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(()=>{
        console.log('Protected Route Effect:', { isLoading, user }); // Add debugging
        if(!isLoading && !user){
            router.push('/login')
        }
    },[isLoading, user, router]);
    
    if(isLoading){
        console.log('Still loading...'); // Add debugging
        return <div>Loading...</div>
    }

    if(!user){
        console.log('No user found'); // Add debugging
        return null;
    }

    console.log('Rendering children'); // Add debugging
    return <>{children}</>
}