-- Create deals table to track transactions between companies and service providers
CREATE TABLE public.deals (
  id TEXT PRIMARY KEY DEFAULT ('deal-' || gen_random_uuid()::text),
  project_id TEXT NOT NULL,
  project_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('service_provider', 'tool_provider', 'individual_engineer')),
  deal_type TEXT NOT NULL,
  deal_value NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  contact_phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Allow public to read deals (you can make this more restrictive based on your needs)
CREATE POLICY "Public can read deals"
ON public.deals
FOR SELECT
USING (true);

-- Allow public to insert deals
CREATE POLICY "Public can insert deals"
ON public.deals
FOR INSERT
WITH CHECK (true);

-- Allow public to update deals
CREATE POLICY "Public can update deals"
ON public.deals
FOR UPDATE
USING (true);

-- Add foreign key reference to engineer_profiles
ALTER TABLE public.deals
ADD CONSTRAINT deals_provider_id_fkey
FOREIGN KEY (provider_id)
REFERENCES public.engineer_profiles(id)
ON DELETE CASCADE;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_deals_provider_id ON public.deals(provider_id);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);