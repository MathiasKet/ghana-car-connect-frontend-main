import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser, AuthState } from '@/services/supabaseAuth';
import api from '@/services/api';

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const currentUserIdRef = useRef<string | null>(null);

  // Create Basic subscription for new users
  const createBasicSubscriptionForUser = async (userId: string) => {
    try {
      // Check if user already has a subscription
      const existingSubscription = await api.getUserSubscription(userId);
      if (existingSubscription) {
        // User already has a subscription
        return;
      }

      // Create Basic subscription
      await api.createBasicSubscription(userId);
      // Basic subscription created successfully
    } catch (error) {
      console.error('Failed to create basic subscription:', error);
      // Don't throw error - this shouldn't block login
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          currentUserIdRef.current = null;
          setAuthState({ user: null, loading: false, error: null });
          return;
        }
        
        if (session?.user) {
          currentUserIdRef.current = session.user.id;
          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            phone: session.user.user_metadata?.phone,
            role: session.user.user_metadata?.role || 'user',
            avatar_url: session.user.user_metadata?.avatar_url,
            is_active: true,
            is_verified: session.user.user_metadata?.is_verified || false,
          };
          localStorage.setItem('user', JSON.stringify(user));
          setAuthState({ user, loading: false, error: null });
        } else {
          currentUserIdRef.current = null;
          localStorage.removeItem('user');
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        // Handle AbortError and other session errors gracefully
        if (error instanceof Error && error.name === 'AbortError') {
          // Session request aborted - normal during cleanup
        } else {
          console.error('Error getting initial session:', error);
        }
        currentUserIdRef.current = null;
        setAuthState({ user: null, loading: false, error: null });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        // Prevent rapid state changes by debouncing
        if (event === 'INITIAL_SESSION') {
          // Only process if the session actually changed
          const newUserId = session?.user?.id;
          
          if (currentUserIdRef.current !== newUserId) {
            currentUserIdRef.current = newUserId;
            
            if (session?.user) {
              const user: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                phone: session.user.user_metadata?.phone,
                role: session.user.user_metadata?.role || 'user',
                avatar_url: session.user.user_metadata?.avatar_url,
                is_active: true,
                is_verified: session.user.user_metadata?.is_verified || false,
              };
              setAuthState({ user, loading: false, error: null });
            } else {
              setAuthState({ user: null, loading: false, error: null });
            }
          }
        } else if (event === 'SIGNED_IN') {
          // Handle successful sign in
          if (session?.user) {
            currentUserIdRef.current = session.user.id;
            const user: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              phone: session.user.user_metadata?.phone,
              role: session.user.user_metadata?.role || 'user',
              avatar_url: session.user.user_metadata?.avatar_url,
              is_active: true,
              is_verified: session.user.user_metadata?.is_verified || false,
            };
            localStorage.setItem('user', JSON.stringify(user));
            setAuthState({ user, loading: false, error: null });
            
            // Create Basic subscription for new users (with error handling)
            try {
              await createBasicSubscriptionForUser(session.user.id);
            } catch (error) {
              console.error('Failed to create basic subscription:', error);
              // Don't block login for subscription creation failure
            }
          }
        } else if (event === 'SIGNED_OUT') {
          currentUserIdRef.current = null;
          localStorage.removeItem('user');
          setAuthState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // Empty dependency array - only run once

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign up';
      setAuthState(prev => ({ ...prev, error: message }));
      return { success: false, error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      // Auth state will be updated by the listener
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign in';
      setAuthState(prev => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign in with Google';
      setAuthState(prev => ({ ...prev, error: message }));
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({ user: null, loading: false, error: null });
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to reset password';
      setAuthState(prev => ({ ...prev, error: message }));
      return { success: false, error: message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to update password';
      setAuthState(prev => ({ ...prev, error: message }));
      return { success: false, error: message };
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    // This would need to be implemented with actual database updates
    return { success: false, error: 'Not implemented' };
  };

  const uploadAvatar = async (file: File) => {
    // This would need to be implemented with actual file upload
    return { success: false, error: 'Not implemented' };
  };

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  return {
    // State
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    
    // Auth methods
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    
    // Profile methods
    updateProfile,
    uploadAvatar,
    
    // Utility methods
    getToken,
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.role === 'admin',
    isDealer: authState.user?.role === 'dealer',
    isVerified: authState.user?.is_verified || false,
    isActive: authState.user?.is_active || false,
    
    // Raw auth service access
    authService: null, // Removed to avoid circular dependency
  };
};

export default useSupabaseAuth;
