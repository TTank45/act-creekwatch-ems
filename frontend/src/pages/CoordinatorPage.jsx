import { useEffect, useState } from "react";
import { getPublicDashboardData } from "../services/dashboardService";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";

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
        </div>

        {/* 🔥 ADD SITE FORM */}
        <SectionCard title="Add New Monitoring Site">
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Site Name"
              value={newSite.name}
              onChange={(e) =>
                setNewSite({ ...newSite, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Latitude"
              value={newSite.lat}
              onChange={(e) =>
                setNewSite({ ...newSite, lat: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Longitude"
              value={newSite.lng}
              onChange={(e) =>
                setNewSite({ ...newSite, lng: e.target.value })
              }
            />

            <button onClick={handleAddSite}>Add Site</button>
          </div>
        </SectionCard>

        {/*  MONITORING SITES */}
        <SectionCard title="Monitoring Sites">
          <ul className="data-list">
            {allSites.map((site) => (
              <li key={site.id}>
                <strong>{site.name}</strong> —{" "}
                <StatusBadge status={site.status || "Good"} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </section>
  );
}

export default CoordinatorPage;