import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeamWorkspace } from "./pages/TeamWorkspace";
import { SupervisorDashboard } from "./pages/SupervisorDashboard";
import { NotFound } from "./pages/NotFound";
import { RegistrationPage } from "./pages/RegistrationPage";
// Student Pages
import { ProjectsPage } from "./pages/student/ProjectsPage";
import { TasksPage } from "./pages/student/TasksPage";
import { CalendarPage } from "./pages/student/CalendarPage";
import { FilesPage } from "./pages/student/FilesPage";
import { TeamPage } from "./pages/student/TeamPage";
// Admin Pages
import { StudentApprovals } from "./pages/admin/StudentApprovals";
import { TeamManagement } from "./pages/admin/TeamManagement";
import { SupervisorManagement } from "./pages/admin/SupervisorManagement";
import { AttendanceReviews } from "./pages/admin/AttendanceReviews";
import { FinalReports } from "./pages/admin/FinalReports";
import { AdminRedirect } from "./components/AdminRedirect";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "";

if (!convexUrl) {
  console.warn(
    "VITE_CONVEX_URL is not set. Please set it in your .env file."
  );
}

const convex = new ConvexReactClient(convexUrl);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminRedirect />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="dashboard/projects" element={<ProjectsPage />} />
                <Route path="dashboard/tasks" element={<TasksPage />} />
                <Route path="dashboard/calendar" element={<CalendarPage />} />
                <Route path="dashboard/files" element={<FilesPage />} />
                <Route path="dashboard/team" element={<TeamPage />} />
                <Route path="team/:teamId" element={<TeamWorkspace />} />
                <Route path="supervisor" element={<SupervisorDashboard />} />
                <Route path="admin/approvals" element={<StudentApprovals />} />
                <Route path="admin/teams" element={<TeamManagement />} />
                <Route path="admin/supervisors" element={<SupervisorManagement />} />
                <Route path="admin/attendance" element={<AttendanceReviews />} />
                <Route path="admin/reports" element={<FinalReports />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </ConvexProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

