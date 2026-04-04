function BadgeList({ badges }) {
  return (
    <div className="badge-list">
      {badges.map((badge, index) => (
        <span key={index} className="badge-pill">
          {badge}
        </span>
      ))}
    </div>
  );
}

export default BadgeList;