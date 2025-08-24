-- Create articles table for user-generated content
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT DEFAULT 'uncategorized',
  read_time TEXT DEFAULT '5 分钟',
  is_published BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own articles" 
ON public.articles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" 
ON public.articles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" 
ON public.articles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Create policies for article image uploads
CREATE POLICY "Users can view article images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own article images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own article images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);