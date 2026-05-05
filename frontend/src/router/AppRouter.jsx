import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import PublicDashboardPage from "../pages/PublicDashboardPage";
import VolunteerDashboardPage from "../pages/VolunteerDashboardPage";
import UploadCsvPage from "../pages/UploadCsvPage";
import AlertsPage from "../pages/AlertsPage";
import AlertDetailsPage from "../pages/AlertDetailsPage";
import CoordinatorPage from "../pages/CoordinatorPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRouter() {
  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          {/* LOGIN */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRole={[
                  "volunteer",
                  "coordinator",
                ]}
              >
                <PublicDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* VOLUNTEER */}
          <Route
            path="/volunteer"
            element={
              <ProtectedRoute allowedRole="volunteer">
                <VolunteerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* UPLOAD */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRole="volunteer">
                <UploadCsvPage />
              </ProtectedRoute>
            }
          />

          {/* ALERTS */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute
                allowedRole={[
                  "volunteer",
                  "coordinator",
                ]}
              >
                <AlertsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts/:id"
            element={
              <ProtectedRoute
                allowedRole={[
                  "volunteer",
                  "coordinator",
                ]}
              >
                <AlertDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* COORDINATOR */}
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <CoordinatorPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default AppRouter;