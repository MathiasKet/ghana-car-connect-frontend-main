-- =====================================================
-- CarConnect Ghana - Complete Database Schema
-- =====================================================
-- This schema creates all tables, indexes, policies, and triggers
-- needed for the CarConnect Ghana application

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

-- Create index for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

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
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  listing_type VARCHAR(20) DEFAULT 'standard' CHECK (listing_type IN ('standard', 'featured', 'premium')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for car_listings
CREATE INDEX idx_car_listings_user_id ON car_listings(user_id);
CREATE INDEX idx_car_listings_status ON car_listings(status);
CREATE INDEX idx_car_listings_make ON car_listings(make);
CREATE INDEX idx_car_listings_model ON car_listings(model);
CREATE INDEX idx_car_listings_price ON car_listings(price);
CREATE INDEX idx_car_listings_year ON car_listings(year);
CREATE INDEX idx_car_listings_location ON car_listings(location);
CREATE INDEX idx_car_listings_is_featured ON car_listings(is_featured);
CREATE INDEX idx_car_listings_created_at ON car_listings(created_at);
CREATE INDEX idx_car_listings_expires_at ON car_listings(expires_at);

-- Full-text search index
CREATE INDEX idx_car_listings_search ON car_listings USING gin(to_tsvector('english', make || ' ' || model || ' ' || COALESCE(description, '') || ' ' || COALESCE(location, '')));

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
  net_amount DECIMAL(12, 2) GENERATED ALWAYS AS (amount - gateway_fee) STORED,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(type);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_verified_at ON payments(verified_at);

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

-- Create indexes for subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX idx_subscriptions_next_payment_at ON subscriptions(next_payment_at);

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

-- Create indexes for inquiries
CREATE INDEX idx_inquiries_listing_id ON inquiries(listing_id);
CREATE INDEX idx_inquiries_buyer_id ON inquiries(buyer_id);
CREATE INDEX idx_inquiries_seller_id ON inquiries(seller_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);

-- =====================================================
-- 6. USER PROFILES (Additional user details)
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

-- Create indexes for user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- =====================================================
-- 7. LISTING VIEWS (Analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES car_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for listing_views
CREATE INDEX idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX idx_listing_views_user_id ON listing_views(user_id);
CREATE INDEX idx_listing_views_created_at ON listing_views(created_at);

-- =====================================================
-- 8. FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES car_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create indexes for favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);

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
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Listing views policies
CREATE POLICY "Anyone can create listing views" ON listing_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own listing views" ON listing_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all listing views" ON listing_views FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

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

-- Trigger to create user profile on signup
CREATE TRIGGER create_user_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE car_listings 
    SET views = views + 1 
    WHERE id = NEW.listing_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to increment views when listing is viewed
CREATE TRIGGER increment_listing_views_trigger
AFTER INSERT ON listing_views
FOR EACH ROW EXECUTE FUNCTION increment_listing_views();

-- Function to update listing inquiries count
CREATE OR REPLACE FUNCTION update_listing_inquiries()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE car_listings 
        SET inquiries = inquiries + 1 
        WHERE id = NEW.listing_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE car_listings 
        SET inquiries = GREATEST(inquiries - 1, 0) 
        WHERE id = OLD.listing_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update inquiries count
CREATE TRIGGER update_listing_inquiries_trigger
AFTER INSERT OR DELETE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_listing_inquiries();

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
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Create a sample admin user (you can remove this in production)
-- This will only work if you have email confirmation disabled
-- or you'll need to confirm the email in Supabase dashboard

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active listings with user info
CREATE OR REPLACE VIEW active_listings AS
SELECT 
    cl.*,
    u.name as seller_name,
    u.email as seller_email,
    u.phone as seller_phone,
    u.is_verified as seller_verified,
    up.company_name
FROM car_listings cl
JOIN users u ON cl.user_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE cl.status = 'active' AND cl.expires_at > NOW();

-- User statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(cl.id) as total_listings,
    COUNT(CASE WHEN cl.status = 'active' THEN 1 END) as active_listings,
    COUNT(CASE WHEN cl.status = 'sold' THEN 1 END) as sold_listings,
    COALESCE(SUM(cl.views), 0) as total_views,
    COALESCE(SUM(cl.inquiries), 0) as total_inquiries,
    COALESCE(SUM(p.amount), 0) as total_revenue
FROM users u
LEFT JOIN car_listings cl ON u.id = cl.user_id
LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'
GROUP BY u.id, u.name, u.email;

-- Payment statistics
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COALESCE(SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_revenue
FROM payments;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Schema setup complete!
-- Next steps:
-- 1. Enable real-time for all tables in Supabase Dashboard
-- 2. Test authentication flow
-- 3. Test CRUD operations
-- 4. Test file uploads
-- 5. Test real-time subscriptions

SELECT 'CarConnect Ghana Database Schema Setup Complete!' as status;
