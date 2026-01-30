import supabaseService from './supabaseService';
import supabaseAuthService from './supabaseAuth';

// Enhanced API service that uses Supabase as the backend
class SupabaseApiService {
  private static instance: SupabaseApiService;

  static getInstance(): SupabaseApiService {
    if (!SupabaseApiService.instance) {
      SupabaseApiService.instance = new SupabaseApiService();
    }
    return SupabaseApiService.instance;
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    try {
      const result = await supabaseAuthService.signIn(email, password);
      if (result.success && result.data?.user) {
        const profile = await supabaseService.getCurrentUser();
        return {
          user: profile.user,
          token: result.data.session?.access_token,
          profile: profile.profile,
        };
      }
      throw new Error(result.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    try {
      const result = await supabaseAuthService.signUp(
        userData.email,
        userData.password,
        userData.name,
        userData.phone
      );
      
      if (result.success) {
        return {
          message: 'Registration successful. Please check your email to verify your account.',
          user: result.data?.user,
        };
      }
      throw new Error(result.error || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const result = await supabaseService.getCurrentUser();
      return result.profile || result.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      return await supabaseAuthService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Car listings endpoints
  async getCars(filters: any = {}) {
    try {
      return await supabaseService.getCarListings(filters);
    } catch (error) {
      console.error('Get cars error:', error);
      throw error;
    }
  }

  async getCarById(id: string) {
    try {
      return await supabaseService.getCarListingById(id);
    } catch (error) {
      console.error('Get car by ID error:', error);
      throw error;
    }
  }

  async createCar(carData: any) {
    try {
      return await supabaseService.createCarListing(carData);
    } catch (error) {
      console.error('Create car error:', error);
      throw error;
    }
  }

  async updateCar(id: string, updates: any) {
    try {
      return await supabaseService.updateCarListing(id, updates);
    } catch (error) {
      console.error('Update car error:', error);
      throw error;
    }
  }

  async deleteCar(id: string) {
    try {
      return await supabaseService.deleteCarListing(id);
    } catch (error) {
      console.error('Delete car error:', error);
      throw error;
    }
  }

  async getUserCars(userId: string) {
    try {
      return await supabaseService.getUserCarListings(userId);
    } catch (error) {
      console.error('Get user cars error:', error);
      throw error;
    }
  }

  // Payment endpoints
  async createPayment(paymentData: any) {
    try {
      return await supabaseService.createPayment(paymentData);
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: any) {
    try {
      return await supabaseService.updatePayment(id, updates);
    } catch (error) {
      console.error('Update payment error:', error);
      throw error;
    }
  }

  async verifyPayment(reference: string) {
    try {
      const payment = await supabaseService.getPaymentByReference(reference);
      
      // Update payment status to completed if it's pending
      if (payment && payment.status === 'pending') {
        const updatedPayment = await supabaseService.updatePayment(payment.id, {
          status: 'completed',
          verified_at: new Date().toISOString(),
        });
        return updatedPayment;
      }
      
      return payment;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  async getPaymentStats(userId?: string) {
    try {
      return await supabaseService.getPaymentStats(userId);
    } catch (error) {
      console.error('Get payment stats error:', error);
      throw error;
    }
  }

  async getUserPaymentHistory(userId?: string) {
    try {
      if (userId) {
        return await supabaseService.getUserPayments(userId);
      }
      
      // If no userId provided, get current user's payments
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser.user) {
        return await supabaseService.getUserPayments(currentUser.user.id);
      }
      
      return [];
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  }

  async getPaymentDetails(reference: string) {
    try {
      return await supabaseService.getPaymentByReference(reference);
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }

  // Subscription endpoints
  async createSubscription(subscriptionData: any) {
    try {
      return await supabaseService.createSubscription(subscriptionData);
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  async createBasicSubscription(userId: string) {
    try {
      return await supabaseService.createBasicSubscription(userId);
    } catch (error) {
      console.error('Create basic subscription error:', error);
      throw error;
    }
  }

  async getUserSubscription(userId: string) {
    try {
      return await supabaseService.getUserSubscription(userId);
    } catch (error) {
      console.error('Get user subscription error:', error);
      throw error;
    }
  }

  // Inquiry endpoints
  async createInquiry(inquiryData: any) {
    try {
      return await supabaseService.createInquiry(inquiryData);
    } catch (error) {
      console.error('Create inquiry error:', error);
      throw error;
    }
  }

  async getListingInquiries(listingId: string) {
    try {
      return await supabaseService.getListingInquiries(listingId);
    } catch (error) {
      console.error('Get listing inquiries error:', error);
      throw error;
    }
  }

  // File upload endpoints
  async uploadImage(file: File, type: 'car' | 'avatar' = 'car') {
    try {
      const bucket = type === 'car' ? 'car-images' : 'avatars';
      const fileName = `${Date.now()}-${file.name}`;
      
      const result = await supabaseService.uploadFile(bucket, fileName, file);
      const publicUrl = supabaseService.getPublicUrl(bucket, fileName);
      
      return {
        url: publicUrl,
        path: result.path,
      };
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  async uploadImages(files: File[], type: 'car' | 'avatar' = 'car') {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, type));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload images error:', error);
      throw error;
    }
  }

  async deleteImage(path: string, type: 'car' | 'avatar' = 'car') {
    try {
      const bucket = type === 'car' ? 'car-images' : 'avatars';
      return await supabaseService.deleteFile(bucket, path);
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }

  // Admin endpoints
  async getAllUsers() {
    try {
      const { data, error } = await supabaseService.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  async getAllPayments() {
    try {
      const { data, error } = await supabaseService.supabase
        .from('payments')
        .select(`
          *,
          users!payments_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all payments error:', error);
      throw error;
    }
  }

  async getPaymentMethods() {
    try {
      // Get unique payment methods from payments table with user info
      const { data, error } = await supabaseService.supabase
        .from('payments')
        .select(`
          payment_method,
          provider,
          users!payments_user_id_fkey (
            id,
            name,
            email
          ),
          created_at
        `)
        .not('payment_method', 'is', null);

      if (error) throw error;

      // Process data to get unique payment methods per user
      const uniqueMethods = new Map();
      
      (data || []).forEach((payment: any) => {
        const user = Array.isArray(payment.users) ? payment.users[0] : payment.users;
        if (!user) return; // Skip if user data is missing
        
        const key = `${user.id}-${payment.payment_method}`;
        if (!uniqueMethods.has(key)) {
          uniqueMethods.set(key, {
            id: key,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            type: payment.payment_method,
            provider: payment.provider,
            lastFour: '****', // We don't store actual card details for security
            isDefault: payment.payment_method === 'card', // Assume card is default
            usage: 1,
            status: 'active',
            added: payment.created_at
          });
        } else {
          // Increment usage count
          const existing = uniqueMethods.get(key);
          existing.usage += 1;
        }
      });

      return Array.from(uniqueMethods.values());
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  async getAllListings() {
    try {
      const { data, error } = await supabaseService.supabase
        .from('car_listings')
        .select(`
          *,
          users!car_listings_user_id_fkey (
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all listings error:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    try {
      const { data, error } = await supabaseService.supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  }

  async updateListingStatus(listingId: string, status: string) {
    try {
      const { data, error } = await supabaseService.supabase
        .from('car_listings')
        .update({ status })
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update listing status error:', error);
      throw error;
    }
  }

  async updateListingFeatured(listingId: string, featured: boolean) {
    try {
      const updates: any = { featured };
      if (featured) {
        updates.featured_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      }

      const { data, error } = await supabaseService.supabase
        .from('car_listings')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update listing featured error:', error);
      throw error;
    }
  }

  // Utility methods
  async getAuthToken() {
    try {
      return await supabaseAuthService.getToken();
    } catch (error) {
      console.error('Get auth token error:', error);
      return null;
    }
  }

  // Check if Supabase is available
  isSupabaseAvailable(): boolean {
    try {
      return !!supabaseService.supabase;
    } catch {
      return false;
    }
  }
}

export default SupabaseApiService.getInstance();
