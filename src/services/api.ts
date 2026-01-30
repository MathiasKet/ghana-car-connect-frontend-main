import supabaseApi from './supabaseApi';

// Supabase-only API service - no mock data fallback
class ApiService {
  // Authentication endpoints
  async login(email: string, password: string) {
    return await supabaseApi.login(email, password);
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return await supabaseApi.register(userData);
  }

  async getCurrentUser() {
    return await supabaseApi.getCurrentUser();
  }

  async logout() {
    return await supabaseApi.logout();
  }

  // Car listings endpoints
  async getCars(filters: any = {}) {
    return await supabaseApi.getCars(filters);
  }

  async getCarById(id: string) {
    return await supabaseApi.getCarById(id);
  }

  async createCar(carData: any) {
    return await supabaseApi.createCar(carData);
  }

  async updateCar(id: string, updates: any) {
    return await supabaseApi.updateCar(id, updates);
  }

  async deleteCar(id: string) {
    return await supabaseApi.deleteCar(id);
  }

  async getUserCars(userId: string) {
    return await supabaseApi.getUserCars(userId);
  }

  // Payment endpoints
  async createPayment(paymentData: any) {
    return await supabaseApi.createPayment(paymentData);
  }

  async verifyPayment(reference: string) {
    return await supabaseApi.verifyPayment(reference);
  }

  async getPaymentStats(userId?: string) {
    return await supabaseApi.getPaymentStats(userId);
  }

  async getUserPaymentHistory(userId?: string) {
    return await supabaseApi.getUserPaymentHistory(userId);
  }

  async getPaymentDetails(reference: string) {
    return await supabaseApi.getPaymentDetails(reference);
  }

  async updatePaymentStatus(reference: string, status: string) {
    return await supabaseApi.updatePayment(reference, { status });
  }

  // Subscription endpoints
  async createSubscription(subscriptionData: any) {
    return await supabaseApi.createSubscription(subscriptionData);
  }

  async getUserSubscription(userId: string) {
    return await supabaseApi.getUserSubscription(userId);
  }

  async createBasicSubscription(userId: string) {
    return await supabaseApi.createBasicSubscription(userId);
  }

  // Inquiry endpoints
  async createInquiry(inquiryData: any) {
    return await supabaseApi.createInquiry(inquiryData);
  }

  async getListingInquiries(listingId: string) {
    return await supabaseApi.getListingInquiries(listingId);
  }

  // File upload endpoints
  async uploadImage(file: File, type: 'car' | 'avatar' = 'car') {
    return await supabaseApi.uploadImage(file, type);
  }

  // Generic HTTP methods for external API calls
  async get(url: string, config?: RequestInit) {
    const response = await fetch(url, config);
    return response.json();
  }

  async post(url: string, data?: unknown, config?: RequestInit) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async put(url: string, data?: unknown, config?: RequestInit) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async delete(url: string, config?: RequestInit) {
    const response = await fetch(url, {
      method: 'DELETE',
      ...config,
    });
    return response.json();
  }

  async uploadImages(files: File[], type: 'car' | 'avatar' = 'car') {
    return await supabaseApi.uploadImages(files, type);
  }

  async deleteImage(path: string, type: 'car' | 'avatar' = 'car') {
    return await supabaseApi.deleteImage(path, type);
  }

  // Admin endpoints
  async getAllUsers() {
    return await supabaseApi.getAllUsers();
  }

  async getAllPayments() {
    return await supabaseApi.getAllPayments();
  }

  async getPaymentMethods() {
    return await supabaseApi.getPaymentMethods();
  }

  async getAllListings() {
    return await supabaseApi.getAllListings();
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return await supabaseApi.updateUserStatus(userId, isActive);
  }

  async updateListingStatus(listingId: string, status: string) {
    return await supabaseApi.updateListingStatus(listingId, status);
  }

  async updateListingFeatured(listingId: string, featured: boolean) {
    return await supabaseApi.updateListingFeatured(listingId, featured);
  }

  // Utility methods
  async getAuthToken() {
    return await supabaseApi.getAuthToken();
  }

  isSupabaseAvailable(): boolean {
    return supabaseApi.isSupabaseAvailable();
  }
}

export default new ApiService();
