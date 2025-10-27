-- Add profile_type to engineer_profiles to support different profile types
ALTER TABLE public.engineer_profiles 
ADD COLUMN IF NOT EXISTS profile_type TEXT NOT NULL DEFAULT 'individual_engineer' 
CHECK (profile_type IN ('individual_engineer', 'tool_provider', 'service_provider'));

-- Add company-specific fields
ALTER TABLE public.engineer_profiles
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Create tools table for tool providers
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY DEFAULT 'tool-' || gen_random_uuid()::text,
  profile_id TEXT NOT NULL REFERENCES public.engineer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_model TEXT NOT NULL CHECK (price_model IN ('free', 'freemium', 'subscription', 'one_time', 'quote')),
  price_range TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  documentation_url TEXT,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_users INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create services table for service providers
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT 'service-' || gen_random_uuid()::text,
  profile_id TEXT NOT NULL REFERENCES public.engineer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_model TEXT NOT NULL CHECK (price_model IN ('hourly', 'fixed', 'monthly', 'quote')),
  price_range TEXT,
  duration_estimate TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  case_study_url TEXT,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read access for tools
CREATE POLICY "Public can read tools"
ON public.tools
FOR SELECT
USING (true);

-- Public read access for services
CREATE POLICY "Public can read services"
ON public.services
FOR SELECT
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER trg_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();