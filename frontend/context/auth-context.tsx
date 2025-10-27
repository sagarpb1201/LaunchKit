'use client';

import {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import api from '@/lib/axios';
import {User} from '@/types/user';

interface AuthContextType{
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

      useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

    return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}