import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FlaskConical, Play, RefreshCw, TrendingUp, Droplets, Sun, Bug, DollarSign, Loader2, Zap, Activity, BarChart3, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { crops, regions, irrigationTypes } from "@/constants/agriculture-data";

interface SimulationResult {
  expectedYield: string;
  profitEstimate: string;
  waterRequirement: string;
  pestRisk: string;
  bestPlantingWindow: string;
  recommendations: string[];
  monthlyBreakdown: { month: string; activity: string; risk: string }[];
}

const simulationSteps = [
  { label: "Analyzing Climate Data", icon: Sun },
  { label: "Processing Soil Conditions", icon: Activity },
  { label: "Running Yield Models", icon: BarChart3 },
  { label: "Calculating Projections", icon: TrendingUp },
];

const CropSimulator = () => {
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [landSize, setLandSize] = useState("");
  const [budget, setBudget] = useState([50000]);
  const [irrigationType, setIrrigationType] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    if (!crop || !region || !landSize || !irrigationType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSimulating(true);
    setSimulationStep(0);
    
    // Animate through steps
    const stepInterval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev < simulationSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

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

      clearInterval(stepInterval);
      if (error) throw error;
      setResult(data);
      toast.success("Simulation complete!");
    } catch (error) {
      clearInterval(stepInterval);
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
    setSimulationStep(0);
  };

  const [cropSearch, setCropSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const filteredCrops = crops.filter(c => 
    c.toLowerCase().includes(cropSearch.toLowerCase())
  );

  const filteredRegions = regions.filter(r => 
    r.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const getRadarData = () => {
    if (!result) return [];
    const yieldVal = parseInt(result.expectedYield) || 50;
    const waterVal = parseInt(result.waterRequirement.replace(/,/g, '')) / 100 || 50;
    const pestVal = result.pestRisk === "Low" ? 90 : result.pestRisk === "Medium" ? 60 : 30;
    
    return [
      { subject: 'Yield', A: Math.min(yieldVal * 2, 100), fullMark: 100 },
      { subject: 'Water Efficiency', A: Math.max(100 - waterVal, 20), fullMark: 100 },
      { subject: 'Pest Resistance', A: pestVal, fullMark: 100 },
      { subject: 'Profitability', A: 75, fullMark: 100 },
      { subject: 'Sustainability', A: 80, fullMark: 100 },
    ];
  };

  const getRiskBarData = () => {
    if (!result) return [];
    return result.monthlyBreakdown.map(m => ({
      name: m.month.substring(0, 3),
      risk: m.risk === "Low" ? 25 : m.risk === "Medium" ? 55 : 85,
      color: m.risk === "Low" ? "hsl(var(--primary))" : m.risk === "Medium" ? "hsl(var(--accent))" : "hsl(var(--destructive))"
    }));
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--terracotta))]/20 to-primary/20 px-4 py-2 rounded-full mb-4 border border-[hsl(var(--terracotta))]/30">
            <Zap className="h-5 w-5 text-[hsl(var(--terracotta))] animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-[hsl(var(--terracotta))] to-primary bg-clip-text text-transparent">WHAT-IF SIMULATOR</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your Next <span className="bg-gradient-to-r from-primary via-[hsl(var(--olive))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent">Growing Season</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simulate different crop scenarios with AI-powered predictions. 
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
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--terracotta))]/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--terracotta))] to-[hsl(var(--terracotta))]/70">
                    <FlaskConical className="h-5 w-5 text-white" />
                  </div>
                  Simulation Parameters
                </CardTitle>
                <CardDescription>
                  Configure your farming scenario to simulate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--olive))] flex items-center justify-center text-xs font-bold text-primary-foreground">1</span>
                    Crop Type
                  </Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger className="border-primary/20 focus:border-primary transition-colors h-11">
                      <SelectValue placeholder="Search or select a crop..." />
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
                      {filteredCrops.slice(0, 30).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                      {filteredCrops.length > 30 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                          +{filteredCrops.length - 30} more crops...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--terracotta))] to-accent flex items-center justify-center text-xs font-bold text-white">2</span>
                    Growing Region
                  </Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="border-primary/20 focus:border-primary transition-colors h-11">
                      <SelectValue placeholder="Search or select a region..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 pb-2 sticky top-0 bg-popover">
                        <div className="flex items-center border rounded-md px-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input 
                            placeholder="Search regions..." 
                            className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                            value={regionSearch}
                            onChange={(e) => setRegionSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      {filteredRegions.slice(0, 30).map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                      {filteredRegions.length > 30 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                          +{filteredRegions.length - 30} more regions...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--olive))] to-primary flex items-center justify-center text-xs font-bold text-white">3</span>
                    Land Size (Acres)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    className="border-primary/20 focus:border-primary transition-colors"
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--sky))] to-[hsl(var(--mint))] flex items-center justify-center text-xs font-bold text-white">4</span>
                    Irrigation Type
                  </Label>
                  <Select value={irrigationType} onValueChange={setIrrigationType}>
                    <SelectTrigger className="border-primary/20 focus:border-primary transition-colors h-11">
                      <SelectValue placeholder="Select irrigation method" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-[hsl(var(--coral))] flex items-center justify-center text-xs font-bold text-white">5</span>
                    Budget: <span className="text-accent font-bold">₹{budget[0].toLocaleString()}</span>
                  </Label>
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
                </motion.div>

                <motion.div 
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button 
                    onClick={runSimulation} 
                    disabled={isSimulating}
                    className="flex-1 bg-gradient-to-r from-[hsl(var(--terracotta))] to-[hsl(var(--terracotta))]/80 hover:from-[hsl(var(--terracotta))]/90 hover:to-[hsl(var(--terracotta))]/70 shadow-lg shadow-[hsl(var(--terracotta))]/20 transition-all duration-300"
                    size="lg"
                  >
                    {isSimulating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation} size="lg" className="border-primary/30 hover:bg-primary/10">
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Simulation Progress */}
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          <Zap className="absolute inset-0 m-auto h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">AI Simulation in Progress</h4>
                          <p className="text-sm text-muted-foreground">Processing your scenario...</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {simulationSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0.3, x: -10 }}
                            animate={{ 
                              opacity: index <= simulationStep ? 1 : 0.3,
                              x: 0 
                            }}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              index < simulationStep 
                                ? 'bg-primary text-primary-foreground' 
                                : index === simulationStep 
                                  ? 'bg-primary/30 text-primary animate-pulse' 
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              <step.icon className="h-4 w-4" />
                            </div>
                            <span className={`text-sm ${index <= simulationStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.label}
                            </span>
                            {index < simulationStep && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto text-primary text-xs"
                              >
                                ✓
                              </motion.span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: TrendingUp, value: result.expectedYield, label: "Expected Yield", color: "primary", gradient: "from-primary to-primary/70" },
                      { icon: DollarSign, value: result.profitEstimate, label: "Profit Estimate", color: "accent", gradient: "from-accent to-accent/70" },
                      { icon: Droplets, value: result.waterRequirement, label: "Water Needed", color: "[hsl(var(--olive))]", gradient: "from-[hsl(var(--olive))] to-[hsl(var(--olive))]/70" },
                      { icon: Bug, value: result.pestRisk, label: "Pest Risk", color: "[hsl(var(--terracotta))]", gradient: "from-[hsl(var(--terracotta))] to-[hsl(var(--terracotta))]/70" },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
                          <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                          <CardContent className="p-4 text-center relative">
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}>
                              <metric.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xl font-bold text-foreground">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Best Planting Window */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-accent/70 shadow-lg">
                            <Sun className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Best Planting Window</div>
                            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{result.bestPlantingWindow}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Performance Radar Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Performance Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={getRadarData()}>
                              <PolarGrid stroke="hsl(var(--border))" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                              <Radar name="Performance" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} strokeWidth={2} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Risk Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-[hsl(var(--terracotta))]" />
                          Monthly Risk Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getRiskBarData()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                                {getRiskBarData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Monthly Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Activity Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.monthlyBreakdown.map((month, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/50 hover:border-primary/30 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm group-hover:from-primary/30 transition-colors">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">{month.month}</div>
                                  <div className="text-sm text-muted-foreground">{month.activity}</div>
                                </div>
                              </div>
                              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                month.risk === "Low" ? "bg-primary/20 text-primary" :
                                month.risk === "Medium" ? "bg-accent/20 text-accent" :
                                "bg-destructive/20 text-destructive"
                              }`}>
                                {month.risk} Risk
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5 text-accent" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {result.recommendations.map((rec, index) => (
                            <motion.li 
                              key={index} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                            >
                              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-sm text-muted-foreground">{rec}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="h-full min-h-[600px] flex items-center justify-center border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--terracotta))]/5">
                    <CardContent className="text-center py-16">
                      <motion.div
                        animate={{ 
                          rotateY: [0, 360],
                        }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="inline-block mb-6"
                      >
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 via-[hsl(var(--olive))]/20 to-[hsl(var(--terracotta))]/20 flex items-center justify-center">
                          <FlaskConical className="h-12 w-12 text-primary" />
                        </div>
                      </motion.div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">Ready to Simulate</h3>
                      <p className="text-muted-foreground">
                        Configure your farming parameters<br />and run an AI-powered simulation
                      </p>
                      <div className="mt-8 flex justify-center gap-4">
                        {[BarChart3, Activity, TrendingUp].map((Icon, i) => (
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
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CropSimulator;