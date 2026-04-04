function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  let badgeClass = "status-badge";

  if (normalizedStatus === "good") {
    badgeClass += " status-good";
  } else if (normalizedStatus === "moderate") {
    badgeClass += " status-moderate";
  } else if (normalizedStatus === "poor" || normalizedStatus === "high") {
    badgeClass += " status-poor";
  }

  return <span className={badgeClass}>{status}</span>;
}

export default StatusBadge;