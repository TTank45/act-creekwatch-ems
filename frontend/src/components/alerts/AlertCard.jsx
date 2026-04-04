import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

function AlertCard({ alert }) {
  return (
    <div className="card alert-card">
      <div className="alert-card-top">
        <h2>{alert.title}</h2>
        <StatusBadge status={alert.severity} />
      </div>

      <div className="alert-meta">
        <p><strong>Location:</strong> {alert.location}</p>
        <p><strong>Time:</strong> {alert.time}</p>
        <p><strong>Parameter:</strong> {alert.parameter}</p>
        <p><strong>Value:</strong> {alert.value} {alert.unit}</p>
      </div>

      <p className="alert-description-preview">{alert.description}</p>

      <Link to={`/alerts/${alert.id}`} className="btn btn-secondary">
        View Details
      </Link>
    </div>
  );
}

export default AlertCard;