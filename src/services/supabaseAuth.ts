import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'dealer';
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

class SupabaseAuthService {
  private static instance: SupabaseAuthService;
  private authState: AuthState = {
    user: null,
    loading: false,
    error: null,
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  constructor() {
    // Initialize auth state
    this.initializeAuth();
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.handleAuthChange(event, session);
    });
  }

  private async initializeAuth() {
    try {
      this.setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.setUser(null);
      }
    } catch (error) {
      this.setError('Failed to initialize authentication');
    } finally {
      this.setLoading(false);
    }
  }

  private async handleAuthChange(event: string, session: any) {
    console.log('Auth state changed:', event, session);
    
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    } else {
      this.setUser(null);
    }
  }

  private async loadUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        this.setError('Failed to load user profile');
        return;
      }

      this.setUser(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.setError('Failed to load user profile');
    }
  }

  async signUp(email: string, password: string, name: string, phone?: string) {
    try {
      this.setLoading(true);
      this.setError(null);

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
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      // User profile will be created automatically by the database trigger
      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign up';
      this.setError(message);
      return { success: false, error: message };
    } finally {
      this.setLoading(false);
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.setLoading(true);
      this.setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign in';
      this.setError(message);
      return { success: false, error: message };
    } finally {
      this.setLoading(false);
    }
  }

  async signInWithGoogle() {
    try {
      this.setLoading(true);
      this.setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        this.setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      const message = error.message || 'Failed to sign in with Google';
      this.setError(message);
      return { success: false, error: message };
    } finally {
      this.setLoading(false);
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      this.setUser(null);
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to sign out';
      this.setError(message);
      return { success: false, error: message };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to reset password';
      return { success: false, error: message };
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to update password';
      return { success: false, error: message };
    }
  }

  async updateProfile(updates: Partial<AuthUser>) {
    try {
      if (!this.authState.user) {
        return { success: false, error: 'No authenticated user' };
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', this.authState.user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      this.setUser({ ...this.authState.user, ...updates });
      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Failed to update profile';
      return { success: false, error: message };
    }
  }

  async uploadAvatar(file: File) {
    try {
      if (!this.authState.user) {
        return { success: false, error: 'No authenticated user' };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${this.authState.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile with avatar URL
      const { error: updateError } = await this.updateProfile({
        avatar_url: publicUrl,
      });

      if (updateError) {
        return { success: false, error: updateError };
      }

      return { success: true, avatarUrl: publicUrl };
    } catch (error: any) {
      const message = error.message || 'Failed to upload avatar';
      return { success: false, error: message };
    }
  }

  // State management
  private setUser(user: AuthUser | null) {
    this.authState.user = user;
    this.notifyListeners();
  }

  private setLoading(loading: boolean) {
    this.authState.loading = loading;
    this.notifyListeners();
  }

  private setError(error: string | null) {
    this.authState.error = error;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.authState }));
  }

  // Public state access
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    listener({ ...this.authState });

    return () => {
      this.listeners.delete(listener);
    };
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.authState.user;
  }

  isAdmin(): boolean {
    return this.authState.user?.role === 'admin';
  }

  isDealer(): boolean {
    return this.authState.user?.role === 'dealer';
  }

  isVerified(): boolean {
    return this.authState.user?.is_verified || false;
  }

  isActive(): boolean {
    return this.authState.user?.is_active || false;
  }

  getCurrentUser(): AuthUser | null {
    return this.authState.user;
  }

  // Get JWT token for API calls
  async getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }
}

export default SupabaseAuthService.getInstance();
