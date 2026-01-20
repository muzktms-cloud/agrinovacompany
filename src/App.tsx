import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planner from "./pages/Planner";
import PestDetector from "./pages/PestDetector";
import WeatherAdvisor from "./pages/WeatherAdvisor";
import CropHealthScanner from "./pages/CropHealthScanner";
import HardwareStore from "./pages/HardwareStore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/pest-detector" element={<PestDetector />} />
          <Route path="/weather" element={<WeatherAdvisor />} />
          <Route path="/crop-health" element={<CropHealthScanner />} />
          <Route path="/store" element={<HardwareStore />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
