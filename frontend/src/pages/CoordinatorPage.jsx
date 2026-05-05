import { useEffect, useState } from "react";
import { getPublicDashboardData } from "../services/dashboardService";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import {
  triggerPollutionSpike,
  toggleSimulator,
  restoreNormalConditions,
} from "../services/dashboardService";
function CoordinatorPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newSite, setNewSite] = useState({
    name: "",
    lat: "",
    lng: "",
  });

  const [customSites, setCustomSites] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPublicDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(() => {
  fetchData();
}, 10000);

return () => clearInterval(interval);
    
  }, []);

  function handleAddSite() {
    if (!newSite.name || !newSite.lat || !newSite.lng) {
      alert("Please fill all fields");
      return;
    }

    const newSiteObject = {
      id: Date.now(),
      name: newSite.name,
      lat: Number(newSite.lat),
      lng: Number(newSite.lng),
      status: "Good",
    };

    setCustomSites([...customSites, newSiteObject]);

    setNewSite({
      name: "",
      lat: "",
      lng: "",
    });
  }

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Coordinator Dashboard</h1>
          

          <p>Loading data...</p>
        </div>
      </section>
    );
  }
const systemLogs = dashboardData?.systemLogs || [];
  const allSites = [
    ...(dashboardData?.monitoringSites || []),
    ...customSites,
  ];

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Coordinator Dashboard</h1>
          <p>
            Manage monitoring sites, view system-wide data, and oversee
            environmental conditions.
          </p>
          <div
  style={{
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  }}
>
  <button
    onClick={async () => {
      try {
        await triggerPollutionSpike();
        alert("Critical pollution event triggered");
      } catch (error) {
        console.error(error);
      }
    }}
    style={{
      padding: "10px 16px",
      background: "#c62828",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Trigger Critical Event
  </button>

  <button
    onClick={async () => {
      try {
        await restoreNormalConditions();
        alert("System restored to normal");
      } catch (error) {
        console.error(error);
      }
    }}
    style={{
      padding: "10px 16px",
      background: "#2e7d32",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Restore Normal
  </button>

  <button
    onClick={async () => {
      try {
        await toggleSimulator(false);
        alert("Simulator disabled");
      } catch (error) {
        console.error(error);
      }
    }}
    style={{
      padding: "10px 16px",
      background: "#616161",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Disable Simulator
  </button>

  <button
    onClick={async () => {
      try {
        await toggleSimulator(true);
        alert("Simulator enabled");
      } catch (error) {
        console.error(error);
      }
    }}
    style={{
      padding: "10px 16px",
      background: "#1565c0",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Enable Simulator
  </button>
</div>
        </div>
<SectionCard title="Live System Activity">
  {systemLogs.length > 0 ? (
    <ul className="data-list">
      {systemLogs.map((log) => (
        <li key={log.id}>
          <strong>{log.time}</strong> — {log.message}
        </li>
      ))}
    </ul>
  ) : (
    <p>No recent system activity.</p>
  )}
</SectionCard>

        {/*  MONITORING SITES */}
      </div>
    </section>
  );
}

export default CoordinatorPage;