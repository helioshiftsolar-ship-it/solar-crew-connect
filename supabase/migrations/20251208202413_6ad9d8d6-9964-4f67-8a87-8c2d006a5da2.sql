-- Add company_id column to deals table for proper deal targeting
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS company_id text;

-- Add provider_updates column if not exists
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS provider_updates text[];

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Public can read deals " ON public.deals;
DROP POLICY IF EXISTS "Public can insert deals " ON public.deals;
DROP POLICY IF EXISTS "Public can update deals " ON public.deals;

-- Create new RLS policies for deals
-- Companies can see deals they created
CREATE POLICY "Companies can read their own deals"
ON public.deals
FOR SELECT
USING (
  company_id = (auth.uid())::text
);

-- Providers can see deals assigned to them
CREATE POLICY "Providers can read deals assigned to them"
ON public.deals
FOR SELECT
USING (
  provider_id = ('profile-' || (auth.uid())::text)
);

-- Companies can insert deals
CREATE POLICY "Companies can insert deals"
ON public.deals
FOR INSERT
WITH CHECK (
  company_id = (auth.uid())::text
);

-- Companies and providers can update their deals
CREATE POLICY "Companies can update their deals"
ON public.deals
FOR UPDATE
USING (
  company_id = (auth.uid())::text
);

CREATE POLICY "Providers can update deals assigned to them"
ON public.deals
FOR UPDATE
USING (
  provider_id = ('profile-' || (auth.uid())::text)
);