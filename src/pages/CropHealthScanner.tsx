import { useState, useRef } from "react";
import { Camera, Upload, Leaf, AlertTriangle, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

interface HealthCategory { percentage: number; indicators: string[]; actions: string[]; }
interface HealthData {
  cropType: string; overallHealthScore: number;
  categories: { healthy: HealthCategory; needsAttention: HealthCategory; atRisk: HealthCategory; severelyDamaged: HealthCategory; };
  primaryConcerns: string[]; immediateActions: string[]; longTermRecommendations: string[]; summary: string;
}

const CropHealthScanner = () => {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => { setImage(reader.result as string); setHealthData(null); }; reader.readAsDataURL(file); }
  };

  const analyzeHealth = async () => {
    if (!image) { toast({ title: t('cropHealth.noImage'), description: t('cropHealth.noImageDesc'), variant: "destructive" }); return; }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('crop-health-scanner', { body: { imageBase64: image, cropType, language: i18n.language } });
      if (error) throw error;
      setHealthData(data);
      toast({ title: t('cropHealth.analysisComplete'), description: `${t('cropHealth.analysisScoreDesc')} ${data.overallHealthScore}/100` });
    } catch (error: any) {
      console.error('Error analyzing crop health:', error);
      toast({ title: t('pestDetector.analysisFailed'), description: error.message || t('common.error'), variant: "destructive" });
    } finally { setIsAnalyzing(false); }
  };

  const getScoreColor = (score: number) => { if (score >= 80) return "text-green-600"; if (score >= 60) return "text-yellow-600"; if (score >= 40) return "text-orange-600"; return "text-red-600"; };

  const categoryConfig = {
    healthy: { icon: Leaf, color: "text-green-600", bg: "bg-green-100", label: t('cropHealth.healthy') },
    needsAttention: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100", label: t('cropHealth.needsAttention') },
    atRisk: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100", label: t('cropHealth.atRisk') },
    severelyDamaged: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: t('cropHealth.severelyDamaged') },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">{t('cropHealth.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('cropHealth.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />{t('cropHealth.uploadTitle')}</CardTitle>
              <CardDescription>{t('cropHealth.uploadDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                {image ? (<img src={image} alt="Uploaded crop" className="max-h-64 mx-auto rounded-lg object-contain" />) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">{t('cropHealth.uploadOrDrag')}</p>
                    <p className="text-sm text-muted-foreground">{t('cropHealth.fileTypes')}</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropType">{t('cropHealth.cropTypeOptional')}</Label>
                <Input id="cropType" placeholder={t('cropHealth.cropTypePlaceholder')} value={cropType} onChange={(e) => setCropType(e.target.value)} />
              </div>
              <Button className="w-full" onClick={analyzeHealth} disabled={!image || isAnalyzing}>
                {isAnalyzing ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('pestDetector.analyzing')}</>) : (<><Leaf className="h-4 w-4 mr-2" />{t('cropHealth.analyzeHealth')}</>)}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {healthData ? (
              <>
                <Card>
                  <CardHeader><CardTitle>{t('cropHealth.overallScore')}</CardTitle><CardDescription>{healthData.cropType} - {healthData.summary}</CardDescription></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl font-bold ${getScoreColor(healthData.overallHealthScore)}`}>{healthData.overallHealthScore}</div>
                      <div className="flex-1"><Progress value={healthData.overallHealthScore} className="h-4" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>{t('cropHealth.healthBreakdown')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {(Object.entries(healthData.categories) as [keyof typeof categoryConfig, HealthCategory][]).map(([key, category]) => {
                      const config = categoryConfig[key]; const Icon = config.icon;
                      return (
                        <div key={key} className={`p-4 rounded-lg ${config.bg}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2"><Icon className={`h-5 w-5 ${config.color}`} /><span className={`font-semibold ${config.color}`}>{config.label}</span></div>
                            <Badge variant="secondary">{category.percentage}%</Badge>
                          </div>
                          {category.indicators.length > 0 && <div className="text-sm text-muted-foreground mb-2"><strong>{t('cropHealth.signs')}:</strong> {category.indicators.join(", ")}</div>}
                          {category.actions.length > 0 && <div className="text-sm"><strong>{t('cropHealth.actions')}:</strong> {category.actions.join(", ")}</div>}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>{t('cropHealth.recommendations')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {healthData.primaryConcerns.length > 0 && (<div><h4 className="font-semibold text-red-600 mb-2">{t('cropHealth.primaryConcerns')}</h4><ul className="list-disc list-inside space-y-1 text-sm">{healthData.primaryConcerns.map((c, i) => <li key={i}>{c}</li>)}</ul></div>)}
                    {healthData.immediateActions.length > 0 && (<div><h4 className="font-semibold text-orange-600 mb-2">{t('cropHealth.immediateActions')}</h4><ul className="list-disc list-inside space-y-1 text-sm">{healthData.immediateActions.map((a, i) => <li key={i}>{a}</li>)}</ul></div>)}
                    {healthData.longTermRecommendations.length > 0 && (<div><h4 className="font-semibold text-green-600 mb-2">{t('cropHealth.longTermRecs')}</h4><ul className="list-disc list-inside space-y-1 text-sm">{healthData.longTermRecommendations.map((r, i) => <li key={i}>{r}</li>)}</ul></div>)}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Leaf className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">{t('cropHealth.noResultsYet')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CropHealthScanner;
