-- ====================================================================
-- FoodBridge – Food Waste Reduction & Donation System
-- PostgreSQL / Supabase Complete Database Schema & Security Policies
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Types & Tables

-- 2.1 Profiles Table (linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('donor', 'ngo', 'admin')),
    phone TEXT,
    organization_name TEXT,
    address TEXT,
    city TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.2 Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    donor_name TEXT NOT NULL,
    donor_phone TEXT,
    food_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN (
            'Cooked Meals',
            'Raw Ingredients / Groceries',
            'Packaged Foods',
            'Bakery & Bread',
            'Fruits & Vegetables',
            'Dairy Products',
            'Beverages',
            'Other'
        )
    ),
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL CHECK (
        unit IN ('servings', 'kg', 'boxes', 'packets', 'liters', 'trays', 'items')
    ),
    dietary_type TEXT NOT NULL DEFAULT 'Vegetarian' CHECK (
        dietary_type IN ('Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'All / Mixed')
    ),
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    preparation_time TIMESTAMPTZ NOT NULL,
    safe_pickup_deadline TIMESTAMPTZ NOT NULL,
    storage_instructions TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'requested', 'claimed', 'completed', 'cancelled', 'expired')
    ),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT deadline_after_prep CHECK (safe_pickup_deadline > preparation_time)
);

-- 2.3 Pickup Requests Table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
    ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quantity_requested NUMERIC NOT NULL CHECK (quantity_requested > 0),
    estimated_pickup_time TIMESTAMPTZ NOT NULL,
    message TEXT,
    contact_person TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')
    ),
    donor_note TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.4 Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Indexes for High Performance Search & Filters
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_category ON public.donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_city ON public.donations(city);
CREATE INDEX IF NOT EXISTS idx_donations_deadline ON public.donations(safe_pickup_deadline);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_donation_id ON public.pickup_requests(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_ngo_id ON public.pickup_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_donor_id ON public.pickup_requests(donor_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON public.pickup_requests(status);

-- 4. Automatic Updated At Timestamp Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_donations_updated_at ON public.donations;
CREATE TRIGGER set_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_pickup_requests_updated_at ON public.pickup_requests;
CREATE TRIGGER set_pickup_requests_updated_at
BEFORE UPDATE ON public.pickup_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Automatic Profile Creation on Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        phone,
        organization_name,
        address,
        city
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Community Member'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'organization_name',
        NEW.raw_user_meta_data->>'address',
        NEW.raw_user_meta_data->>'city'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        organization_name = EXCLUDED.organization_name,
        address = EXCLUDED.address,
        city = EXCLUDED.city;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Helper Function: Check If Current User Is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Row Level Security (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 7.1 Profiles RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile or admin" ON public.profiles;
CREATE POLICY "Users can update their own profile or admin"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- 7.2 Donations RLS Policies
DROP POLICY IF EXISTS "Donations are viewable by everyone" ON public.donations;
CREATE POLICY "Donations are viewable by everyone"
ON public.donations FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Donors and admins can create donations" ON public.donations;
CREATE POLICY "Donors and admins can create donations"
ON public.donations FOR INSERT
WITH CHECK (
    auth.uid() = donor_id OR public.is_admin()
);

DROP POLICY IF EXISTS "Donors can update their donations or admin" ON public.donations;
CREATE POLICY "Donors can update their donations or admin"
ON public.donations FOR UPDATE
USING (auth.uid() = donor_id OR public.is_admin())
WITH CHECK (auth.uid() = donor_id OR public.is_admin());

DROP POLICY IF EXISTS "Donors can delete their donations or admin" ON public.donations;
CREATE POLICY "Donors can delete their donations or admin"
ON public.donations FOR DELETE
USING (auth.uid() = donor_id OR public.is_admin());

-- 7.3 Pickup Requests RLS Policies
DROP POLICY IF EXISTS "Pickup requests viewable by participants or admin" ON public.pickup_requests;
CREATE POLICY "Pickup requests viewable by participants or admin"
ON public.pickup_requests FOR SELECT
USING (
    auth.uid() = ngo_id 
    OR auth.uid() = donor_id 
    OR public.is_admin()
);

DROP POLICY IF EXISTS "NGOs can create pickup requests" ON public.pickup_requests;
CREATE POLICY "NGOs can create pickup requests"
ON public.pickup_requests FOR INSERT
WITH CHECK (
    auth.uid() = ngo_id
);

DROP POLICY IF EXISTS "Participants and admins can update requests" ON public.pickup_requests;
CREATE POLICY "Participants and admins can update requests"
ON public.pickup_requests FOR UPDATE
USING (
    auth.uid() = ngo_id 
    OR auth.uid() = donor_id 
    OR public.is_admin()
);

-- 7.4 Contact Messages RLS Policies
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Only admin can view contact messages" ON public.contact_messages;
CREATE POLICY "Only admin can view contact messages"
ON public.contact_messages FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admin can update contact messages" ON public.contact_messages;
CREATE POLICY "Only admin can update contact messages"
ON public.contact_messages FOR UPDATE
USING (public.is_admin());
