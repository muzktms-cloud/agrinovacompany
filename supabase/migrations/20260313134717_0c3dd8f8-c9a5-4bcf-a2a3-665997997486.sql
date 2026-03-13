
INSERT INTO public.hardware_products (name, description, price_rupees, category, has_cloud_analytics, cloud_analytics_price, in_stock, image_url) VALUES
-- Sensors
('Soil Moisture Sensor Pro', 'High-precision capacitive soil moisture sensor with temperature compensation. Measures volumetric water content accurately across all soil types.', 1299, 'Sensors', true, 199, true, null),
('NPK Soil Nutrient Analyzer', 'Real-time nitrogen, phosphorus, and potassium measurement sensor. Essential for precision fertilizer application.', 3499, 'Sensors', true, 299, true, null),
('pH & EC Soil Meter', 'Dual-probe sensor measuring soil pH and electrical conductivity. Ideal for monitoring soil health over time.', 1899, 'Sensors', true, 149, true, null),
('Leaf Wetness Sensor', 'Detects moisture on leaf surfaces to predict disease risk. Early warning system for fungal infections.', 999, 'Sensors', true, 99, true, null),
('Solar Radiation Sensor', 'Measures photosynthetically active radiation (PAR) for optimal crop light management.', 2199, 'Sensors', true, 149, true, null),

-- Controllers
('Smart Irrigation Controller', 'WiFi-enabled 8-zone irrigation controller with weather-based scheduling. Reduces water usage by up to 40%.', 4999, 'Controllers', true, 399, true, null),
('Greenhouse Climate Controller', 'Automated temperature, humidity, and ventilation control for greenhouses. Supports up to 12 actuators.', 8999, 'Controllers', true, 599, true, null),
('Fertigation Controller', 'Precision nutrient dosing system with pH auto-correction. Compatible with all drip irrigation setups.', 6499, 'Controllers', true, 499, true, null),

-- Drones
('AgriDrone Scout 200', 'Lightweight agricultural drone with multispectral camera for crop health mapping. 25-minute flight time, 200-acre coverage.', 45999, 'Drones', true, 1499, true, null),
('Spray Drone Pro 10L', '10-liter capacity spraying drone with precision nozzles. Covers 4 acres per flight with autonomous waypoint navigation.', 89999, 'Drones', true, 1999, true, null),

-- Weather Stations
('Mini Weather Station', 'Compact weather station measuring temperature, humidity, wind speed, rainfall, and atmospheric pressure.', 5499, 'Weather Stations', true, 349, true, null),
('Pro Weather Station Plus', 'Professional-grade station with UV index, soil temperature, leaf wetness, and 7-day local forecast capability.', 12999, 'Weather Stations', true, 699, true, null),

-- Irrigation
('Drip Irrigation Kit (1 Acre)', 'Complete drip irrigation system with mainline, sub-main, laterals, and emitters for 1 acre. Water-saving design.', 7999, 'Irrigation', false, null, true, null),
('Smart Sprinkler Head (4-pack)', 'WiFi-connected pop-up sprinkler heads with adjustable spray patterns. Works with any smart controller.', 2499, 'Irrigation', true, 199, true, null),
('Water Flow Meter', 'Digital water flow meter for irrigation monitoring. Track water usage per zone with mobile alerts.', 1799, 'Irrigation', true, 149, true, null),

-- Starter Kits
('Smart Farm Starter Kit', 'Everything you need to start smart farming: soil moisture sensor, mini weather station, and smart irrigation controller bundled together.', 9999, 'Starter Kits', true, 499, true, null),
('Greenhouse Starter Kit', 'Complete greenhouse automation: climate controller, 4 soil sensors, pH meter, and leaf wetness sensor.', 14999, 'Starter Kits', true, 799, true, null),
('Precision Agriculture Kit', 'Advanced kit: NPK analyzer, weather station, fertigation controller, and drone scout for data-driven farming.', 59999, 'Starter Kits', true, 2499, true, null);
