import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign, CloudRain, Loader2, Sparkles, Search, Target, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { crops, regions } from "@/constants/agriculture-data";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DataDisclaimer from "@/components/DataDisclaimer";

interface PredictionResult {
  harvestYield: string; yieldTrend: string; marketPrice: string; priceTrend: string; weatherOutlook: string;
  potentialProblems: { issue: string; probability: string; severity: string }[];
  marketAnalysis: string; recommendations: string[]; confidenceScore: string;
}

const HarvestPredictor = () => {
  const { t, i18n } = useTranslation();
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [fieldConditions, setFieldConditions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [cropSearch, setCropSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const filteredCrops = crops.filter(c => c.toLowerCase().includes(cropSearch.toLowerCase()));
  const filteredRegions = regions.filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()));

  const getPrediction = async () => {
    if (!crop || !region || !plantingDate) { toast.error(t('predictor.fillRequired')); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("harvest-predictor", { body: { crop, region, plantingDate, fieldConditions, language: i18n.language } });
      if (error) throw error;
      setResult(data); toast.success(t('predictor.predictionGenerated'));
    } catch (error) { console.error("Prediction error:", error); toast.error(t('predictor.predictionFailed')); } finally { setIsLoading(false); }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-gradient-to-r from-destructive/20 to-[hsl(var(--coral))]/20 text-destructive border-destructive/30";
      case "medium": return "bg-gradient-to-r from-accent/20 to-[hsl(var(--terracotta))]/20 text-accent border-accent/30";
      default: return "bg-gradient-to-r from-primary/20 to-[hsl(var(--olive))]/20 text-primary border-primary/30";
    }
  };

  const getConfidenceData = () => {
    const score = parseInt(result?.confidenceScore || "0");
    return [{ name: 'Confidence', value: score }, { name: 'Remaining', value: 100 - score }];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-mesh">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full mb-4 border border-primary/30">
            <Target className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('predictor.tagline')}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('predictor.predictYour')} <span className="bg-gradient-to-r from-accent via-[hsl(var(--terracotta))] to-[hsl(var(--coral))] bg-clip-text text-transparent">{t('predictor.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('predictor.subtitle')}</p>
        </motion.div>

        <div className="mb-6">
          <DataDisclaimer sources={["ICAR yield data", "DES (Ministry of Agriculture)", "Open-Meteo weather forecast", "Government MSP rates"]} verifyLinks={[{ label: "eNAM", url: "https://enam.gov.in" }, { label: "Agmarknet", url: "https://agmarknet.gov.in" }]} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="border-border/50 glass-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" />{t('predictor.cropDetails')}</CardTitle>
                <CardDescription>{t('predictor.cropDetailsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--olive))] flex items-center justify-center text-[10px] font-bold text-white">1</span>{t('predictor.cropType')} *</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger className="h-11 border-primary/20"><SelectValue placeholder={t('predictor.selectYourCrop')} /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 pb-2 sticky top-0 bg-popover"><div className="flex items-center border rounded-md px-2"><Search className="h-4 w-4 text-muted-foreground" /><input placeholder={t('predictor.searchCrops')} className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none" value={cropSearch} onChange={(e) => setCropSearch(e.target.value)} /></div></div>
                      {filteredCrops.slice(0, 30).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--terracotta))] to-accent flex items-center justify-center text-[10px] font-bold text-white">2</span>{t('predictor.growingRegion')} *</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-11 border-primary/20"><SelectValue placeholder={t('predictor.selectYourRegion')} /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 pb-2 sticky top-0 bg-popover"><div className="flex items-center border rounded-md px-2"><Search className="h-4 w-4 text-muted-foreground" /><input placeholder={t('predictor.searchRegions')} className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none" value={regionSearch} onChange={(e) => setRegionSearch(e.target.value)} /></div></div>
                      {filteredRegions.slice(0, 30).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--olive))] to-primary flex items-center justify-center text-[10px] font-bold text-white">3</span>{t('predictor.plantingDate')} *</Label>
                  <Input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} className="h-11 border-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(var(--sky))] to-[hsl(var(--mint))] flex items-center justify-center text-[10px] font-bold text-white">4</span>{t('predictor.fieldConditions')}</Label>
                  <Textarea placeholder={t('predictor.fieldConditionsPlaceholder')} value={fieldConditions} onChange={(e) => setFieldConditions(e.target.value)} rows={4} className="border-primary/20" />
                </div>
                <Button onClick={getPrediction} disabled={isLoading} className="w-full bg-gradient-to-r from-accent to-[hsl(var(--terracotta))] hover:opacity-90 shadow-lg" size="lg">
                  {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('predictor.predicting')}</>) : (<><Zap className="mr-2 h-5 w-5" />{t('predictor.getPrediction')}</>)}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div><span className="text-sm font-medium text-muted-foreground">{t('predictor.confidence')}</span><div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{result.confidenceScore}</div></div>
                        <div className="w-20 h-20"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={getConfidenceData()} innerRadius={25} outerRadius={35} paddingAngle={2} dataKey="value"><Cell fill="hsl(var(--primary))" /><Cell fill="hsl(var(--muted))" /></Pie></PieChart></ResponsiveContainer></div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Card className="border-primary/20 glass-card overflow-hidden group hover:shadow-xl transition-all">
                        <CardContent className="p-4 text-center relative">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--olive))] flex items-center justify-center shadow-lg"><TrendingUp className="h-6 w-6 text-white" /></div>
                          <div className="text-2xl font-bold text-foreground">{result.harvestYield}</div>
                          <div className="text-xs text-muted-foreground">{t('predictor.harvestYield')}</div>
                          <div className={`text-xs mt-1 ${result.yieldTrend.includes('+') ? 'text-primary' : 'text-destructive'}`}>{result.yieldTrend} {t('predictor.vsAvg')}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                      <Card className="border-accent/20 glass-card overflow-hidden group hover:shadow-xl transition-all">
                        <CardContent className="p-4 text-center relative">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-accent to-[hsl(var(--terracotta))] flex items-center justify-center shadow-lg"><DollarSign className="h-6 w-6 text-white" /></div>
                          <div className="text-2xl font-bold text-foreground">{result.marketPrice}</div>
                          <div className="text-xs text-muted-foreground">{t('predictor.marketPrice')}</div>
                          <div className={`text-xs mt-1 ${result.priceTrend.includes('+') ? 'text-primary' : 'text-destructive'}`}>{result.priceTrend}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-[hsl(var(--sky))]/30 bg-gradient-to-r from-[hsl(var(--sky))]/10 to-[hsl(var(--mint))]/10 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--sky))] to-[hsl(var(--mint))] shadow-lg"><CloudRain className="h-5 w-5 text-white" /></div>
                          <div><div className="font-semibold text-foreground mb-1">{t('predictor.weatherOutlook')}</div><p className="text-sm text-muted-foreground">{result.weatherOutlook}</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Card className="glass-card">
                      <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-accent" />{t('predictor.potentialProblems')}</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.potentialProblems.map((problem, index) => (
                            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className={`p-3 rounded-lg border ${getSeverityColor(problem.severity)}`}>
                              <div className="flex items-center justify-between mb-1"><span className="font-medium">{problem.issue}</span><span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">{problem.probability}</span></div>
                              <span className="text-xs">{t('predictor.severity')}: {problem.severity}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <Card className="glass-card">
                      <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[hsl(var(--lavender))]" />{t('predictor.marketAnalysis')}</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground">{result.marketAnalysis}</p></CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent glass-card">
                      <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" />{t('predictor.recommendations')}</CardTitle></CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.1 }} className="flex items-start gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-background/50">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5">{index + 1}</span>{rec}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
                    <CardContent className="text-center py-16">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 via-[hsl(var(--terracotta))]/20 to-[hsl(var(--coral))]/20 flex items-center justify-center"><BarChart3 className="h-12 w-12 text-accent" /></div>
                      </motion.div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">{t('predictor.readyToPredict')}</h3>
                      <p className="text-muted-foreground">{t('predictor.noPredictionYet')}</p>
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

export default HarvestPredictor;
