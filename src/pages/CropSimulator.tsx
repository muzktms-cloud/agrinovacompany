import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FlaskConical, Play, RefreshCw, TrendingUp, Droplets, Sun, Bug, DollarSign, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SimulationResult {
  expectedYield: string;
  profitEstimate: string;
  waterRequirement: string;
  pestRisk: string;
  bestPlantingWindow: string;
  recommendations: string[];
  monthlyBreakdown: { month: string; activity: string; risk: string }[];
}

const crops = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", "Potato", "Tomato", 
  "Onion", "Chili", "Tea", "Jute", "Banana", "Mango"
];

const regions = [
  "Punjab, India", "Maharashtra, India", "Tamil Nadu, India", "West Bengal, India",
  "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Punjab, Pakistan", "Sindh, Pakistan",
  "Central Province, Sri Lanka", "Kathmandu Valley, Nepal", "Paro, Bhutan"
];

const CropSimulator = () => {
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [landSize, setLandSize] = useState("");
  const [budget, setBudget] = useState([50000]);
  const [irrigationType, setIrrigationType] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    if (!crop || !region || !landSize || !irrigationType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke("crop-simulator", {
        body: {
          crop,
          region,
          landSize: parseFloat(landSize),
          budget: budget[0],
          irrigationType,
        },
      });

      if (error) throw error;
      setResult(data);
      toast.success("Simulation complete!");
    } catch (error) {
      console.error("Simulation error:", error);
      toast.error("Failed to run simulation. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setResult(null);
    setCrop("");
    setRegion("");
    setLandSize("");
    setBudget([50000]);
    setIrrigationType("");
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
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--terracotta))]/10 px-4 py-2 rounded-full mb-4">
            <FlaskConical className="h-5 w-5 text-[hsl(var(--terracotta))]" />
            <span className="text-sm font-semibold text-[hsl(var(--terracotta))]">WHAT-IF SIMULATOR</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Plan Your Next <span className="text-primary">Growing Season</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simulate different crop scenarios and see projected outcomes before committing. 
            Make data-driven decisions for your farm's future.
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
                  <FlaskConical className="h-5 w-5 text-[hsl(var(--terracotta))]" />
                  Simulation Parameters
                </CardTitle>
                <CardDescription>
                  Enter your farming details to simulate the next season
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Growing Region</Label>
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
                  <Label>Land Size (Acres)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Type</Label>
                  <Select value={irrigationType} onValueChange={setIrrigationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rainfed">Rainfed</SelectItem>
                      <SelectItem value="canal">Canal Irrigation</SelectItem>
                      <SelectItem value="drip">Drip Irrigation</SelectItem>
                      <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                      <SelectItem value="tubewell">Tube Well</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Budget (₹{budget[0].toLocaleString()})</Label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={10000}
                    max={500000}
                    step={5000}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={runSimulation} 
                    disabled={isSimulating}
                    className="flex-1 bg-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))]/90"
                  >
                    {isSimulating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
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
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.expectedYield}</div>
                      <div className="text-xs text-muted-foreground">Expected Yield</div>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/20 bg-accent/5">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.profitEstimate}</div>
                      <div className="text-xs text-muted-foreground">Profit Estimate</div>
                    </CardContent>
                  </Card>
                  <Card className="border-[hsl(var(--olive))]/20 bg-[hsl(var(--olive))]/5">
                    <CardContent className="p-4 text-center">
                      <Droplets className="h-8 w-8 text-[hsl(var(--olive))] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.waterRequirement}</div>
                      <div className="text-xs text-muted-foreground">Water Needed</div>
                    </CardContent>
                  </Card>
                  <Card className="border-[hsl(var(--terracotta))]/20 bg-[hsl(var(--terracotta))]/5">
                    <CardContent className="p-4 text-center">
                      <Bug className="h-8 w-8 text-[hsl(var(--terracotta))] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{result.pestRisk}</div>
                      <div className="text-xs text-muted-foreground">Pest Risk</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Best Planting Window */}
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Sun className="h-6 w-6 text-accent" />
                      <div>
                        <div className="font-semibold text-foreground">Best Planting Window</div>
                        <div className="text-primary">{result.bestPlantingWindow}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Breakdown */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.monthlyBreakdown.map((month, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium text-foreground">{month.month}</div>
                            <div className="text-sm text-muted-foreground">{month.activity}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            month.risk === "Low" ? "bg-primary/20 text-primary" :
                            month.risk === "Medium" ? "bg-accent/20 text-accent" :
                            "bg-destructive/20 text-destructive"
                          }`}>
                            {month.risk} Risk
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
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
                  <FlaskConical className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Simulation Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Fill in the parameters and run a simulation<br />to see projected outcomes
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

export default CropSimulator;