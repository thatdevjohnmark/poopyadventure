-- Supabase SQL Setup Script
-- Run this in your Supabase SQL Editor to create the necessary tables

-- Create user_profiles table (extends auth.users with custom data)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    notifications_enabled BOOLEAN DEFAULT true,
    reminder_time TIME DEFAULT '09:00:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create poop_entries table
CREATE TABLE IF NOT EXISTS public.poop_entries (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration INTEGER NOT NULL,
    bristol TEXT NOT NULL CHECK (bristol IN ('1', '2', '3', '4', '5', '6', '7')),
    color TEXT NOT NULL,
    volume TEXT NOT NULL CHECK (volume IN ('small', 'medium', 'large')),
    shape TEXT,
    smell TEXT,
    pain INTEGER NOT NULL CHECK (pain >= 0 AND pain <= 10),
    has_blood BOOLEAN DEFAULT FALSE,
    has_mucus BOOLEAN DEFAULT FALSE,
    symptoms JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_poop_entries_timestamp ON public.poop_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_poop_entries_user_id ON public.poop_entries(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.poop_entries ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own entries
CREATE POLICY "Users can view own entries" 
    ON public.poop_entries 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own entries
CREATE POLICY "Users can insert own entries" 
    ON public.poop_entries 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own entries
CREATE POLICY "Users can update own entries" 
    ON public.poop_entries 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create policy: Users can delete their own entries
CREATE POLICY "Users can delete own entries" 
    ON public.poop_entries 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_poop_entries_updated_at 
    BEFORE UPDATE ON public.poop_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW public.poop_stats AS
SELECT 
    user_id,
    COUNT(*) as total_entries,
    AVG(duration) as avg_duration,
    AVG(pain::numeric) as avg_pain,
    COUNT(CASE WHEN has_blood THEN 1 END) as blood_count,
    COUNT(CASE WHEN has_mucus THEN 1 END) as mucus_count,
    MODE() WITHIN GROUP (ORDER BY bristol) as most_common_bristol
FROM public.poop_entries
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.poop_stats TO authenticated;

COMMENT ON TABLE public.poop_entries IS 'Stores poop tracking entries for all users';
COMMENT ON COLUMN public.poop_entries.bristol IS 'Bristol Stool Scale type (1-7)';
COMMENT ON COLUMN public.poop_entries.symptoms IS 'Array of symptoms as JSON';
