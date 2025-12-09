-- Add is_online column to engineer_profiles for online/offline status
ALTER TABLE public.engineer_profiles 
ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false;