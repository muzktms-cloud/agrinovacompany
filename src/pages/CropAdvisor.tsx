import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Leaf, Droplets, Bug, Cloud, Calendar, TrendingUp, Recycle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AdviceData = {
  dailyTip?: string;
  wateringAdvice?: string;
  fertilizerAdvice?: string;
  pestWatch?: string;
  weatherConsiderations?: string;
  upcomingTasks?: string[];
  harvestEstimate?: string;
  marketTips?: string;
  sustainabilityTip?: string;
};

const popularCrops = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Millet", "Sorghum",
  "Groundnut", "Soybean", "Mustard", "Sunflower", "Potato", "Onion",
  "Tomato", "Chili", "Turmeric", "Ginger", "Tea", "Coffee", "Coconut",
  "Banana", "Mango", "Papaya", "Guava"
];

const growthStages = [
  "Seed/Germination", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturation", "Harvest Ready"
];

const soilTypes = [
  "Alluvial", "Black/Cotton", "Red/Laterite", "Sandy", "Clay", "Loamy", "Saline"
];

const locations = [
  "Punjab, India", "Maharashtra, India", "Uttar Pradesh, India", "Tamil Nadu, India",
  "West Bengal, India", "Karnataka, India", "Gujarat, India", "Rajasthan, India",
  "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Punjab, Pakistan", "Sindh, Pakistan",
  "Central Province, Sri Lanka", "Terai, Nepal", "Thimphu, Bhutan"
];

const CropAdvisor = () => {
  const [cropType, setCropType] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [soilType, setSoilType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<AdviceData | null>(null);

  const handleGetAdvice = async () => {
    const finalCrop = cropType === "other" ? customCrop : cropType;
    const finalLocation = location === "other" ? customLocation : location;

    if (!finalCrop || !finalLocation) {
      toast.error("Please enter crop type and location");
      return;
    }

    setIsLoading(true);
    setAdvice(null);

    try {
      const { data, error } = await supabase.functions.invoke("crop-advisor", {
        body: { cropType: finalCrop, location: finalLocation, growthStage, soilType },
      });

      if (error) throw error;
      setAdvice(data.advice);
      toast.success("Advice generated successfully!");
    } catch (error) {
      console.error("Advisor error:", error);
      toast.error("Failed to get advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const AdviceCard = ({ icon: Icon, title, content, color }: { icon: any; title: string; content: string | string[] | undefined; color: string }) => {
    if (!content) return null;
    return (
      <Card className="overflow-hidden">
        <CardHeader className={`py-3 ${color}`}>
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
            <Icon className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {Array.isArray(content) ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{content}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Crop Advisor</h1>
              <p className="text-xs text-muted-foreground">Personalized daily farming guidance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Tell Us About Your Crop
            </CardTitle>
            <CardDescription>
              Get personalized daily advice based on your specific crop and location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop Type *</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCrops.map((crop) => (
                      <SelectItem key={crop} value={crop.toLowerCase()}>
                        {crop}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {cropType === "other" && (
                  <Input
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    placeholder="Enter crop name"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc.toLowerCase()}>
                        {loc}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {location === "other" && (
                  <Input
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Growth Stage (optional)</Label>
                <Select value={growthStage} onValueChange={setGrowthStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select growth stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {growthStages.map((stage) => (
                      <SelectItem key={stage} value={stage.toLowerCase()}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Soil Type (optional)</Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil.toLowerCase()}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGetAdvice} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Leaf className="h-4 w-4 mr-2" />
                  Get Personalized Advice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {advice && (
          <div className="space-y-6 animate-fade-in">
            {advice.dailyTip && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Lightbulb className="h-5 w-5" />
                    Today's Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{advice.dailyTip}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdviceCard icon={Droplets} title="Watering Advice" content={advice.wateringAdvice} color="bg-blue-500" />
              <AdviceCard icon={Leaf} title="Fertilizer Advice" content={advice.fertilizerAdvice} color="bg-green-500" />
              <AdviceCard icon={Bug} title="Pest Watch" content={advice.pestWatch} color="bg-red-500" />
              <AdviceCard icon={Cloud} title="Weather Considerations" content={advice.weatherConsiderations} color="bg-slate-500" />
              <AdviceCard icon={Calendar} title="Upcoming Tasks" content={advice.upcomingTasks} color="bg-purple-500" />
              <AdviceCard icon={Calendar} title="Harvest Estimate" content={advice.harvestEstimate} color="bg-amber-500" />
              <AdviceCard icon={TrendingUp} title="Market Tips" content={advice.marketTips} color="bg-indigo-500" />
              <AdviceCard icon={Recycle} title="Sustainability Tip" content={advice.sustainabilityTip} color="bg-teal-500" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CropAdvisor;
