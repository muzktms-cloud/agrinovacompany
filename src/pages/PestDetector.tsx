import { useState, useRef } from "react";
import { Upload, Camera, Bug, AlertTriangle, Shield, Loader2, Sprout, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PestResult {
  pestName: string;
  scientificName?: string | null;
  threatLevel: "Low" | "Medium" | "High" | "Critical";
  description: string;
  damageDescription: string;
  treatment: string[];
  prevention: string[];
  confidence: "High" | "Medium" | "Low";
  additionalNotes?: string | null;
  rawResponse?: string;
}

const threatColors = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Critical: "bg-red-100 text-red-800 border-red-200",
};

const PestDetector = () => {
  const [image, setImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PestResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePest = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("identify-pest", {
        body: { imageBase64: image, cropType },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Analysis failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setResult(data);
      
      // Save to pest history
      await supabase.from('pest_detections').insert({
        crop_type: cropType || 'Unknown',
        pest_name: data.pestName || 'Unknown',
        threat_level: data.threatLevel || 'Unknown',
        description: data.description || '',
        damage: data.damageDescription || '',
        treatment: data.treatment?.join('; ') || '',
        prevention: data.prevention?.join('; ') || '',
      });

      toast({
        title: "Analysis complete",
        description: `Identified: ${data.pestName || "See results below"}. Saved to history.`,
      });
    } catch (error) {
      console.error("Error analyzing pest:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            <Link to="/weather" className="text-muted-foreground hover:text-foreground transition-colors">Weather</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            AI Pest Detector
          </h1>
          <p className="text-muted-foreground">
            Upload a photo of a pest or plant damage and our AI will identify it and suggest treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Take a clear photo of the pest or affected plant area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type (optional)</Label>
                  <Input
                    id="cropType"
                    placeholder="e.g., Tomatoes, Corn, Wheat..."
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {!image ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-foreground font-medium">Click to upload</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </div>
                  </button>
                ) : (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded pest"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={analyzePest}
                  disabled={!image || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bug className="h-4 w-4" />
                      Identify Pest
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && !result.rawResponse ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{result.pestName}</CardTitle>
                        {result.scientificName && (
                          <CardDescription className="italic">
                            {result.scientificName}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={threatColors[result.threatLevel]}>
                        {result.threatLevel} Threat
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Description</h4>
                      <p className="text-muted-foreground text-sm">{result.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Damage
                      </h4>
                      <p className="text-muted-foreground text-sm">{result.damageDescription}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Treatment & Prevention
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Recommended Treatments</h4>
                      <ul className="space-y-2">
                        {result.treatment.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Prevention Tips</h4>
                      <ul className="space-y-2">
                        {result.prevention.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-accent mt-1">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {result.additionalNotes && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{result.additionalNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : result?.rawResponse ? (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{result.rawResponse}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <Bug className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Upload an image of a pest or plant damage to get AI-powered identification and treatment recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PestDetector;
