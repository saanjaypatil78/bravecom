import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine role based on email or metadata if DB table is missing
  const determineRole = (email: string | undefined): UserRole => {
    if (!email) return 'investor';
    
    // Hardcoded logic for demo purposes (real app should query 'public.profiles')
    if (email.includes('admin') || email.endsWith('@brave-ecom.com')) {
      return 'admin';
    }
    if (email.includes('partner')) {
      return 'partner';
    }
    return 'investor';
  };

  useEffect(() => {
    // 1. Check active session
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // 3. Listen for popup messages (OAuth)
    const handleMessage = async (event: MessageEvent) => {
        // Validate origin
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
            const { access_token, refresh_token } = event.data.session;
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) console.error('Error setting session:', error);
        }
        
        if (event.data?.type === 'OAUTH_CODE_EXCHANGE') {
            const { code } = event.data;
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) console.error('Error exchanging code:', error);
        }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const fetchProfile = async (currentUser: User) => {
    try {
      // Try fetching from Supabase 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email!,
          full_name: data.full_name || currentUser.user_metadata.full_name,
          avatar_url: data.avatar_url || currentUser.user_metadata.avatar_url,
          role: data.role as UserRole
        });
      } else {
        // Fallback if table doesn't exist or user not in table
        // This ensures the app works immediately without DB migration
        const fallbackRole = determineRole(currentUser.email);
        setProfile({
            id: currentUser.id,
            email: currentUser.email!,
            full_name: currentUser.user_metadata.full_name,
            avatar_url: currentUser.user_metadata.avatar_url,
            role: fallbackRole
        });
      }
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth_callback.html`,
            skipBrowserRedirect: true
        }
      });
      if (error) throw error;
      if (data?.url) {
          window.open(data.url, 'oauth_popup', 'width=600,height=700');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login with Google.");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      role: profile?.role || 'investor', 
      loading, 
      signInWithGoogle, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
