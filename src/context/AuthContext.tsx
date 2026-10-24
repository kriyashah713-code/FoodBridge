import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { INITIAL_PROFILES } from '../data/mockData';

interface SignUpData {
  email: string;
  password?: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization_name?: string;
  address?: string;
  city?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'foodbridge_active_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check saved session or Supabase session on mount
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user && mounted) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as UserProfile);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Supabase auth initialization fallback:', err);
        }
      }

      // Standalone / Local storage session check
      try {
        const saved = localStorage.getItem(CURRENT_USER_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Default to donor demo account for immediate interactive review
          setUser(INITIAL_PROFILES[0]);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_PROFILES[0]));
        }
      } catch (e) {
        setUser(INITIAL_PROFILES[0]);
      }

      if (mounted) setLoading(false);
    }

    initializeAuth();

    // Listen to Supabase auth state change if configured
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setUser(profile as UserProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile && !pError) {
            setUser(profile as UserProfile);
            setLoading(false);
            return { success: true };
          }
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Local / Demo mode login
    const allProfiles: UserProfile[] = (() => {
      try {
        const raw = localStorage.getItem('foodbridge_profiles_v1');
        return raw ? JSON.parse(raw) : INITIAL_PROFILES;
      } catch {
        return INITIAL_PROFILES;
      }
    })();

    const matched = allProfiles.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      setUser(matched);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched));
      setLoading(false);
      return { success: true };
    }

    // Allow user to log in with new email if demo mode
    const newDemoUser: UserProfile = {
      id: 'user-' + Math.random().toString(36).substring(2, 8),
      email: email.trim(),
      full_name: email.split('@')[0],
      role: email.includes('ngo') ? 'ngo' : email.includes('admin') ? 'admin' : 'donor',
      created_at: new Date().toISOString()
    };
    setUser(newDemoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newDemoUser));
    setLoading(false);
    return { success: true };
  };

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    if (isSupabaseConfigured && data.password) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              role: data.role,
              phone: data.phone || '',
              organization_name: data.organization_name || '',
              address: data.address || '',
              city: data.city || ''
            }
          }
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (authData.user) {
          // Construct profile
          const profile: UserProfile = {
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            phone: data.phone,
            organization_name: data.organization_name,
            address: data.address,
            city: data.city,
            created_at: new Date().toISOString()
          };

          // Also make sure profile row is present (in case trigger was bypassed or delayed)
          await supabase.from('profiles').upsert(profile);

          setUser(profile);
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message || 'Sign up failed' };
      }
    }

    // Local / Demo mode sign up
    const newProfile: UserProfile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      phone: data.phone,
      organization_name: data.organization_name,
      address: data.address,
      city: data.city,
      created_at: new Date().toISOString()
    };

    const allProfiles: UserProfile[] = (() => {
      try {
        const raw = localStorage.getItem('foodbridge_profiles_v1');
        return raw ? JSON.parse(raw) : INITIAL_PROFILES;
      } catch {
        return INITIAL_PROFILES;
      }
    })();

    allProfiles.push(newProfile);
    localStorage.setItem('foodbridge_profiles_v1', JSON.stringify(allProfiles));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
    setUser(newProfile);
    setLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const demoUser = INITIAL_PROFILES.find((p) => p.role === role) || {
      id: 'demo-' + role,
      email: `${role}@foodbridge.org`,
      full_name: `Demo ${role.toUpperCase()}`,
      role,
      created_at: new Date().toISOString()
    };
    setUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        isSupabaseActive: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        switchDemoRole,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
