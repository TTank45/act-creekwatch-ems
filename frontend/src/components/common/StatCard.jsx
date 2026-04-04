function StatCard({ label, value, unit }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">
        {value} {unit && <span className="stat-unit">{unit}</span>}
      </strong>
    </div>
  );
}

export default StatCard;