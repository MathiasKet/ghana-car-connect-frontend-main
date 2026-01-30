-- =====================================================
-- CarConnect Ghana - Safe Database Schema
-- =====================================================
-- This schema first checks existing table structure before making changes

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'dealer')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Add missing columns to users table if they don't exist
DO $$
BEGIN
    -- Check if column exists before adding it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'dealer'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
        ALTER TABLE users ADD COLUMN location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
        CREATE INDEX idx_users_role ON users(role);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_is_active') THEN
        CREATE INDEX idx_users_is_active ON users(is_active);
    END IF;
END $$;

-- =====================================================
-- 2. CAR LISTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS car_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
  currency VARCHAR(3) DEFAULT 'GHS',
  mileage INTEGER,
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic', 'cvt')),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
  color VARCHAR(50),
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'sold', 'rejected', 'expired')),
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to car_listings table if they don't exist
DO $$
BEGIN
    -- Check if column exists before adding it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'is_featured') THEN
        ALTER TABLE car_listings ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'listing_type') THEN
        ALTER TABLE car_listings ADD COLUMN listing_type VARCHAR(20) DEFAULT 'standard' CHECK (listing_type IN ('standard', 'featured', 'premium'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'payment_status') THEN
        ALTER TABLE car_listings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'expires_at') THEN
        ALTER TABLE car_listings ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'updated_at') THEN
        ALTER TABLE car_listings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist (only for columns that exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'user_id') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_user_id') THEN
        CREATE INDEX idx_car_listings_user_id ON car_listings(user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'status') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_status') THEN
        CREATE INDEX idx_car_listings_status ON car_listings(status);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'make') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_make') THEN
        CREATE INDEX idx_car_listings_make ON car_listings(make);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'model') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_model') THEN
        CREATE INDEX idx_car_listings_model ON car_listings(model);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'price') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_price') THEN
        CREATE INDEX idx_car_listings_price ON car_listings(price);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'year') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_year') THEN
        CREATE INDEX idx_car_listings_year ON car_listings(year);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'location') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_location') THEN
        CREATE INDEX idx_car_listings_location ON car_listings(location);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'is_featured') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_is_featured') THEN
        CREATE INDEX idx_car_listings_is_featured ON car_listings(is_featured);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'created_at') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_created_at') THEN
        CREATE INDEX idx_car_listings_created_at ON car_listings(created_at);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_listings' AND column_name = 'expires_at') AND
       NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_car_listings_expires_at') THEN
        CREATE INDEX idx_car_listings_expires_at ON car_listings(expires_at);
    END IF;
END $$;

-- =====================================================
-- 3. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'GHS',
  type VARCHAR(20) NOT NULL CHECK (type IN ('listing', 'subscription', 'services', 'refund')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'mobile_money', 'bank_transfer', 'wallet')),
  provider VARCHAR(50) DEFAULT 'paystack',
  metadata JSONB DEFAULT '{}',
  gateway_fee DECIMAL(10, 2) DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to payments table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'updated_at') THEN
        ALTER TABLE payments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
        CREATE INDEX idx_payments_user_id ON payments(user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_reference') THEN
        CREATE INDEX idx_payments_reference ON payments(reference);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
        CREATE INDEX idx_payments_status ON payments(status);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_type') THEN
        CREATE INDEX idx_payments_type ON payments(type);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_created_at') THEN
        CREATE INDEX idx_payments_created_at ON payments(created_at);
    END IF;
END $$;

-- =====================================================
-- 4. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('basic', 'pro', 'enterprise', 'platinum')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle VARCHAR(10) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'GHS',
  auto_renew BOOLEAN DEFAULT true,
  benefits JSONB DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  last_payment_at TIMESTAMP WITH TIME ZONE,
  next_payment_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_user_id') THEN
        CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_status') THEN
        CREATE INDEX idx_subscriptions_status ON subscriptions(status);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_plan') THEN
        CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
    END IF;
END $$;

-- =====================================================
-- 5. INQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES car_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  contact_method VARCHAR(20) CHECK (contact_method IN ('email', 'phone', 'whatsapp')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed', 'spam')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inquiries_listing_id') THEN
        CREATE INDEX idx_inquiries_listing_id ON inquiries(listing_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inquiries_buyer_id') THEN
        CREATE INDEX idx_inquiries_buyer_id ON inquiries(buyer_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inquiries_seller_id') THEN
        CREATE INDEX idx_inquiries_seller_id ON inquiries(seller_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inquiries_status') THEN
        CREATE INDEX idx_inquiries_status ON inquiries(status);
    END IF;
END $$;

-- =====================================================
-- 6. USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  company_address TEXT,
  website VARCHAR(255),
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  privacy_settings JSONB DEFAULT '{"show_phone": true, "show_email": false}',
  stats JSONB DEFAULT '{"total_listings": 0, "active_listings": 0, "sold_cars": 0, "total_views": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_profiles_user_id') THEN
        CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
    END IF;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

DROP POLICY IF EXISTS "Users can view all active listings" ON car_listings;
DROP POLICY IF EXISTS "Users can view own listings" ON car_listings;
DROP POLICY IF EXISTS "Users can create own listings" ON car_listings;
DROP POLICY IF EXISTS "Users can update own listings" ON car_listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON car_listings;
DROP POLICY IF EXISTS "Admins can view all listings" ON car_listings;
DROP POLICY IF EXISTS "Admins can update all listings" ON car_listings;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;

DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Users can update own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;

DROP POLICY IF EXISTS "Users can view own profile details" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile details" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile details" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profile details" ON user_profiles;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Car listings policies
CREATE POLICY "Users can view all active listings" ON car_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own listings" ON car_listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own listings" ON car_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON car_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON car_listings FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all listings" ON car_listings FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can update all listings" ON car_listings FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Inquiries policies
CREATE POLICY "Users can view own inquiries" ON inquiries FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update own inquiries" ON inquiries FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Admins can view all inquiries" ON inquiries FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- User profiles policies
CREATE POLICY "Users can view own profile details" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile details" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile details" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profile details" ON user_profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_car_listings_updated_at ON car_listings;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_car_listings_updated_at BEFORE UPDATE ON car_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Set user role from metadata if provided
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        NEW.role = NEW.raw_user_meta_data->>'role';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Trigger to create user profile on signup
CREATE TRIGGER create_user_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to set listing expiration
CREATE OR REPLACE FUNCTION set_listing_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- Set expiration to 30 days from creation for active listings
    IF NEW.status = 'active' AND NEW.expires_at IS NULL THEN
        NEW.expires_at = NEW.created_at + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_listing_expiration_trigger ON car_listings;

-- Trigger to set expiration
CREATE TRIGGER set_listing_expiration_trigger
BEFORE INSERT OR UPDATE ON car_listings
FOR EACH ROW EXECUTE FUNCTION set_listing_expiration();

-- =====================================================
-- STORAGE BUCKETS (for file uploads)
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('car-images', 'car-images', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Storage policies
CREATE POLICY "Users can upload car images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'car-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Anyone can view car images" ON storage.objects FOR SELECT USING (
  bucket_id = 'car-images'
);

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (
  bucket_id = 'avatars'
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'CarConnect Ghana Safe Database Schema Setup Complete!' as status;
