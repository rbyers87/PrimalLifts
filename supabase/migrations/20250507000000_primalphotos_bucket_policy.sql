-- Create storage policy for avatars
CREATE POLICY "Avatars are publicly accessible."
ON storage.objects FOR SELECT
TO PUBLIC
USING (bucket_id = 'primalphotos');

CREATE POLICY "Anyone can upload an avatar."
ON storage.objects FOR INSERT
TO PUBLIC
WITH CHECK (bucket_id = 'primalphotos');

CREATE POLICY "Anyone can update their own avatar."
ON storage.objects FOR UPDATE
TO PUBLIC
USING (bucket_id = 'primalphotos' AND auth.uid() = owner);

CREATE POLICY "Anyone can delete their own avatar."
ON storage.objects FOR DELETE
TO PUBLIC
USING (bucket_id = 'primalphotos' AND auth.uid() = owner);
