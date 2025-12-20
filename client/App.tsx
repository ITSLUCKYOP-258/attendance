import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Placeholder from "./pages/Placeholder";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/timetable" element={<Placeholder title="Timetable Management" description="Manage class schedules and timings" />} />
            <Route path="/admin/subjects" element={<Placeholder title="Subject Management" description="Add, edit, or remove subjects" />} />
            <Route path="/admin/users" element={<Placeholder title="User Management" description="Manage student accounts" />} />
            <Route path="/admin/roles" element={<Placeholder title="Role Management" description="Configure user roles and permissions" />} />
            <Route path="/admin/analytics" element={<Placeholder title="Analytics & Reports" description="View attendance analytics and trends" />} />
            <Route path="/admin/export" element={<Placeholder title="Data Export" description="Export attendance data in various formats" />} />
            <Route path="/admin/settings" element={<Placeholder title="Global Settings" description="Configure system-wide settings" />} />
            <Route path="/admin/locks" element={<Placeholder title="Lock Management" description="Configure attendance data locks" />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
