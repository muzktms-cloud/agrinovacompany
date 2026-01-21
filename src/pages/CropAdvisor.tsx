import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Leaf, Droplets, Bug, Cloud, Calendar, TrendingUp, Recycle, Lightbulb, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { crops, regions, soilTypes as soilTypesList } from "@/constants/agriculture-data";

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

const growthStages = [
  "Seed/Germination", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturation", "Harvest Ready"
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
  const [cropSearch, setCropSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const filteredCrops = crops.filter(c => 
    c.toLowerCase().includes(cropSearch.toLowerCase())
  );

  const filteredRegions = regions.filter(r => 
    r.toLowerCase().includes(regionSearch.toLowerCase())
  );

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

  const AdviceCard = ({ icon: Icon, title, content, color, delay }: { icon: any; title: string; content: string | string[] | undefined; color: string; delay?: number }) => {
    if (!content) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay || 0 }}
      >
        <Card className="overflow-hidden glass-card hover:shadow-xl transition-all duration-300 group">
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
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-[hsl(var(--terracotta))] flex items-center justify-center shadow-lg glow-accent"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Leaf className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Crop Advisor</h1>
              <p className="text-xs text-muted-foreground">Personalized daily farming guidance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 glass-card border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Tell Us About Your Crop
              </CardTitle>
              <CardDescription>
                Get personalized daily advice based on your specific crop and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--olive))] flex items-center justify-center text-[10px] font-bold text-white">1</span>
                    Crop Type *
                  </Label>
                  <Select value={cropType} onValueChange={setCropType}>
                    <SelectTrigger className="h-11 border-primary/20">
                      <SelectValue placeholder="Select your crop" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 pb-2 sticky top-0 bg-popover">
                        <div className="flex items-center border rounded-md px-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input 
                            placeholder="Search crops..." 
                            className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                            value={cropSearch}
                            onChange={(e) => setCropSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      {filteredCrops.slice(0, 30).map((crop) => (
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
                      className="border-primary/20"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--terracotta))] to-accent flex items-center justify-center text-[10px] font-bold text-white">2</span>
                    Location *
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-11 border-primary/20">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 pb-2 sticky top-0 bg-popover">
                        <div className="flex items-center border rounded-md px-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input 
                            placeholder="Search locations..." 
                            className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                            value={regionSearch}
                            onChange={(e) => setRegionSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      {filteredRegions.slice(0, 30).map((loc) => (
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
                      className="border-primary/20"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--olive))] to-primary flex items-center justify-center text-[10px] font-bold text-white">3</span>
                    Growth Stage (optional)
                  </Label>
                  <Select value={growthStage} onValueChange={setGrowthStage}>
                    <SelectTrigger className="h-11 border-primary/20">
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
                  <Label className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--sky))] to-[hsl(var(--mint))] flex items-center justify-center text-[10px] font-bold text-white">4</span>
                    Soil Type (optional)
                  </Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger className="h-11 border-primary/20">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypesList.map((soil) => (
                        <SelectItem key={soil} value={soil.toLowerCase()}>
                          {soil}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGetAdvice} 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-primary to-[hsl(var(--olive))] hover:from-primary/90 hover:to-[hsl(var(--olive))]/90 shadow-lg" 
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Advice...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Personalized Advice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {advice && (
          <div className="space-y-6">
            {advice.dailyTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 overflow-hidden">
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
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdviceCard icon={Droplets} title="Watering Advice" content={advice.wateringAdvice} color="bg-gradient-to-r from-[hsl(var(--sky))] to-blue-500" delay={0.1} />
              <AdviceCard icon={Leaf} title="Fertilizer Advice" content={advice.fertilizerAdvice} color="bg-gradient-to-r from-primary to-[hsl(var(--olive))]" delay={0.15} />
              <AdviceCard icon={Bug} title="Pest Watch" content={advice.pestWatch} color="bg-gradient-to-r from-[hsl(var(--coral))] to-destructive" delay={0.2} />
              <AdviceCard icon={Cloud} title="Weather Considerations" content={advice.weatherConsiderations} color="bg-gradient-to-r from-slate-500 to-slate-600" delay={0.25} />
              <AdviceCard icon={Calendar} title="Upcoming Tasks" content={advice.upcomingTasks} color="bg-gradient-to-r from-[hsl(var(--lavender))] to-purple-500" delay={0.3} />
              <AdviceCard icon={Calendar} title="Harvest Estimate" content={advice.harvestEstimate} color="bg-gradient-to-r from-accent to-[hsl(var(--terracotta))]" delay={0.35} />
              <AdviceCard icon={TrendingUp} title="Market Tips" content={advice.marketTips} color="bg-gradient-to-r from-indigo-500 to-[hsl(var(--lavender))]" delay={0.4} />
              <AdviceCard icon={Recycle} title="Sustainability Tip" content={advice.sustainabilityTip} color="bg-gradient-to-r from-[hsl(var(--mint))] to-teal-500" delay={0.45} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CropAdvisor;
