import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Utility function to safely handle localStorage operations
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (item && item !== 'undefined' && item !== 'null') {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      localStorage.removeItem(key);
    }
    return null;
  },
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

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
  const [user, setUser] = useState<User | null>(() => safeLocalStorage.getItem('user'));
  const [profile, setProfile] = useState<Profile | null>(() => safeLocalStorage.getItem('profile'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Sign up attempted:', { email, firstName, lastName });
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
        // Save to localStorage safely
        safeLocalStorage.setItem('user', data.user);
        safeLocalStorage.setItem('profile', data.profile);
        return { error: null };
      } else {
        const errorData = await response.json();
        return { error: errorData.error || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempted:', { email });
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sign in successful, received data:', data);
        setUser(data.user);
        setProfile(data.profile);
        // Save to localStorage safely
        safeLocalStorage.setItem('user', data.user);
        safeLocalStorage.setItem('profile', data.profile);
        console.log('User and profile set, isAdmin:', data.profile?.role === 'admin' || data.profile?.role === 'super_admin');
        return { error: null };
      } else {
        const errorData = await response.json();
        return { error: errorData.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setProfile(null);
    // Clear localStorage safely
    safeLocalStorage.removeItem('user');
    safeLocalStorage.removeItem('profile');
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