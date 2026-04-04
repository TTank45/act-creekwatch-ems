function ContributionStats({ contributions }) {
  return (
    <div className="stats-grid">
      <div className="mini-stat-card">
        <span className="mini-stat-label">Total Uploads</span>
        <strong className="mini-stat-value">{contributions.totalUploads}</strong>
      </div>

      <div className="mini-stat-card">
        <span className="mini-stat-label">Sites Visited</span>
        <strong className="mini-stat-value">{contributions.sitesVisited}</strong>
      </div>

      <div className="mini-stat-card">
  <span className="mini-stat-label">Alerts Triggered</span>
  <strong className="mini-stat-value">{contributions.alertsSubmitted}</strong>
</div>

      <div className="mini-stat-card">
        <span className="mini-stat-label">Data Quality</span>
        <strong className="mini-stat-value">{contributions.dataQualityScore}%</strong>
      </div>
    </div>
  );
}

export default ContributionStats;