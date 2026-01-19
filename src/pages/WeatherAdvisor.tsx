import { useState, useEffect } from "react";
import { Cloud, Sun, Droplets, Wind, Thermometer, MapPin, Loader2, Sprout, AlertTriangle, CheckCircle, Bug, Umbrella } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
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
      // Use Open-Meteo geocoding
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
    if (code === 0 || code === 1) return <Sun className="h-12 w-12 text-harvest" />;
    if (code >= 2 && code <= 3) return <Cloud className="h-12 w-12 text-muted-foreground" />;
    if (code >= 51 && code <= 82) return <Droplets className="h-12 w-12 text-blue-500" />;
    return <Cloud className="h-12 w-12 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">AgriNova</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/planner" className="text-muted-foreground hover:text-foreground transition-colors">Planner</Link>
            <Link to="/pest-detector" className="text-muted-foreground hover:text-foreground transition-colors">Pest Detector</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Weather-Based Farming Advisor
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered farming recommendations based on today's weather conditions.
          </p>
        </div>

        {/* Location Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Your Location
            </CardTitle>
            <CardDescription>
              Enter your farm location or use GPS for accurate weather data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="location" className="sr-only">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter city, region, or farm name..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                />
              </div>
              <Button onClick={searchLocation} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
              <Button variant="outline" onClick={getLocation} disabled={isLoading}>
                <MapPin className="h-4 w-4" />
                Use GPS
              </Button>
            </div>
          </CardContent>
        </Card>

        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle>Current Weather</CardTitle>
                <CardDescription>{weatherData.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  {getWeatherIcon(weatherData.weather.weatherCode)}
                  <div>
                    <p className="text-4xl font-bold text-foreground">
                      {Math.round(weatherData.weather.temperature)}°C
                    </p>
                    <p className="text-muted-foreground">{weatherData.weather.conditions}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {weatherData.weather.humidity}% humidity
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {weatherData.weather.windSpeed} km/h
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-harvest" />
                    <span className="text-sm text-muted-foreground">
                      UV {weatherData.weather.uvIndex}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-terracotta" />
                    <span className="text-sm text-muted-foreground">
                      H: {Math.round(weatherData.forecast.high)}° L: {Math.round(weatherData.forecast.low)}°
                    </span>
                  </div>
                </div>
                {weatherData.forecast.precipitationChance > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                    <Umbrella className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-800">
                      {weatherData.forecast.precipitationChance}% chance of rain
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Advice */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Farming Advice</span>
                  <Badge className={pestRiskColors[weatherData.advice.pestRisk]}>
                    <Bug className="h-3 w-3 mr-1" />
                    {weatherData.advice.pestRisk} Pest Risk
                  </Badge>
                </CardTitle>
                <CardDescription>{weatherData.advice.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Recommended Activities
                  </h4>
                  <ul className="space-y-2">
                    {weatherData.advice.todayAdvice.map((advice, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>

                {weatherData.advice.warnings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Warnings
                    </h4>
                    <ul className="space-y-2">
                      {weatherData.advice.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-destructive/80">
                          <span className="mt-1">⚠</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Irrigation Tip
                    </h5>
                    <p className="text-sm text-blue-800">{weatherData.advice.irrigationTip}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h5 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Pest Risk: {weatherData.advice.pestRisk}
                    </h5>
                    <p className="text-sm text-amber-800">{weatherData.advice.pestRiskReason}</p>
                  </div>
                </div>

                {weatherData.advice.workerSafety && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="font-medium text-foreground mb-2">Worker Safety</h5>
                    <p className="text-sm text-muted-foreground">{weatherData.advice.workerSafety}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!weatherData && !isLoading && (
          <Card className="text-center py-16">
            <CardContent>
              <Cloud className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Location Selected</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Enter your farm location or use GPS to get personalized weather-based farming recommendations.
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card className="text-center py-16">
            <CardContent>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Analyzing Weather...</h3>
              <p className="text-muted-foreground text-sm">
                Getting current conditions and generating farming recommendations...
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WeatherAdvisor;
