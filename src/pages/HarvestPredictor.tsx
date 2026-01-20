import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign, CloudRain, Bug, Loader2, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PredictionResult {
  harvestYield: string;
  yieldTrend: string;
  marketPrice: string;
  priceTrend: string;
  weatherOutlook: string;
  potentialProblems: { issue: string; probability: string; severity: string }[];
  marketAnalysis: string;
  recommendations: string[];
  confidenceScore: string;
}

const crops = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", "Potato", "Tomato", 
  "Onion", "Chili", "Tea", "Jute", "Banana", "Mango", "Coconut"
];

const regions = [
  "Punjab, India", "Maharashtra, India", "Tamil Nadu, India", "West Bengal, India",
  "Uttar Pradesh, India", "Madhya Pradesh, India", "Dhaka, Bangladesh", 
  "Chittagong, Bangladesh", "Punjab, Pakistan", "Sindh, Pakistan",
  "Central Province, Sri Lanka", "Kathmandu Valley, Nepal", "Paro, Bhutan"
];

const HarvestPredictor = () => {
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [fieldConditions, setFieldConditions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const getPrediction = async () => {
    if (!crop || !region || !plantingDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("harvest-predictor", {
        body: {
          crop,
          region,
          plantingDate,
          fieldConditions,
        },
      });

      if (error) throw error;
      setResult(data);
      toast.success("Prediction generated!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">HARVEST PREDICTOR</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Predict Your <span className="text-accent">Harvest Outcomes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered predictions on harvest yields, potential problems, and market trends 
            based on global agricultural data and real-time analysis.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Crop Details
                </CardTitle>
                <CardDescription>
                  Enter your current crop information for accurate predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Crop Type *</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Growing Region *</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Planting Date *</Label>
                  <Input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Field Conditions (Optional)</Label>
                  <Textarea
                    placeholder="Describe any observations: soil moisture, plant health, pest sightings, irrigation status..."
                    value={fieldConditions}
                    onChange={(e) => setFieldConditions(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={getPrediction} 
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Prediction
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {result ? (
              <div className="space-y-6">
                {/* Confidence Score */}
                <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Prediction Confidence</span>
                      <span className="text-2xl font-bold text-primary">{result.confidenceScore}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.harvestYield}</div>
                      <div className="text-xs text-muted-foreground">Expected Yield</div>
                      <div className={`text-xs mt-1 ${result.yieldTrend.includes('+') ? 'text-primary' : 'text-destructive'}`}>
                        {result.yieldTrend} vs avg
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/20">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.marketPrice}</div>
                      <div className="text-xs text-muted-foreground">Market Price</div>
                      <div className={`text-xs mt-1 ${result.priceTrend.includes('+') ? 'text-primary' : 'text-destructive'}`}>
                        {result.priceTrend}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Weather Outlook */}
                <Card className="border-[hsl(var(--olive))]/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CloudRain className="h-6 w-6 text-[hsl(var(--olive))] mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground mb-1">Weather Outlook</div>
                        <p className="text-sm text-muted-foreground">{result.weatherOutlook}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Potential Problems */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-accent" />
                      Potential Problems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.potentialProblems.map((problem, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border ${getSeverityColor(problem.severity)}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{problem.issue}</span>
                            <span className="text-xs">{problem.probability} probability</span>
                          </div>
                          <span className="text-xs">Severity: {problem.severity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Analysis */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.marketAnalysis}</p>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-bold mt-0.5">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center border-dashed border-2">
                <CardContent className="text-center py-16">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Prediction Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your crop details to get<br />AI-powered harvest predictions
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HarvestPredictor;