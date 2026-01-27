-- Add preferred_categories column to profiles table for onboarding
-- This stores the product categories selected during onboarding

DO $$ 
BEGIN
    -- Add preferred_categories column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'preferred_categories'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN preferred_categories TEXT[] DEFAULT '{}';
    END IF;
END $$;
