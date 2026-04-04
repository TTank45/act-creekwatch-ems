import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PublicDashboardPage from "../pages/PublicDashboardPage";
import VolunteerDashboardPage from "../pages/VolunteerDashboardPage";
import UploadCsvPage from "../pages/UploadCsvPage";
import AlertsPage from "../pages/AlertsPage";
import AlertDetailsPage from "../pages/AlertDetailsPage";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import NotFoundPage from "../pages/NotFoundPage";
import CoordinatorPage from "../pages/CoordinatorPage";

function AppRouter() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<PublicDashboardPage />} />
          <Route path="/volunteer" element={<VolunteerDashboardPage />} />
          <Route path="/upload" element={<UploadCsvPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/coordinator" element={<CoordinatorPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default AppRouter;