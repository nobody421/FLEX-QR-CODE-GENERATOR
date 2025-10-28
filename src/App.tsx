import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import QrGenerator from "./pages/QrGenerator";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics"; // <-- Added Analytics import
import Layout from "./components/Layout";
import Settings from "./pages/Settings"; // <-- Added Settings import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics/:qrCodeId" element={<Analytics />} /> {/* <-- New Analytics Route */}
            <Route path="/settings" element={<Settings />} /> {/* Ensure Settings route is present */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;