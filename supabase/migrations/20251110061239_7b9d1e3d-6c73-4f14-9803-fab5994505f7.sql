-- Add preferred_language column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Add a comment to document the column
COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred language code (e.g., en, es, fr, de, hi, etc.)';