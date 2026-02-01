import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, MapPin, Wheat, IndianRupee, Loader2, 
  ArrowRight, BarChart3, Calendar, AlertTriangle, CheckCircle2,
  Sprout, ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { crops, regions, seasons } from "@/constants/agriculture-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface MarketAnalysis {
  currentPrice: number;
  predictedPrice: number;
  priceChange: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  bestSellingTime: string;
  marketDemand: "high" | "medium" | "low";
  profitabilityScore: number;
  recommendations: string[];
  riskFactors: string[];
  nearbyMarkets: { name: string; distance: string; price: number }[];
  seasonalInsight: string;
}

const MarketAdvisor = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);

  const filteredCrops = crops.filter(crop => 
    crop.toLowerCase().includes(cropFilter.toLowerCase())
  );

  const filteredRegions = regions.filter(region => 
    region.toLowerCase().includes(regionFilter.toLowerCase())
  );

  const handleAnalyze = async () => {
    if (!selectedCrop || !selectedRegion) {
      toast.error("Please select a crop and region");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('market-advisor', {
        body: { 
          crop: selectedCrop, 
          region: selectedRegion,
          season: selectedSeason,
          farmSize: farmSize ? parseFloat(farmSize) : undefined
        }
      });

      if (error) throw error;
      
      if (data.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment.");
        } else if (data.error.includes("Payment")) {
          toast.error("Service temporarily unavailable.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setAnalysis(data);
      toast.success("Market analysis complete!");
    } catch (error) {
      console.error("Market analysis error:", error);
      toast.error("Failed to analyze market. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="h-5 w-5 text-green-500" />;
    if (trend === "down") return <ArrowDownRight className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const getDemandColor = (demand: string) => {
    if (demand === "high") return "bg-green-500/20 text-green-600 border-green-500/30";
    if (demand === "medium") return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-red-500/20 text-red-600 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">AgriNova</span>
          </Link>
          <Badge variant="outline" className="bg-[hsl(var(--coral))]/10 text-[hsl(var(--coral))] border-[hsl(var(--coral))]/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            {t('nav.market', 'Market Advisor')}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--coral))] to-[hsl(var(--terracotta))] shadow-xl mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[hsl(var(--coral))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent">
              Market Advisor
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI-powered market analysis with real-time price estimates, demand forecasting, and profitability insights for your crops.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24 border-[hsl(var(--coral))]/20 bg-gradient-to-br from-background to-[hsl(var(--coral))]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[hsl(var(--coral))]" />
                  Analysis Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Crop Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-primary" />
                    Select Crop *
                  </Label>
                  <Input
                    placeholder="Type to search crops..."
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1 bg-background">
                    {filteredCrops.slice(0, 20).map((crop) => (
                      <button
                        key={crop}
                        onClick={() => { setSelectedCrop(crop); setCropFilter(""); }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                          selectedCrop === crop 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                  {selectedCrop && (
                    <Badge variant="secondary" className="mt-2">
                      Selected: {selectedCrop}
                    </Badge>
                  )}
                </div>

                {/* Region Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Select Region *
                  </Label>
                  <Input
                    placeholder="Type to search regions..."
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1 bg-background">
                    {filteredRegions.slice(0, 20).map((region) => (
                      <button
                        key={region}
                        onClick={() => { setSelectedRegion(region); setRegionFilter(""); }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                          selectedRegion === region 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-muted"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                  {selectedRegion && (
                    <Badge variant="secondary" className="mt-2">
                      Selected: {selectedRegion}
                    </Badge>
                  )}
                </div>

                {/* Season Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[hsl(var(--olive))]" />
                    Season (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {seasons.map((season) => (
                      <button
                        key={season.value}
                        onClick={() => setSelectedSeason(season.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedSeason === season.value
                            ? "bg-[hsl(var(--olive))] text-white"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {season.label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Farm Size */}
                <div className="space-y-2">
                  <Label>Farm Size (Hectares)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || !selectedCrop || !selectedRegion}
                  className="w-full bg-gradient-to-r from-[hsl(var(--coral))] to-[hsl(var(--terracotta))] hover:opacity-90"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Analyzing Market...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Get Market Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-[hsl(var(--coral))]/20 border-t-[hsl(var(--coral))] animate-spin" />
                    <TrendingUp className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[hsl(var(--coral))]" />
                  </div>
                  <p className="mt-6 text-muted-foreground">Analyzing market data...</p>
                  <p className="text-sm text-muted-foreground/60">Gathering prices, trends & insights</p>
                </motion.div>
              ) : analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Price Overview */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Current Price</span>
                          <IndianRupee className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          ₹{analysis.currentPrice.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">per quintal</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[hsl(var(--coral))]/10 to-[hsl(var(--coral))]/5 border-[hsl(var(--coral))]/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Predicted Price</span>
                          {getTrendIcon(analysis.trend)}
                        </div>
                        <div className="text-3xl font-bold text-[hsl(var(--coral))]">
                          ₹{analysis.predictedPrice.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.priceChange > 0 ? "+" : ""}{analysis.priceChange}% change expected
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Profitability</span>
                          <BarChart3 className="h-4 w-4 text-accent" />
                        </div>
                        <div className="text-3xl font-bold text-accent">
                          {analysis.profitabilityScore}/10
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.confidence}% confidence
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Demand & Timing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[hsl(var(--olive))]" />
                          Best Selling Time
                        </h3>
                        <p className="text-lg font-medium text-foreground">{analysis.bestSellingTime}</p>
                        <p className="text-sm text-muted-foreground mt-2">{analysis.seasonalInsight}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3">Market Demand</h3>
                        <Badge className={`text-sm px-4 py-2 ${getDemandColor(analysis.marketDemand)}`}>
                          {analysis.marketDemand.toUpperCase()} DEMAND
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-3">
                          Based on regional consumption patterns and export trends
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Nearby Markets */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-[hsl(var(--coral))]" />
                        Nearby Markets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {analysis.nearbyMarkets.map((market, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                          >
                            <h4 className="font-medium">{market.name}</h4>
                            <p className="text-sm text-muted-foreground">{market.distance}</p>
                            <p className="text-lg font-bold text-primary mt-2">₹{market.price.toLocaleString()}/q</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations & Risks */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-green-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-yellow-600">
                          <AlertTriangle className="h-5 w-5" />
                          Risk Factors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-[hsl(var(--coral))]/10 flex items-center justify-center mb-6">
                    <TrendingUp className="h-12 w-12 text-[hsl(var(--coral))]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a crop and region to get AI-powered market insights, price predictions, 
                    and profitability analysis tailored to your location.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketAdvisor;
