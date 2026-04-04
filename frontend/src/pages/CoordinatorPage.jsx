import { useEffect, useState } from "react";
import SectionCard from "../components/common/SectionCard";
import StatCard from "../components/common/StatCard";

const API_BASE_URL = "http://localhost:5000/api";

function CoordinatorPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCoordinatorData() {
      try {
        const response = await fetch(`${API_BASE_URL}/coordinator`);
        if (!response.ok) throw new Error("Failed to fetch coordinator data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Could not load coordinator dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchCoordinatorData();
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading coordinator dashboard...</p>;
  }

  if (error) {
    return <p style={{ padding: "2rem" }}>{error}</p>;
  }

  if (!data) {
    return <p style={{ padding: "2rem" }}>No data available.</p>;
  }

  const { summary, recentUploads, recentAlerts } = data;

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Coordinator Dashboard</h1>
          <p>System-wide overview of uploads, alerts, and monitoring activity.</p>
        </div>

        {/* Summary Stats */}
        <div className="top-stats-grid">
          <StatCard label="Total Uploads" value={summary.totalUploads} />
          <StatCard label="Total Alerts" value={summary.totalAlerts} />
          <StatCard label="Monitoring Sites" value={summary.totalMonitoringSites} />
          <StatCard label="System Status" value={summary.currentSystemStatus} />
        </div>

        <div className="dashboard-grid">
          {/* Recent Uploads */}
          <SectionCard title="Recent Uploads">
            {recentUploads.length > 0 ? (
              <ul className="data-list">
                {recentUploads.map((upload) => (
                  <li key={upload.id}>
                    <strong>{upload.fileName}</strong>
                    <br />
                    <small>{upload.uploadedAt}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No uploads found.</p>
            )}
          </SectionCard>

          {/* Recent Alerts */}
          <SectionCard title="Recent Alerts">
            {recentAlerts.length > 0 ? (
              <ul className="data-list">
                {recentAlerts.map((alert) => (
                  <li key={alert.id}>
                    <strong>{alert.title}</strong>
                    <br />
                    <span>{alert.location}</span>
                    <br />
                    <small>{alert.time}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No alerts found.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

export default CoordinatorPage;