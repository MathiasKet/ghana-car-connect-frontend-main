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

const defaultFeaturedCars: FeaturedCar[] = [];

const defaultTestimonials: Testimonial[] = [];

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
