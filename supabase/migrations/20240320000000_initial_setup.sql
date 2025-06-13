-- Create medicine_analyses table
CREATE TABLE IF NOT EXISTS medicine_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name TEXT NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('authentic', 'fake', 'uncertain')),
    confidence_score FLOAT NOT NULL,
    analysis_details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('medicine-images', 'medicine-images', true),
    ('models', 'models', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medicine-images');

CREATE POLICY "Allow public read access to images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'medicine-images');

CREATE POLICY "Allow public read access to models"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'models'); 