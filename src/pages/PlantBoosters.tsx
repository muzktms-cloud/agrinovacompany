import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ShoppingCart, Leaf, AlertTriangle, Sparkles, MapPin, TrendingUp, FlaskConical, Beaker, Sprout, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Booster {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_rupees: number;
  unit: string;
  how_to_use: string | null;
  where_to_apply: string | null;
  consequences: string | null;
  results: string | null;
  safe_for: string | null;
  image_url: string | null;
  in_stock: boolean | null;
}

interface CartItem {
  product: Booster;
  quantity: number;
}

const categoryIcons: Record<string, any> = {
  microbial: FlaskConical,
  biostimulant: Sparkles,
  "soil-amendment": Sprout,
  "organic-nutrient": Leaf,
  "seed-treatment": Beaker,
};

const PlantBoosters = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("plant_boosters")
        .select("*")
        .eq("in_stock", true)
        .order("price_rupees", { ascending: true });
      if (!error && data) setProducts(data as Booster[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product: Booster) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: product.name, description: t("boostersPage.addToCart") + " ✓" });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price_rupees * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    toast({ title: "✓", description: t("boostersPage.orderPlaced") });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-olive/15 via-primary/10 to-accent/10 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-olive rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-olive/20 text-olive border-0 mb-4">
              <Leaf className="h-3 w-3 mr-1" />
              {t("boostersPage.tagline")}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("boostersPage.heroTitle")} <span className="text-primary">{t("boostersPage.heroTitleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">{t("boostersPage.heroSubtitle")}</p>

            {/* Disclaimer */}
            <div className="rounded-xl border-2 border-amber-500/40 bg-amber-500/10 p-4 max-w-3xl flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{t("boostersPage.disclaimerTitle")}</p>
                <p className="text-sm text-muted-foreground">{t("boostersPage.disclaimerText")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main */}
          <div>
            {/* Search + Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("boostersPage.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  {t("boostersPage.allCategories")}
                </Button>
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || Leaf;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="gap-1.5"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t(`boostersPage.categories.${cat}`, cat)}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <p className="text-center text-muted-foreground py-12">{t("boostersPage.loading")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProducts.map((product) => {
                  const Icon = categoryIcons[product.category] || Leaf;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full flex flex-col hover:shadow-xl transition-shadow border-border/50">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="p-2.5 rounded-lg bg-olive/10">
                              <Icon className="h-5 w-5 text-olive" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {t(`boostersPage.categories.${product.category}`, product.category)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-primary">₹{product.price_rupees}</span>
                            <span className="text-sm text-muted-foreground">{t("boostersPage.perUnit")} {product.unit}</span>
                          </div>
                          {product.safe_for && (
                            <p className="text-xs text-muted-foreground mt-2">
                              <span className="font-semibold">{t("boostersPage.safeFor")}:</span> {product.safe_for}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1">
                                {t("boostersPage.viewDetails")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-olive" />
                                  {product.name}
                                </DialogTitle>
                                <DialogDescription>{product.description}</DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh] pr-4">
                                <div className="space-y-5 py-2">
                                  <section>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                      <Sparkles className="h-4 w-4 text-primary" />
                                      {t("boostersPage.howToUse")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{product.how_to_use}</p>
                                  </section>
                                  <section>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4 text-accent" />
                                      {t("boostersPage.whereToApply")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{product.where_to_apply}</p>
                                  </section>
                                  <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                      {t("boostersPage.consequences")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{product.consequences}</p>
                                  </section>
                                  <section>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                      <TrendingUp className="h-4 w-4 text-olive" />
                                      {t("boostersPage.results")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{product.results}</p>
                                  </section>
                                  {product.safe_for && (
                                    <section>
                                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Leaf className="h-4 w-4 text-primary" />
                                        {t("boostersPage.safeFor")}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">{product.safe_for}</p>
                                    </section>
                                  )}
                                </div>
                              </ScrollArea>
                              <Button onClick={() => addToCart(product)} className="w-full gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                {t("boostersPage.addToCart")} — ₹{product.price_rupees}
                              </Button>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" className="flex-1 gap-1" onClick={() => addToCart(product)}>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {t("boostersPage.addToCart")}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  {t("boostersPage.cart")}
                  {cartCount > 0 && (
                    <Badge className="ml-auto bg-primary text-primary-foreground">{cartCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">{t("boostersPage.cartEmpty")}</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-2 items-start border-b border-border/40 pb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.product.price_rupees} × {item.quantity}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.product.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.product.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 ml-1 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-foreground">₹{item.product.price_rupees * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex-col gap-3 border-t border-border/50 pt-4">
                  <div className="flex justify-between w-full text-base font-semibold">
                    <span>{t("boostersPage.subtotal")}</span>
                    <span className="text-primary">₹{cartTotal}</span>
                  </div>
                  <Button className="w-full" onClick={handleCheckout}>
                    {t("boostersPage.checkout")}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlantBoosters;
