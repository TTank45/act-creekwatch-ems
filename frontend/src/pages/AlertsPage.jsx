import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertService";
import AlertCard from "../components/alerts/AlertCard";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error(error);
        setError("Could not load alerts.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  function handleExportCsv() {
    if (!alerts.length) return;

    const headers = [
      "id",
      "title",
      "severity",
      "location",
      "time",
      "parameter",
      "value",
      "unit",
      "status",
      "description",
    ];

    const csvRows = [
      headers.join(","),
      ...alerts.map((alert) =>
        headers
          .map((header) => {
            const value = alert[header] ?? "";
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "creekwatch_alerts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Alerts</h1>
          <p>Loading alerts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <h1>Alerts</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Environmental Alerts</h1>
          <p>
            Review recent environmental issues, threshold breaches, and water
            quality warnings across monitored creek locations.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportCsv}
            disabled={!alerts.length}
          >
            Export Alerts CSV
          </button>
        </div>

        <div className="alerts-grid">
          {alerts.length > 0 ? (
            alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          ) : (
            <p>No alerts available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AlertsPage;