import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone?: string;
          role: 'user' | 'admin' | 'dealer';
          avatar_url?: string;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string;
          role?: 'user' | 'admin' | 'dealer';
          avatar_url?: string;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
          role?: 'user' | 'admin' | 'dealer';
          avatar_url?: string;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      car_listings: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          year: number;
          price: number;
          currency: string;
          mileage: number;
          condition: string;
          transmission: string;
          fuel_type: string;
          description: string;
          location: string;
          images: string[];
          status: 'draft' | 'pending' | 'active' | 'sold' | 'rejected' | 'expired';
          featured: boolean;
          featured_until?: string;
          views: number;
          inquiries: number;
          created_at: string;
          updated_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          year: number;
          price: number;
          currency?: string;
          mileage: number;
          condition: string;
          transmission: string;
          fuel_type: string;
          description: string;
          location: string;
          images: string[];
          status?: 'draft' | 'pending' | 'active' | 'sold' | 'rejected' | 'expired';
          featured?: boolean;
          featured_until?: string;
          views?: number;
          inquiries?: number;
          created_at?: string;
          updated_at?: string;
          expires_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string;
          model?: string;
          year?: number;
          price?: number;
          currency?: string;
          mileage?: number;
          condition?: string;
          transmission?: string;
          fuel_type?: string;
          description?: string;
          location?: string;
          images?: string[];
          status?: 'draft' | 'pending' | 'active' | 'sold' | 'rejected' | 'expired';
          featured?: boolean;
          featured_until?: string;
          views?: number;
          inquiries?: number;
          created_at?: string;
          updated_at?: string;
          expires_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: 'mobile_money' | 'card' | 'bank_transfer';
          provider: string;
          type: 'listing_fee' | 'featured_upgrade' | 'subscription' | 'services';
          metadata: Record<string, any>;
          gateway_response: Record<string, any>;
          created_at: string;
          updated_at: string;
          verified_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: 'mobile_money' | 'card' | 'bank_transfer';
          provider: string;
          type: 'listing_fee' | 'featured_upgrade' | 'subscription' | 'services';
          metadata?: Record<string, any>;
          gateway_response?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          verified_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reference?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: 'mobile_money' | 'card' | 'bank_transfer';
          provider?: string;
          type?: 'listing_fee' | 'featured_upgrade' | 'subscription' | 'services';
          metadata?: Record<string, any>;
          gateway_response?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          verified_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'basic' | 'pro' | 'enterprise' | 'platinum';
          status: 'active' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string;
          auto_renew: boolean;
          benefits: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'basic' | 'pro' | 'enterprise' | 'platinum';
          status?: 'active' | 'cancelled' | 'expired';
          start_date: string;
          end_date: string;
          auto_renew?: boolean;
          benefits?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'basic' | 'pro' | 'premium';
          status?: 'active' | 'cancelled' | 'expired';
          start_date?: string;
          end_date?: string;
          auto_renew?: boolean;
          benefits?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          message: string;
          contact_info: Record<string, any>;
          status: 'pending' | 'responded' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          message: string;
          contact_info?: Record<string, any>;
          status?: 'pending' | 'responded' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          message?: string;
          contact_info?: Record<string, any>;
          status?: 'pending' | 'responded' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type CarListing = Database['public']['Tables']['car_listings']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];

export default supabase;
