import api from './api';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  rentalPrice?: number;
  category: 'buy' | 'rent';
  condition: 'excellent' | 'good' | 'fair';
  fuelType: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  images: string[];
  features: string[];
  available?: boolean;
  featured: boolean;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  inquiries: number;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    verified: boolean;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  search?: string;
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: 'buy' | 'rent';
  condition?: string;
  fuelType?: string;
  transmission?: string;
  location?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateCarData {
  make: string;
  model: string;
  year: number;
  price: number;
  rentalPrice?: number;
  category: 'buy' | 'rent';
  condition: 'excellent' | 'good' | 'fair';
  fuelType: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  images: string[];
  features: string[];
  featured?: boolean;
}

export interface UpdateCarData extends Partial<CreateCarData> {
  status?: 'active' | 'pending' | 'sold' | 'draft';
}

export interface CarResponse {
  cars: Car[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const carService = {
  // Get all cars with filters
  async getCars(filters: CarFilters = {}): Promise<CarResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/cars?${params.toString()}`);
    return response.data;
  },

  // Get car by ID
  async getCarById(id: string): Promise<Car> {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  // Create new car listing
  async createCar(carData: CreateCarData): Promise<Car> {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  // Update car listing
  async updateCar(id: string, carData: UpdateCarData): Promise<Car> {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  // Delete car listing
  async deleteCar(id: string): Promise<void> {
    await api.delete(`/cars/${id}`);
  },

  // Get user's cars
  async getUserCars(userId?: string): Promise<Car[]> {
    const endpoint = userId ? `/users/${userId}/cars` : '/user/cars';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Get featured cars
  async getFeaturedCars(category?: 'buy' | 'rent'): Promise<Car[]> {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`/cars/featured${params}`);
    return response.data;
  },

  // Search cars
  async searchCars(searchQuery: string, filters: CarFilters = {}): Promise<CarResponse> {
    const params = new URLSearchParams();
    params.append('search', searchQuery);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/cars/search?${params.toString()}`);
    return response.data;
  },

  // Get car makes and models
  async getCarMakes(): Promise<string[]> {
    const response = await api.get('/cars/makes');
    return response.data;
  },

  // Get car models by make
  async getCarModels(make: string): Promise<string[]> {
    const response = await api.get(`/cars/models/${make}`);
    return response.data;
  },

  // Increment car views
  async incrementViews(id: string): Promise<void> {
    await api.post(`/cars/${id}/view`);
  },

  // Save car to favorites
  async saveToFavorites(id: string): Promise<void> {
    await api.post(`/cars/${id}/favorite`);
  },

  // Remove from favorites
  async removeFromFavorites(id: string): Promise<void> {
    await api.delete(`/cars/${id}/favorite`);
  },

  // Get user's favorite cars
  async getFavoriteCars(): Promise<Car[]> {
    const response = await api.get('/user/favorites');
    return response.data;
  },

  // Send inquiry about car
  async sendInquiry(carId: string, message: string): Promise<void> {
    await api.post(`/cars/${carId}/inquiry`, { message });
  },

  // Get car inquiries (for car owners)
  async getCarInquiries(carId: string): Promise<any[]> {
    const response = await api.get(`/cars/${carId}/inquiries`);
    return response.data;
  },

  // Get car statistics
  async getCarStats(id: string): Promise<any> {
    const response = await api.get(`/cars/${id}/stats`);
    return response.data;
  },

  // Upload car images
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/car-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete car image
  async deleteImage(imageUrl: string): Promise<void> {
    await api.delete('/upload/image', { data: { imageUrl } });
  },
};
