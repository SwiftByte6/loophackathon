import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import AIAgent from "./pages/student/AIAgent";
import StudentProgress from "./pages/student/StudentProgress";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyCourses from "./pages/faculty/FacultyCourses";
import FacultyInsights from "./pages/faculty/FacultyInsights";
import FacultyIntegrity from "./pages/faculty/FacultyIntegrity";
import FacultyAIPanel from "./pages/faculty/FacultyAIPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminConfig from "./pages/admin/AdminConfig";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-lg gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/courses" element={<StudentCourses />} />
      <Route path="/student/ai" element={<AIAgent />} />
      <Route path="/student/progress" element={<StudentProgress />} />

      <Route path="/faculty" element={<FacultyDashboard />} />
      <Route path="/faculty/courses" element={<FacultyCourses />} />
      <Route path="/faculty/insights" element={<FacultyInsights />} />
      <Route path="/faculty/integrity" element={<FacultyIntegrity />} />
      <Route path="/faculty/ai-panel" element={<FacultyAIPanel />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/audit" element={<AdminAudit />} />
      <Route path="/admin/curriculum" element={<AdminCurriculum />} />
      <Route path="/admin/config" element={<AdminConfig />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
