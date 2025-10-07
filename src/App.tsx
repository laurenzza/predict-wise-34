import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { RoleSelection } from "./pages/RoleSelection";
import { UserPredictions } from "./pages/user/UserPredictions";
import { UserPeriod } from "./pages/user/UserPeriod";
import { UserDataset } from "./pages/user/UserDataset";
import { UserCategories } from "./pages/user/UserCategories";
import { UserStatistics } from "./pages/user/UserStatistics";
import { UserInfo } from "./pages/user/UserInfo";
import { Dataset } from "./pages/Dataset";
import { Predictions } from "./pages/Predictions";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AccountSettings } from "./pages/AccountSettings";
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
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user/predictions" element={<UserPredictions />} />
          <Route path="/user/period" element={<UserPeriod />} />
          <Route path="/user/dataset" element={<UserDataset />} />
          <Route path="/user/categories" element={<UserCategories />} />
          <Route path="/user/statistics" element={<UserStatistics />} />
          <Route path="/user/info" element={<UserInfo />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
