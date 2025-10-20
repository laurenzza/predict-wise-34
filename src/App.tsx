import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { DeveloperDashboard } from "./pages/DeveloperDashboard";
import { RoleSelection } from "./pages/RoleSelection";
import { UserPeriod } from "./pages/user/UserPeriod";
import { UserDataset } from "./pages/user/UserDataset";
import { UserStatistics } from "./pages/user/UserStatistics";
import { UserInfo } from "./pages/user/UserInfo";
import { UserTopProducts } from "./pages/user/UserTopProducts";
import { Dataset } from "./pages/Dataset";
import { Predictions } from "./pages/Predictions";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AccountSettings } from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import { ProtectedRoutes, UnprotectedRoutes } from "./utils/AuthMiddleware";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/period" element={<UserPeriod />} />
            <Route path="/user/dataset" element={<UserDataset />} />
            <Route path="/user/statistics" element={<UserStatistics />} />
            <Route path="/user/top-products" element={<UserTopProducts />} />
            <Route path="/user/info" element={<UserInfo />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            {/* <Route path="/developer/dashboard" element={<DeveloperDashboard />} /> */}
            {/* <Route path="/dataset" element={<Dataset />} /> */}
            {/* <Route path="/predictions" element={<Predictions />} /> */}
          </Route>
          <Route element={<UnprotectedRoutes/>}>
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/admin-login" element={<LoginAsAdmin />} /> */}
            {/* <Route path="/developer-login" element={<LoginAsDeveloper />} /> */}
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
