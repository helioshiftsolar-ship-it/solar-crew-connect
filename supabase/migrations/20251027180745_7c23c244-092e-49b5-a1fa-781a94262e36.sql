-- Create engineer profiles table
CREATE TABLE IF NOT EXISTS public.engineer_profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate NUMERIC,
  rating NUMERIC NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_projects INTEGER NOT NULL DEFAULT 0,
  availability TEXT NOT NULL CHECK (availability IN ('available','busy','unavailable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.engineer_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access (profiles are meant to be browsed by employers)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'engineer_profiles' AND policyname = 'Public can read engineer profiles'
  ) THEN
    CREATE POLICY "Public can read engineer profiles"
    ON public.engineer_profiles
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Do not allow insert/update/delete by default (no policies created)

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger on engineer_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_engineer_profiles_updated_at'
  ) THEN
    CREATE TRIGGER trg_engineer_profiles_updated_at
    BEFORE UPDATE ON public.engineer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;