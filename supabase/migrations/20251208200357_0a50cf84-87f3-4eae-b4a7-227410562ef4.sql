-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for anyone to view project images
CREATE POLICY "Public can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

-- Create policy for authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Create policy for authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');