
CREATE TABLE public.plant_boosters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_rupees INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT '1 kg',
  how_to_use TEXT,
  where_to_apply TEXT,
  consequences TEXT,
  results TEXT,
  safe_for TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.plant_boosters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plant boosters"
ON public.plant_boosters
FOR SELECT
USING (true);
