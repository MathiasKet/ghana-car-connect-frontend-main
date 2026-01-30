import { supabase, User, CarListing, Payment, Subscription, Inquiry } from '@/lib/supabase';

export class SupabaseService {
  private static instance: SupabaseService;
  public supabase = supabase; // Expose supabase client for direct access

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Authentication
  async signUp(email: string, password: string, name: string, phone?: string) {
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

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          name,
          phone,
          role: 'user',
          is_verified: false,
          is_active: true,
        });
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        return { user, profile };
      }

      return { user: null, profile: null };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Car Listings
  async getCarListings(filters: any = {}) {
    try {
      let query = supabase
        .from('car_listings')
        .select(`
          *,
          users!car_listings_user_id_fkey (
            name,
            email,
            phone
          )
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.featured) {
        query = query.eq('featured', true);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get car listings error:', error);
      throw error;
    }
  }

  async getCarListingById(id: string) {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select(`
          *,
          users!car_listings_user_id_fkey (
            name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get car listing error:', error);
      throw error;
    }
  }

  async createCarListing(listing: Omit<CarListing, 'id' | 'created_at' | 'updated_at' | 'views' | 'inquiries'>) {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .insert({
          ...listing,
          views: 0,
          inquiries: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create car listing error:', error);
      throw error;
    }
  }

  async updateCarListing(id: string, updates: Partial<CarListing>) {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update car listing error:', error);
      throw error;
    }
  }

  async deleteCarListing(id: string) {
    try {
      const { error } = await supabase
        .from('car_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete car listing error:', error);
      throw error;
    }
  }

  async getUserCarListings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user car listings error:', error);
      throw error;
    }
  }

  // Payments
  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update payment error:', error);
      throw error;
    }
  }

  async getPaymentByReference(reference: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get payment error:', error);
      throw error;
    }
  }

  async getUserPayments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user payments error:', error);
      throw error;
    }
  }

  async getPaymentStats(userId?: string) {
    try {
      let query = supabase
        .from('payments')
        .select('*');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const payments = data || [];
      const totalPayments = payments.length;
      const successfulPayments = payments.filter(p => p.status === 'completed').length;
      const failedPayments = payments.filter(p => p.status === 'failed').length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        totalRevenue,
        recentPayments: payments.slice(0, 5),
      };
    } catch (error) {
      console.error('Get payment stats error:', error);
      throw error;
    }
  }

  // Subscriptions
  async createSubscription(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  async createBasicSubscription(userId: string) {
    try {
      const subscription = {
        user_id: userId,
        plan: 'basic',
        status: 'active',
        start_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        end_date: '2999-12-31', // Far future date for "forever" basic plan
        auto_renew: true,
        benefits: {
          listingLimit: 2,
          featuredListings: 0,
          prioritySupport: false,
          analytics: false,
          bulkListing: false,
          verifiedBadge: false
        }
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create basic subscription error:', error);
      throw error;
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get user subscription error:', error);
      throw error;
    }
  }

  // Inquiries
  async createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create inquiry error:', error);
      throw error;
    }
  }

  async getListingInquiries(listingId: string) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          buyers:users!inquiries_buyer_id_fkey (
            name,
            email,
            phone
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get listing inquiries error:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToTableChanges(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        callback
      )
      .subscribe();
  }

  subscribeToUserListings(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_${userId}_listings`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'car_listings',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  subscribeToUserPayments(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_${userId}_payments`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  // File upload
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  getPublicUrl(bucket: string, path: string) {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
      .data.publicUrl;
  }

  async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }
}

export default SupabaseService.getInstance();
