import { useState } from "react";
import { Cloud, Sun, Droplets, Wind, Thermometer, MapPin, Loader2, AlertTriangle, CheckCircle, Bug, Umbrella, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  weather: {
    temperature: number;
    humidity: number;
    conditions: string;
    weatherCode: number;
    windSpeed: number;
    uvIndex: number;
    precipitation: number;
  };
  forecast: {
    high: number;
    low: number;
    precipitationChance: number;
    precipitationSum: number;
  };
  advice: {
    summary: string;
    todayAdvice: string[];
    warnings: string[];
    irrigationTip: string;
    pestRisk: "Low" | "Medium" | "High";
    pestRiskReason: string;
    bestActivities: string[];
    workerSafety: string;
    rawAdvice?: string;
  };
  location: string;
}

const pestRiskColors = {
  Low: "bg-gradient-to-r from-primary/20 to-[hsl(var(--olive))]/20 text-primary border-primary/30",
  Medium: "bg-gradient-to-r from-accent/20 to-[hsl(var(--terracotta))]/20 text-accent border-accent/30",
  High: "bg-gradient-to-r from-destructive/20 to-[hsl(var(--coral))]/20 text-destructive border-destructive/30",
};

const WeatherAdvisor = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation("Current Location");
        fetchWeatherAdvice(position.coords.latitude, position.coords.longitude, "Current Location");
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Location access denied",
          description: "Please enter your location manually.",
          variant: "destructive",
        });
      }
    );
  };

  const searchLocation = async () => {
    if (!location.trim()) {
      toast({
        title: "Enter a location",
        description: "Please enter a city or region name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        toast({
          title: "Location not found",
          description: "Please try a different location name.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const result = data.results[0];
      setCoordinates({ lat: result.latitude, lng: result.longitude });
      fetchWeatherAdvice(result.latitude, result.longitude, `${result.name}, ${result.country || ""}`);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Search failed",
        description: "Failed to find location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchWeatherAdvice = async (lat: number, lng: number, locationName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("weather-advisor", {
        body: { latitude: lat, longitude: lng, location: locationName },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Failed to get advice",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setWeatherData(data);
      toast({
        title: "Weather advice ready",
        description: `Got farming recommendations for ${locationName}`,
      });
    } catch (error) {
      console.error("Error fetching weather advice:", error);
      toast({
        title: "Failed to get advice",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="h-16 w-16 text-accent" />;
    if (code >= 2 && code <= 3) return <Cloud className="h-16 w-16 text-muted-foreground" />;
    if (code >= 51 && code <= 82) return <Droplets className="h-16 w-16 text-[hsl(var(--sky))]" />;
    return <Cloud className="h-16 w-16 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-mesh">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--sky))]/20 to-[hsl(var(--mint))]/20 px-4 py-2 rounded-full mb-4 border border-[hsl(var(--sky))]/30">
            <Cloud className="h-5 w-5 text-[hsl(var(--sky))] animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-[hsl(var(--sky))] to-[hsl(var(--mint))] bg-clip-text text-transparent">WEATHER ADVISOR</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Weather-Based <span className="bg-gradient-to-r from-[hsl(var(--sky))] via-[hsl(var(--mint))] to-primary bg-clip-text text-transparent">Farming Advisor</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered farming recommendations based on real-time weather conditions 
            and accurate forecasts for your region.
          </p>
        </motion.div>

        {/* Location Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 glass-card border-border/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--sky))]/5 via-transparent to-[hsl(var(--mint))]/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--sky))] to-[hsl(var(--mint))] flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                Your Location
              </CardTitle>
              <CardDescription>
                Enter your farm location or use GPS for accurate weather data
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="location" className="sr-only">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter city, region, or farm name..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                    className="h-12 border-[hsl(var(--sky))]/20 text-lg"
                  />
                </div>
                <Button 
                  onClick={searchLocation} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[hsl(var(--sky))] to-[hsl(var(--mint))] hover:opacity-90 shadow-lg"
                  size="lg"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Zap className="h-5 w-5 mr-2" /> Search</>}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={getLocation} 
                  disabled={isLoading}
                  size="lg"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Use GPS
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {weatherData && (
            <motion.div 
              key="weather-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Current Weather */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-[hsl(var(--sky))]/30 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--sky))]/10 via-transparent to-accent/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      Current Weather
                    </CardTitle>
                    <CardDescription>{weatherData.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {getWeatherIcon(weatherData.weather.weatherCode)}
                      </motion.div>
                      <div>
                        <p className="text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                          {Math.round(weatherData.weather.temperature)}°C
                        </p>
                        <p className="text-muted-foreground text-lg">{weatherData.weather.conditions}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Droplets, label: `${weatherData.weather.humidity}% humidity`, color: "text-[hsl(var(--sky))]" },
                        { icon: Wind, label: `${weatherData.weather.windSpeed} km/h`, color: "text-muted-foreground" },
                        { icon: Sun, label: `UV ${weatherData.weather.uvIndex}`, color: "text-accent" },
                        { icon: Thermometer, label: `H: ${Math.round(weatherData.forecast.high)}° L: ${Math.round(weatherData.forecast.low)}°`, color: "text-[hsl(var(--terracotta))]" },
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                        >
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    {weatherData.forecast.precipitationChance > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 p-3 bg-gradient-to-r from-[hsl(var(--sky))]/20 to-[hsl(var(--mint))]/20 rounded-lg flex items-center gap-2 border border-[hsl(var(--sky))]/30"
                      >
                        <Umbrella className="h-4 w-4 text-[hsl(var(--sky))]" />
                        <span className="text-sm text-foreground">
                          {weatherData.forecast.precipitationChance}% chance of rain
                        </span>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Advice */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="glass-card border-primary/30 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-accent" />
                        Today's Farming Advice
                      </span>
                      <Badge className={`${pestRiskColors[weatherData.advice.pestRisk]} border`}>
                        <Bug className="h-3 w-3 mr-1" />
                        {weatherData.advice.pestRisk} Pest Risk
                      </Badge>
                    </CardTitle>
                    <CardDescription>{weatherData.advice.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 relative">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--olive))] flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        Recommended Activities
                      </h4>
                      <ul className="space-y-2">
                        {weatherData.advice.todayAdvice.map((advice, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-background/50"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                              {i + 1}
                            </span>
                            {advice}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {weatherData.advice.warnings.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-destructive to-[hsl(var(--coral))] flex items-center justify-center">
                            <AlertTriangle className="h-3 w-3 text-white" />
                          </div>
                          Warnings
                        </h4>
                        <ul className="space-y-2">
                          {weatherData.advice.warnings.map((warning, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                              className="flex items-start gap-2 text-sm p-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20"
                            >
                              <span className="mt-0.5">⚠</span>
                              {warning}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-[hsl(var(--sky))]/20 to-[hsl(var(--mint))]/10 rounded-xl p-4 border border-[hsl(var(--sky))]/30"
                      >
                        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-[hsl(var(--sky))]" />
                          Irrigation Tip
                        </h5>
                        <p className="text-sm text-muted-foreground">{weatherData.advice.irrigationTip}</p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-accent/20 to-[hsl(var(--terracotta))]/10 rounded-xl p-4 border border-accent/30"
                      >
                        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Bug className="h-4 w-4 text-accent" />
                          Pest Risk: {weatherData.advice.pestRisk}
                        </h5>
                        <p className="text-sm text-muted-foreground">{weatherData.advice.pestRiskReason}</p>
                      </motion.div>
                    </div>

                    {weatherData.advice.workerSafety && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-[hsl(var(--lavender))]/20 to-muted/20 rounded-xl p-4 border border-[hsl(var(--lavender))]/30"
                      >
                        <h5 className="font-medium text-foreground mb-2">👷 Worker Safety</h5>
                        <p className="text-sm text-muted-foreground">{weatherData.advice.workerSafety}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {!weatherData && !isLoading && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="text-center py-16 glass-card border-dashed border-2 border-[hsl(var(--sky))]/30 bg-gradient-to-br from-[hsl(var(--sky))]/5 via-transparent to-[hsl(var(--mint))]/5">
                <CardContent>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mb-6"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(var(--sky))]/20 via-[hsl(var(--mint))]/20 to-primary/20 flex items-center justify-center">
                      <Cloud className="h-12 w-12 text-[hsl(var(--sky))]" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Location Selected</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Enter your farm location or use GPS to get personalized weather-based farming recommendations.
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    {[MapPin, Sun, Droplets].map((Icon, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="text-center py-16 glass-card">
                <CardContent>
                  <div className="relative inline-block mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 rounded-full border-4 border-[hsl(var(--sky))]/30 border-t-[hsl(var(--sky))]"
                    />
                    <Cloud className="h-8 w-8 text-[hsl(var(--sky))] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Weather...</h3>
                  <p className="text-muted-foreground text-sm">
                    Getting current conditions and generating farming recommendations...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default WeatherAdvisor;
