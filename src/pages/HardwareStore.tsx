import { useState, useEffect, useMemo } from "react";
import { Cpu, Cloud, ShoppingCart, Check, IndianRupee, Loader2, Search, Filter, Star, Package, Zap, Droplets, Radio, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price_rupees: number;
  image_url: string | null;
  category: string;
  has_cloud_analytics: boolean;
  cloud_analytics_price: number | null;
  in_stock: boolean;
}

interface CartItem {
  product: Product;
  withCloudAnalytics: boolean;
  quantity: number;
}

const categoryIcons: Record<string, any> = {
  "Sensors": Radio,
  "Controllers": Zap,
  "Drones": Package,
  "Weather Stations": Cloud,
  "Irrigation": Droplets,
  "Starter Kits": Box,
};

const HardwareStore = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cloudOptions, setCloudOptions] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('hardware_products').select('*').eq('in_stock', true).order('price_rupees', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({ title: t('store.errorLoading'), description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const withCloud = cloudOptions[product.id] || false;
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.withCloudAnalytics === withCloud);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { product, withCloudAnalytics: withCloud, quantity: 1 }]);
    }
    toast({ title: t('store.addedToCart'), description: `${product.name}${withCloud ? ` + ${t('store.cloudAnalytics')}` : ''}` });
  };

  const removeFromCart = (index: number) => { const newCart = [...cart]; newCart.splice(index, 1); setCart(newCart); };
  const getItemTotal = (item: CartItem) => { let total = item.product.price_rupees; if (item.withCloudAnalytics && item.product.cloud_analytics_price) total += item.product.cloud_analytics_price; return total * item.quantity; };
  const cartTotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    toast({ title: t('store.orderPlaced'), description: t('store.orderPlacedDesc') });
    setCart([]);
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Cpu;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-3 bg-accent/20 px-4 py-2 rounded-full">
            {t('store.featured', 'Featured')}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('store.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('store.subtitle')}</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('store.searchProducts', 'Search products...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              <Filter className="h-3 w-3 mr-1" />
              {t('store.allCategories', 'All')}
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground text-lg">{t('store.emptyStoreDesc', 'No products found. Try a different search.')}</p>
              </div>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="show"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => {
                    const CategoryIcon = getCategoryIcon(product.category);
                    return (
                      <motion.div 
                        key={product.id}
                        layout
                        variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-border/60">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CategoryIcon className="h-6 w-6 text-primary" />
                              </div>
                              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 space-y-4 pt-0">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-foreground flex items-center">
                                <IndianRupee className="h-5 w-5" />{product.price_rupees.toLocaleString('en-IN')}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} className={`h-3 w-3 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                ))}
                              </div>
                              <span className="text-xs">(4.0)</span>
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                                {t('store.inStock', 'In Stock')}
                              </Badge>
                            </div>

                            {product.has_cloud_analytics && product.cloud_analytics_price && (
                              <div className="p-3 bg-muted/50 rounded-lg space-y-2 border border-border/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Cloud className="h-4 w-4 text-primary" />
                                    <Label htmlFor={`cloud-${product.id}`} className="text-sm font-medium cursor-pointer">
                                      {t('store.cloudAnalytics')}
                                    </Label>
                                  </div>
                                  <Switch 
                                    id={`cloud-${product.id}`} 
                                    checked={cloudOptions[product.id] || false} 
                                    onCheckedChange={(checked) => setCloudOptions({ ...cloudOptions, [product.id]: checked })} 
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  +₹{product.cloud_analytics_price}{t('store.perMonth')} — {t('store.cloudAnalyticsDesc')}
                                </p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button className="w-full" onClick={() => addToCart(product)}>
                              <ShoppingCart className="h-4 w-4 mr-2" />{t('store.addToCart')}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t('store.yourCart')}
                  </span>
                  {cartItemCount > 0 && (
                    <Badge variant="default" className="rounded-full px-2.5">
                      {cartItemCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">{t('store.cartEmpty')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.div 
                          key={`${item.product.id}-${item.withCloudAnalytics}-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex justify-between items-start pb-3 border-b border-border/50"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name}</p>
                            {item.withCloudAnalytics && (
                              <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                                <Cloud className="h-3 w-3" />{t('store.cloudAnalytics')}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t('store.quantity', 'Qty')}: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold text-sm">₹{getItemTotal(item).toLocaleString('en-IN')}</p>
                            <button onClick={() => removeFromCart(index)} className="text-xs text-destructive hover:underline">
                              {t('store.remove')}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>{t('store.total')}:</span>
                        <span className="flex items-center text-primary">
                          <IndianRupee className="h-4 w-4" />{cartTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="pt-0">
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    <Check className="h-4 w-4 mr-2" />{t('store.checkout')}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HardwareStore;
