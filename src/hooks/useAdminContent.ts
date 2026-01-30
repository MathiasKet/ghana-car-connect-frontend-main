import { useState, useEffect } from 'react';

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  searchTabs: {
    buy: {
      enabled: boolean;
      placeholder: string;
      carTypes: string[];
    };
    rent: {
      enabled: boolean;
      pickupPlaceholder: string;
      pickupDatePlaceholder: string;
      returnDatePlaceholder: string;
    };
    sell: {
      enabled: boolean;
      makes: string[];
      years: string[];
    };
  };
}

export interface FeaturedCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  category: 'buy' | 'rent';
  rentalPrice?: number;
  available?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  featured: boolean;
  verified: boolean;
  dateAdded: string;
}

const defaultHeroContent: HeroContent = {
  title: 'Find Your Perfect Ride in Ghana',
  subtitle: 'Buy, sell, or rent cars with confidence. The easiest way to navigate the Ghanaian automotive market.',
  description: '',
  badges: ['Trusted by 10,000+ Ghanaians', 'Top-rated service', 'Secure payments'],
  searchTabs: {
    buy: {
      enabled: true,
      placeholder: 'Location (e.g. Accra, Kumasi)',
      carTypes: ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury'],
    },
    rent: {
      enabled: true,
      pickupPlaceholder: 'Pick-up location',
      pickupDatePlaceholder: 'Pick-up date',
      returnDatePlaceholder: 'Return date',
    },
    sell: {
      enabled: true,
      makes: ['Toyota', 'Honda', 'Nissan', 'Ford', 'Other'],
      years: ['2023', '2022', '2021', '2020', 'Older'],
    },
  },
};

const defaultFeaturedCars: FeaturedCar[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 85000,
    location: 'Accra',
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Excellent',
    description: 'Well-maintained Toyota Camry with full service history. Perfect for family use.',
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    featured: true,
    category: 'buy'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 120000,
    location: 'Kumasi',
    mileage: 8000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Like New',
    description: 'Nearly new Honda CR-V SUV with advanced safety features and great fuel economy.',
    imageUrl: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&h=600&fit=crop',
    featured: true,
    category: 'buy'
  },
  {
    id: '3',
    make: 'Nissan',
    model: 'Sentra',
    year: 2021,
    price: 75000,
    location: 'Takoradi',
    mileage: 25000,
    transmission: 'Manual',
    fuelType: 'Petrol',
    condition: 'Good',
    description: 'Reliable Nissan Sentra, great for daily commuting with excellent fuel efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c6f664?w=800&h=600&fit=crop',
    featured: true,
    category: 'rent',
    rentalPrice: 150,
    available: true
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Kwame Asante',
    role: 'Business Owner',
    company: 'Accra Logistics Ltd',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'CarConnect Ghana made it so easy to find the perfect vehicle for my business. The process was smooth, and the customer service was exceptional. Highly recommended!',
    featured: true,
    verified: true,
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    name: 'Adjoa Mensah',
    role: 'Marketing Manager',
    company: 'Tech Ghana',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'I rented a car for a business trip and was impressed by the quality and service. The vehicle was clean, well-maintained, and the booking process was seamless.',
    featured: true,
    verified: true,
    dateAdded: '2024-01-10'
  },
  {
    id: '3',
    name: 'Kojo Bonsu',
    role: 'Software Developer',
    company: 'Digital Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    content: 'Sold my car through CarConnect Ghana and got a great price. The platform connected me with serious buyers quickly. The whole process took less than a week!',
    featured: false,
    verified: true,
    dateAdded: '2024-01-05'
  }
];

export const useAdminContent = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>(defaultFeaturedCars);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load content from localStorage
    const loadContent = () => {
      try {
        const savedHero = localStorage.getItem('heroContent');
        const savedCars = localStorage.getItem('featuredCars');
        const savedTestimonials = localStorage.getItem('testimonials');

        if (savedHero) {
          setHeroContent(JSON.parse(savedHero));
        }
        if (savedCars) {
          setFeaturedCars(JSON.parse(savedCars));
        }
        if (savedTestimonials) {
          setTestimonials(JSON.parse(savedTestimonials));
        }
      } catch (error) {
        console.error('Error loading admin content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    // Listen for storage changes (for real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'heroContent' && e.newValue) {
        setHeroContent(JSON.parse(e.newValue));
      }
      if (e.key === 'featuredCars' && e.newValue) {
        setFeaturedCars(JSON.parse(e.newValue));
      }
      if (e.key === 'testimonials' && e.newValue) {
        setTestimonials(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    heroContent,
    featuredCars,
    testimonials,
    loading,
    refreshContent: () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
    }
  };
};
