-- Moneytag Supabase Database Schema (White UI Edition)

CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('freelancer', 'client', 'company')) DEFAULT 'freelancer',
    nid_number TEXT,
    nid_image_url TEXT,
    profile_photo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
    connects_balance INT DEFAULT 100,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT,
    payment_method TEXT,
    trx_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
