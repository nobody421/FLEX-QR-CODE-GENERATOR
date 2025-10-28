import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import QrGenerator from "./pages/QrGenerator";
import QrEditor from "./pages/QrEditor";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import Login from "./pages/Login"; // Import the new Login page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/edit/:qrCodeId" element={<QrEditor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics/:qrCodeId" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;