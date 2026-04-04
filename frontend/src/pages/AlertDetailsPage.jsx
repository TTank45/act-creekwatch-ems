import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlertById } from "../services/alertService";
import StatusBadge from "../components/common/StatusBadge";

function AlertDetailsPage() {
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlertDetails() {
      try {
        const data = await getAlertById(id);
        setAlert(data);
      } catch (error) {
        console.error(error);
        setError("Could not load alert details.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlertDetails();
  }, [id]);

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Alert Details</h1>
          <p>Loading alert details...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <h1>Alert Details</h1>
          <p>{error}</p>
          <Link to="/alerts" className="btn btn-secondary">
            Back to Alerts
          </Link>
        </div>
      </section>
    );
  }

  if (!alert) {
    return (
      <section className="page">
        <div className="container">
          <h1>Alert Details</h1>
          <p>Alert not found.</p>
          <Link to="/alerts" className="btn btn-secondary">
            Back to Alerts
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Alert Details</h1>
          <p>
            Detailed environmental alert information for monitoring and follow-up.
          </p>
        </div>

        <div className="card alert-details-card">
          <div className="alert-card-top">
            <h2>{alert.title}</h2>
            <StatusBadge status={alert.severity} />
          </div>

          <div className="alert-details-grid">
            <div>
              <p><strong>Location:</strong> {alert.location}</p>
              <p><strong>Time:</strong> {alert.time}</p>
              <p><strong>Status:</strong> {alert.status}</p>
            </div>

            <div>
              <p><strong>Parameter:</strong> {alert.parameter}</p>
              <p><strong>Value:</strong> {alert.value} {alert.unit}</p>
            </div>
          </div>

          <div className="alert-detail-body">
            <h3>Description</h3>
            <p>{alert.description}</p>
          </div>

          <div className="alert-actions">
            <Link to="/alerts" className="btn btn-primary">
  Return to Alerts
</Link>
            <Link to="/alerts" className="btn btn-secondary">
              Back to Alerts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlertDetailsPage;