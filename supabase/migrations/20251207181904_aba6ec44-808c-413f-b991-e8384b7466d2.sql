-- Allow authenticated users to update their own engineer profile
CREATE POLICY "Users can update their own profile"
ON public.engineer_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid()::text)
WITH CHECK (id = auth.uid()::text);