-- Add project progress and milestones columns to deals table
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_images TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS last_update_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'not_started';