import { useEffect, useMemo, useState, useRef, } from "react";
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
  const [selectedSite, setSelectedSite] = useState("Yarralumla Creek");
  const telemetryRef = useRef(null);
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
    const interval = setInterval(() => {
  fetchDashboard();
}, 10000);

return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  if (telemetryRef.current) {
    telemetryRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [selectedSite]);

  const summary = dashboardData?.summary || {};
  const monitoringSites = dashboardData?.monitoringSites || [];
  const recentAlerts = dashboardData?.recentAlerts || [];
  const historicalTrends = dashboardData?.historicalTrends || [];
  const latestReadings = dashboardData?.latestReadings || [];
  const simulationMode = dashboardData?.simulationMode;
const simulatorEnabled = dashboardData?.simulatorEnabled;

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

  const tableHeaderStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const tableCellStyle = {
  
  padding: "12px",
  borderBottom: "1px solid #eee",
};
function getRowStatusColor(reading) {
  const turbidity = Number(reading.turbidity);
  const oxygen = Number(reading.dissolvedOxygen);
  const eColi = Number(reading.eColi);
  const ph = Number(reading.pH);

  if (
    turbidity > 8 ||
    oxygen < 5 ||
    eColi > 300 ||
    ph < 6.5 ||
    ph > 8.5
  ) {
    return "#ffebee";
  }

  if (
    turbidity > 5 ||
    oxygen < 7 ||
    eColi > 150
  ) {
    return "#fff8e1";
  }

  return "#e8f5e9";
}

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Public Dashboard</h1>
          <div
  style={{
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",

    backgroundColor: !simulatorEnabled
      ? "#eeeeee"
      : simulationMode === "CRITICAL"
      ? "#ffebee"
      : "#e8f5e9",

    color: !simulatorEnabled
      ? "#616161"
      : simulationMode === "CRITICAL"
      ? "#c62828"
      : "#2e7d32",
  }}
>
  {!simulatorEnabled
    ? "⚪ SIMULATOR DISABLED"
    : simulationMode === "CRITICAL"
    ? "🔴 CRITICAL EVENT ACTIVE"
    : "🟢 SYSTEM NORMAL"}
</div>
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
          <div
  style={{
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",

    backgroundColor: !simulatorEnabled
      ? "#eeeeee"
      : simulationMode === "CRITICAL"
      ? "#ffebee"
      : "#e8f5e9",

    color: !simulatorEnabled
      ? "#616161"
      : simulationMode === "CRITICAL"
      ? "#c62828"
      : "#2e7d32",
  }}
>
  {!simulatorEnabled
    ? "⚪ SIMULATOR DISABLED"
    : simulationMode === "CRITICAL"
    ? "🔴 CRITICAL EVENT ACTIVE"
    : "🟢 SYSTEM NORMAL"}
</div>
          <p>
            Live environmental status, current readings, recent alerts, and
            historical trends for monitored creek sites.
          </p>
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
        <SectionCard title="Live Sensor Telemetry">
  {latestReadings.length > 0 ? (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f4f4f4",
            }}
          >
            <th style={tableHeaderStyle}>Site</th>
            <th style={tableHeaderStyle}>pH</th>
            <th style={tableHeaderStyle}>Turbidity</th>
            <th style={tableHeaderStyle}>Oxygen</th>
            <th style={tableHeaderStyle}>Temp</th>
            <th style={tableHeaderStyle}>E. coli</th>
            <th style={tableHeaderStyle}>Time</th>
            <th style={tableHeaderStyle}>Sensor</th>
          </tr>
        </thead>

        <tbody>
          {latestReadings.map((reading, index) => (
            <tr
  key={index}
  style={{
    backgroundColor: getRowStatusColor(reading),
    transition: "0.3s ease",
  }}
>
              <td style={tableCellStyle}>
                {reading.siteName}
              </td>

              <td style={tableCellStyle}>
                {reading.pH}
              </td>

              <td style={tableCellStyle}>
                {reading.turbidity} NTU
              </td>

              <td style={tableCellStyle}>
                {reading.dissolvedOxygen} mg/L
              </td>

              <td style={tableCellStyle}>
                {reading.temperature} °C
              </td>

              <td style={tableCellStyle}>
                {reading.eColi}
              </td>

              <td style={tableCellStyle}>
                {reading.time}
              </td>

            <td
  style={{
    ...tableCellStyle,
    fontWeight: "bold",
    color:
      reading.sensorStatus === "OFFLINE"
        ? "#c62828"
        : "#2e7d32",
  }}
>
  {reading.sensorStatus === "OFFLINE"
    ? "OFFLINE"
    : "ONLINE"}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No telemetry available.</p>
  )}
</SectionCard>

        <div className="chart-section">
          <SectionCard
  title={
    selectedSite === "All Sites"
      ? "Live Sensor Telemetry - All Sites"
      : `Live Sensor Telemetry - ${selectedSite}`
  }
>
            {historicalTrends.length > 0 ? (
  <div ref={telemetryRef}>
    <h3
      style={{
        marginBottom: "1rem",
        color: "#1565c0",
      }}
    >
      Real-Time Telemetry Feed —
      {selectedSite}
    </h3>

    <TrendChart
      selectedSite={selectedSite}
      data={
        selectedSite === "All Sites"
          ? historicalTrends
          : historicalTrends.filter(
              (entry) =>
                entry.siteName ===
                selectedSite
            )
      }
    />
  </div>
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