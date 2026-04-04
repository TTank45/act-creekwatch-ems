import { useEffect, useMemo, useState } from "react";
import { getPublicDashboardData } from "../services/dashboardService";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import StatCard from "../components/common/StatCard";
import TrendChart from "../components/dashboard/TrendChart";
import CreekMap from "../components/dashboard/CreekMap";

function PublicDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSite, setSelectedSite] = useState("All Sites");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getPublicDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary || {};
  const monitoringSites = dashboardData?.monitoringSites || [];
  const recentAlerts = dashboardData?.recentAlerts || [];
  const historicalTrends = dashboardData?.historicalTrends || [];
  const latestReadings = dashboardData?.latestReadings || [];

  const siteOptions = useMemo(() => {
    return ["All Sites", ...monitoringSites.map((site) => site.name)];
  }, [monitoringSites]);

  const filteredMonitoringSites = useMemo(() => {
    if (selectedSite === "All Sites") return monitoringSites;
    return monitoringSites.filter((site) => site.name === selectedSite);
  }, [monitoringSites, selectedSite]);

  const filteredRecentAlerts = useMemo(() => {
    return recentAlerts.filter((alert) => {
      const matchesSite =
        selectedSite === "All Sites" || alert.location === selectedSite;
      const matchesSeverity =
        selectedSeverity === "All" || alert.severity === selectedSeverity;

      return matchesSite && matchesSeverity;
    });
  }, [recentAlerts, selectedSite, selectedSeverity]);

  const filteredReadings = useMemo(() => {
    if (selectedSite === "All Sites") return latestReadings;
    return latestReadings.filter((row) => row.siteName === selectedSite);
  }, [latestReadings, selectedSite]);

  function calculateAverage(rows, key) {
    if (!rows.length) return "N/A";
    const total = rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
    return (total / rows.length).toFixed(2);
  }

  const displayedSummary = useMemo(() => {
    if (selectedSite === "All Sites") {
      return {
        ph: summary.ph ?? "N/A",
        turbidity: summary.turbidity ?? "N/A",
        dissolvedOxygen: summary.dissolvedOxygen ?? "N/A",
        temperature: summary.temperature ?? "N/A",
        eColi: summary.eColi ?? "N/A",
      };
    }

    return {
      ph: calculateAverage(filteredReadings, "pH"),
      turbidity: calculateAverage(filteredReadings, "turbidity"),
      dissolvedOxygen: calculateAverage(filteredReadings, "dissolvedOxygen"),
      temperature: calculateAverage(filteredReadings, "temperature"),
      eColi: calculateAverage(filteredReadings, "eColi"),
    };
  }, [selectedSite, summary, filteredReadings]);

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Public Dashboard</h1>
          <p>Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <h1>Public Dashboard</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!dashboardData) {
    return (
      <section className="page">
        <div className="container">
          <h1>Public Dashboard</h1>
          <p>No dashboard data available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Public Dashboard</h1>
          <p>
            Live environmental status, current readings, recent alerts, and
            historical trends for monitored creek sites.
          </p>
        </div>

        <div className="top-stats-grid">
          <StatCard label="pH" value={displayedSummary.ph} />
          <StatCard
            label="Turbidity"
            value={displayedSummary.turbidity}
            unit="NTU"
          />
          <StatCard
            label="Dissolved Oxygen"
            value={displayedSummary.dissolvedOxygen}
            unit="mg/L"
          />
          <StatCard
            label="Temperature"
            value={displayedSummary.temperature}
            unit="°C"
          />
          <StatCard
            label="E. coli"
            value={displayedSummary.eColi}
            unit="CFU/100mL"
          />
        </div>

        <SectionCard title="Dashboard Filters">
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <div>
              <label htmlFor="siteFilter"><strong>Site:</strong></label>
              <br />
              <select
                id="siteFilter"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                style={{ marginTop: "0.4rem", padding: "0.5rem" }}
              >
                {siteOptions.map((siteName) => (
                  <option key={siteName} value={siteName}>
                    {siteName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="severityFilter"><strong>Alert Severity:</strong></label>
              <br />
              <select
                id="severityFilter"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ marginTop: "0.4rem", padding: "0.5rem" }}
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <div className="dashboard-grid">
          <SectionCard title="Creek Health Status">
            <StatusBadge status={dashboardData.creekHealthStatus || "Unknown"} />
          </SectionCard>

          <SectionCard title="Monitoring Sites">
            {filteredMonitoringSites.length > 0 ? (
              <ul className="data-list">
                {filteredMonitoringSites.map((site) => (
                  <li key={site.id}>
                    <strong>{site.name}</strong> —{" "}
                    <StatusBadge status={site.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No monitoring sites available.</p>
            )}
          </SectionCard>

          <SectionCard title="Recent Alerts">
            {filteredRecentAlerts.length > 0 ? (
              <ul className="data-list">
                {filteredRecentAlerts.map((alert) => (
                  <li key={alert.id}>
                    <strong>{alert.title}</strong>
                    <br />
                    <span>{alert.location}</span>
                    <br />
                    <small>{alert.time}</small>
                    <br />
                    <StatusBadge status={alert.severity} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent alerts for the selected filters.</p>
            )}
          </SectionCard>

          <SectionCard title="System Summary">
            <ul className="data-list">
              <li>Total Monitoring Sites: {filteredMonitoringSites.length}</li>
              <li>Recent Alerts: {filteredRecentAlerts.length}</li>
              <li>Health Status: {dashboardData.creekHealthStatus || "Unknown"}</li>
            </ul>
          </SectionCard>
        </div>

        <div className="map-section">
          <SectionCard title="Monitoring Map">
            <CreekMap sites={filteredMonitoringSites} />
          </SectionCard>
        </div>

        <div className="chart-section">
          <SectionCard title="Historical Trends">
            {historicalTrends.length > 0 ? (
              <TrendChart data={historicalTrends} />
            ) : (
              <p>No historical trend data available.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

export default PublicDashboardPage;