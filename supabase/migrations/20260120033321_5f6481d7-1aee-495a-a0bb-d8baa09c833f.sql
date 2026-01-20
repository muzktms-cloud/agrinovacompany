-- Create pest_detections table to save pest history
CREATE TABLE public.pest_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  image_url TEXT,
  crop_type TEXT NOT NULL,
  pest_name TEXT,
  threat_level TEXT,
  description TEXT,
  damage TEXT,
  treatment TEXT,
  prevention TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pest_detections ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since we don't have auth yet)
CREATE POLICY "Anyone can insert pest detections" 
ON public.pest_detections 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view pest detections
CREATE POLICY "Anyone can view pest detections" 
ON public.pest_detections 
FOR SELECT 
USING (true);

-- Create crop_events table for calendar
CREATE TABLE public.crop_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  crop TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  reminder BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage crop events
CREATE POLICY "Anyone can insert crop events" 
ON public.crop_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view crop events" 
ON public.crop_events 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update crop events" 
ON public.crop_events 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete crop events" 
ON public.crop_events 
FOR DELETE 
USING (true);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_id UUID REFERENCES public.crop_events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  notify_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage notifications" 
ON public.notifications 
FOR ALL 
USING (true);

-- Create hardware_products table
CREATE TABLE public.hardware_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_rupees INTEGER NOT NULL,
  image_url TEXT,
  category TEXT,
  has_cloud_analytics BOOLEAN DEFAULT false,
  cloud_analytics_price INTEGER,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hardware_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" 
ON public.hardware_products 
FOR SELECT 
USING (true);

-- Insert sample hardware products
INSERT INTO public.hardware_products (name, description, price_rupees, category, has_cloud_analytics, cloud_analytics_price, in_stock) VALUES
('Soil Moisture Sensor', 'Accurate soil moisture detection for optimal irrigation timing', 1000, 'sensors', true, 299, true),
('Soil pH Sensor', 'Monitor soil acidity levels for better crop health', 1200, 'sensors', true, 299, true),
('Soil NPK Sensor', 'Measure nitrogen, phosphorus, and potassium levels', 1500, 'sensors', true, 499, true),
('Temperature & Humidity Sensor', 'Track ambient conditions for crop protection', 1100, 'sensors', true, 299, true),
('Rain Gauge Sensor', 'Automatic rainfall measurement with cloud logging', 1300, 'sensors', true, 199, true),
('Light Intensity Sensor', 'Monitor sunlight exposure for greenhouse management', 1000, 'sensors', true, 199, true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;