import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    // Mock signup - replace with real authentication later
    console.log('Sign up attempted:', { email, firstName, lastName });
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Mock signin - replace with real authentication later
    console.log('Sign in attempted:', { email });
    return { error: null };
  };

  const signOut = async () => {
    // Mock signout
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};