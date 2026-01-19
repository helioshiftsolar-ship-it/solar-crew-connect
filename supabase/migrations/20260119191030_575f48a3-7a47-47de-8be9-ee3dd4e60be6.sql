-- Create project-documents storage bucket for document sharing
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for project-documents bucket
-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload project documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-documents');

-- Allow authenticated users to view documents
CREATE POLICY "Authenticated users can view project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-documents');

-- Allow authenticated users to delete their own documents
CREATE POLICY "Authenticated users can delete project documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-documents');

-- Add company_documents column to deals table for storing shared documents
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS company_documents text[] DEFAULT '{}';