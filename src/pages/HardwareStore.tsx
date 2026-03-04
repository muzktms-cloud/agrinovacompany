import { useState, useEffect } from "react";
import { Cpu, Cloud, ShoppingCart, Check, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

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
}

const HardwareStore = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cloudOptions, setCloudOptions] = useState<Record<string, boolean>>({});
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

  const addToCart = (product: Product) => {
    const withCloud = cloudOptions[product.id] || false;
    setCart([...cart, { product, withCloudAnalytics: withCloud }]);
    toast({ title: t('store.addedToCart'), description: `${product.name}${withCloud ? ` + ${t('store.cloudAnalytics')}` : ''}` });
  };

  const removeFromCart = (index: number) => { const newCart = [...cart]; newCart.splice(index, 1); setCart(newCart); };
  const getItemTotal = (item: CartItem) => { let total = item.product.price_rupees; if (item.withCloudAnalytics && item.product.cloud_analytics_price) total += item.product.cloud_analytics_price; return total; };
  const cartTotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);

  const handleCheckout = () => {
    toast({ title: t('store.orderPlaced'), description: t('store.orderPlacedDesc') });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">{t('store.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('store.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Cpu className="h-8 w-8 text-primary" />
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="flex items-center gap-1 text-2xl font-bold"><IndianRupee className="h-5 w-5" />{product.price_rupees.toLocaleString('en-IN')}</div>
                      {product.has_cloud_analytics && product.cloud_analytics_price && (
                        <div className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-primary" /><Label htmlFor={`cloud-${product.id}`} className="text-sm">{t('store.cloudAnalytics')}</Label></div>
                            <Switch id={`cloud-${product.id}`} checked={cloudOptions[product.id] || false} onCheckedChange={(checked) => setCloudOptions({ ...cloudOptions, [product.id]: checked })} />
                          </div>
                          <p className="text-xs text-muted-foreground">+₹{product.cloud_analytics_price}{t('store.perMonth')} - {t('store.cloudAnalyticsDesc')}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => addToCart(product)}><ShoppingCart className="h-4 w-4 mr-2" />{t('store.addToCart')}</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />{t('store.yourCart')}</CardTitle></CardHeader>
              <CardContent>
                {cart.length === 0 ? (<p className="text-muted-foreground text-center py-4">{t('store.cartEmpty')}</p>) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          {item.withCloudAnalytics && (<p className="text-xs text-primary flex items-center gap-1"><Cloud className="h-3 w-3" />{t('store.cloudAnalytics')}</p>)}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{getItemTotal(item).toLocaleString('en-IN')}</p>
                          <button onClick={() => removeFromCart(index)} className="text-xs text-destructive hover:underline">{t('store.remove')}</button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>{t('store.total')}:</span>
                        <span className="flex items-center"><IndianRupee className="h-4 w-4" />{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (<CardFooter><Button className="w-full" onClick={handleCheckout}><Check className="h-4 w-4 mr-2" />{t('store.checkout')}</Button></CardFooter>)}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HardwareStore;
