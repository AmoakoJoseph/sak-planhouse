import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  created_at?: string;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  company?: string;
  website?: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    // Initialize from localStorage
    const savedProfile = localStorage.getItem('profile');
    if (!savedProfile || savedProfile === 'undefined' || savedProfile === 'null') return null;
    try {
      return JSON.parse(savedProfile);
    } catch {
      localStorage.removeItem('profile');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Sign up attempted:', { email, firstName, lastName });
      const data = await api.post('auth/signup', { email, password, firstName, lastName });
        setUser(data.user);
        setProfile(data.profile);
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempted:', { email });
      const data = await api.post('auth/signin', { email, password });
        setUser(data.user);
        setProfile(data.profile);
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
        return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await api.post('auth/signout', {});
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setProfile(null);
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isAuthenticated = !!user;

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};